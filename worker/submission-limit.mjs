// Fixed windows in D1 are shared by every Worker instance. Store only a hash of
// the connecting IP, never contact details or brief text. No in-memory fallback.
export async function allowSubmission(request, env, now = Date.now()) {
  if (!env.DB) throw new Error('Submission limiter database unavailable');
  const ip = Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(request.headers.get('CF-Connecting-IP') || 'anonymous'),
      ),
    ),
    (byte) => byte.toString(16).padStart(2, '0'),
  ).join('');
  const hour = Math.floor(now / 3600000),
    day = Math.floor(now / 86400000);
  await env.DB.prepare('DELETE FROM quote_rate_limits WHERE expires_at < ?').bind(now).run();
  for (const [bucket, limit, expiry] of [
    [`request:ip:${ip}:${hour}`, 36, (hour + 1) * 3600000],
    [`request:day:${day}`, 150, (day + 1) * 86400000],
  ]) {
    const row = await env.DB.prepare(
      'INSERT INTO quote_rate_limits (bucket,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts = attempts + 1 WHERE attempts < ? RETURNING attempts',
    )
      .bind(bucket, expiry, limit)
      .first();
    if (!row) return false;
  }
  return true;
}
