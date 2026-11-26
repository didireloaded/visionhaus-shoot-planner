import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
execFileSync(process.execPath, ['scripts/build.mjs']);
const { default: worker } = await import('../dist/server/index.js?build=' + Date.now());
const request = (url, method = 'GET') => new Request('https://vh.example' + url, { method });
async function verify(dir = 'public', prefix = '') {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = dir + '/' + entry.name,
      url = prefix + '/' + entry.name;
    if (entry.isDirectory()) {
      await verify(file, url);
      continue;
    }
    const response = await worker.fetch(request(url), {});
    assert.equal(response.status, 200, url);
    assert.equal(response.headers.get('Cache-Control'), 'no-cache');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    const bytes = Buffer.from(await response.arrayBuffer()),
      source = await readFile(file);
    if (url === '/sw.js') assert.match(bytes.toString(), /vh-shell-[a-f0-9]{12}/);
    else assert.deepEqual(bytes, source, url + ' round trips through the build');
  }
}
await verify();
assert.equal((await worker.fetch(request('/'), {})).status, 200);
assert.equal(await (await worker.fetch(request('/app.js', 'HEAD'), {})).text(), '');
assert.equal((await worker.fetch(request('/app.js', 'POST'), {})).status, 405);
assert.equal((await worker.fetch(request('/missing'), {})).status, 404);
assert.equal((await worker.fetch(request('/api/missing'), {})).status, 404);
assert.equal((await worker.fetch(request('/api/requests'), {})).status, 405);
assert.equal((await worker.fetch(request('/api/brief'), {})).status, 405);
assert.equal((await worker.fetch(request('/api/zoho/status'), {})).status, 403);
console.log(
  'Bundled routes, static byte integrity, cache version, HEAD and response headers passed.',
);

// A real asset edit must produce a different installed-shell identity. Build an
// isolated copy so this regression cannot alter the developer's draft or files.
const { cp, mkdtemp, mkdir, writeFile, rm } = await import('node:fs/promises');
const { tmpdir } = await import('node:os');
const { join, resolve } = await import('node:path');
const vm = await import('node:vm');
const readShell = async (worker) => {
  const script = await (await worker.fetch(request('/sw.js'), {})).text();
  const context = { self: { addEventListener() {} } };
  vm.createContext(context);
  vm.runInContext(script + '\nresult={cache:CACHE,shell:SHELL};', context);
  return context.result;
};
const current = await readShell(worker);
assert.ok(current.shell.includes('/ui/plan.mjs'));
assert.ok(current.shell.includes('/ui/brief.mjs'));
assert.ok(current.shell.includes('/icons.mjs'));
assert.ok(!current.shell.includes('/vendor/lucide.min.js'));
const fixture = await mkdtemp(join(tmpdir(), 'vh-build-'));
try {
  await cp('worker', join(fixture, 'worker'), { recursive: true });
  await cp('public', join(fixture, 'public'), { recursive: true });
  await mkdir(join(fixture, '.openai'));
  await cp('.openai/hosting.json', join(fixture, '.openai/hosting.json'));
  await writeFile(join(fixture, 'package.json'), '{"type":"module"}');
  await writeFile(join(fixture, 'public', 'cache-check.mjs'), 'export const changed = true;\n');
  execFileSync(process.execPath, [resolve('scripts/build.mjs')], { cwd: fixture });
  const { default: changed } = await import('file://' + join(fixture, 'dist/server/index.js'));
  const updated = await readShell(changed);
  assert.notEqual(updated.cache, current.cache);
  assert.ok(updated.shell.includes('/cache-check.mjs'));
} finally {
  await rm(fixture, { recursive: true, force: true });
}
console.log('Asset edits invalidate the shell and every split browser module is cached.');
