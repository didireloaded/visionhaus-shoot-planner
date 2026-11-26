import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { readFile, writeFile, mkdir, readdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const mime = {
  '.pdf': 'application/pdf',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.webmanifest': 'application/manifest+json',
};
const files = [];
async function scan(dir) {
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await scan(file);
    else
      files.push({
        url: '/' + path.relative(publicDir, file).split(path.sep).join('/'),
        bytes: await readFile(file),
        type: mime[path.extname(file)] || 'application/octet-stream',
      });
  }
}
await scan(publicDir);
// Fingerprint the browser entry and CSS while keeping stable source URLs available.
const browser = await build({
  entryPoints: [path.join(publicDir, 'app.js')],
  bundle: true,
  write: false,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  external: ['/vendor/pdfjs/*'],
});
const appBytes = Buffer.from(browser.outputFiles[0].contents);
// Older cached HTML may still request the stable entry URL. It must also be executable.
files.find(file => file.url === '/app.js').bytes = appBytes;
const appUrl =
  '/assets/app-' + createHash('sha256').update(appBytes).digest('hex').slice(0, 12) + '.js';
const css = files.find((f) => f.url === '/style.css');
const cssBytes = Buffer.from(
  (
    await build({
      stdin: { contents: css.bytes.toString(), loader: 'css' },
      write: false,
      minify: true,
    })
  ).outputFiles[0].contents,
);
const cssUrl =
  '/assets/style-' + createHash('sha256').update(cssBytes).digest('hex').slice(0, 12) + '.css';
files.push(
  { url: appUrl, bytes: appBytes, type: mime['.js'] },
  { url: cssUrl, bytes: cssBytes, type: mime['.css'] },
);
const html = files.find((f) => f.url === '/index.html');
html.bytes = Buffer.from(
  html.bytes
    .toString()
    .replace('/app.js', appUrl)
    .replace('/style.css', cssUrl)
    .replace(
      '</head>',
      `<link rel="preload" as="style" href="${cssUrl}"><link rel="modulepreload" href="${appUrl}"></head>`,
    ),
);
const digest = createHash('sha256');
for (const file of files) digest.update(file.url).update('\0').update(file.bytes).update('\0');
const version = digest.digest('hex').slice(0, 12);
const shell = files
  .filter(
    (file) =>
      !file.url.startsWith('/vendor/pdfjs/') &&
      /\.(?:js|mjs|css|png|jpg|webp|avif|webmanifest)$/.test(file.url) &&
      file.url !== '/sw.js',
  )
  .map((file) => file.url);
shell.unshift('/');
const assets = {};
for (const file of files) {
  const bytes =
    file.url === '/sw.js'
      ? Buffer.from(
          file.bytes
            .toString()
            .replace('vh-shell-build', 'vh-shell-' + version)
            .replace('__VH_SHELL_ASSETS__', JSON.stringify(shell)),
        )
      : file.bytes;
  assets[file.url] = {
    body: gzipSync(bytes).toString('base64'),
    type: file.type,
    etag: '"' + createHash('sha256').update(bytes).digest('hex').slice(0, 24) + '"',
  };
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await build({
  entryPoints: ['worker/index.mjs'],
  outfile: 'dist/server/index.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  plugins: [
    {
      name: 'sites-assets',
      setup(bundler) {
        bundler.onResolve({ filter: /^visionhaus:assets$/ }, () => ({
          path: 'assets',
          namespace: 'sites-assets',
        }));
        bundler.onLoad({ filter: /.*/, namespace: 'sites-assets' }, () => ({
          contents: 'export default ' + JSON.stringify(assets),
          loader: 'js',
        }));
      },
    },
  ],
});
await copyFile('.openai/hosting.json', 'dist/.openai/hosting.json');
console.log(`Bundled Worker and ${files.length} compressed assets; shell ${version}.`);
