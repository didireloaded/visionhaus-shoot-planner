import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allowSubmission } from '../worker/submission-limit.mjs';
import { handleSubmission } from '../worker/requests.mjs';
import { change, initial } from '../public/domain.mjs';
const dir = mkdtempSync(join(tmpdir(), 'vh-limits-')),
  file = join(dir, 'limits.sqlite');
const sqlite = new DatabaseSync(file);
sqlite.exec(
  'CREATE TABLE quote_rate_limits (bucket TEXT PRIMARY KEY,attempts INTEGER NOT NULL,expires_at INTEGER NOT NULL)',
);
const bind = (db) => ({
  prepare(sql) {
    const stmt = db.prepare(sql);
    let args = [];
    return {
      bind(...values) {
        args = values;
        return this;
      },
      async first() {
        return stmt.get(...args) || null;
      },
      async run() {
        return stmt.run(...args);
      },
    };
  },
});
const now = 10 * 86400000 + 1000;
const request = (ip) =>
  new Request('https://vh.example/api/requests', { headers: { 'CF-Connecting-IP': ip } });
const first = { DB: bind(sqlite) };
const otherDb = new DatabaseSync(file),
  second = { DB: bind(otherDb) };
try {
  const results = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      allowSubmission(request('same-ip'), i % 2 ? first : second, now),
    ),
  );
  assert.equal(
    results.filter(Boolean).length,
    36,
    'Two instances share one atomic hourly allowance',
  );
  assert.equal(
    await allowSubmission(request('same-ip'), second, now + 3600000),
    true,
    'New hour allows another request',
  );
  for (let i = 0; i < 113; i++)
    assert.equal(await allowSubmission(request('visitor-' + i), first, now), true);
  assert.equal(
    await allowSubmission(request('another-ip'), second, now),
    false,
    'Daily cap spans IPs and hours',
  );
  assert.equal(
    await allowSubmission(request('another-ip'), second, now + 86400000),
    true,
    'New day resets the global budget',
  );
  const rows = sqlite.prepare('SELECT bucket FROM quote_rate_limits').all();
  assert.ok(rows.every((r) => !r.bucket.includes('another-ip')));
  assert.equal(
    sqlite
      .prepare('SELECT COUNT(*) AS n FROM quote_rate_limits WHERE expires_at < ?')
      .get(now + 86400000).n,
    0,
    'Expired windows are pruned',
  );
  await assert.rejects(allowSubmission(request('ip'), {}, now), /unavailable/);
  const state = {
    ...change(change(initial(), 'service', 'Video'), 'project', 'Interview'),
    name: 'Client',
    email: 'client@example.com',
  };
  const submit = () =>
    new Request('https://vh.example/api/requests', {
      method: 'POST',
      headers: { Origin: 'https://vh.example', 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'production', state, requestId: 'vh-' + 'a'.repeat(64) }),
    });
  const broken = {
    DB: {
      prepare() {
        throw new Error('offline');
      },
    },
    WEB3FORM_ACCESS_KEY: 'test-key',
  };
  assert.equal(
    (await handleSubmission(submit(), broken)).status,
    503,
    'D1 failure fails closed before provider writes',
  );
  assert.equal(
    (await handleSubmission(submit(), { WEB3FORM_ACCESS_KEY: 'test-key' })).status,
    503,
    'No DB must not fall back to per-instance memory',
  );
  console.log(
    'Submission limits: shared SQLite connections, concurrency, hourly/day resets, daily cap, hashed IPs, cleanup and fail-closed errors passed.',
  );
} finally {
  otherDb.close();
  sqlite.close();
  rmSync(dir, { recursive: true, force: true });
}
