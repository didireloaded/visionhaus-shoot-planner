import assets from 'visionhaus:assets';
import { handleSubmission } from './requests.mjs';
import { handleBriefAnalysis } from './brief.mjs';
import { handleZoho } from './zoho.mjs';

// Decode compressed assets once per isolate. Uncompressed responses are memoized on demand.
const compressed = new Map(
  Object.entries(assets).map(([url, asset]) => [
    url,
    Uint8Array.from(atob(asset.body), (c) => c.charCodeAt(0)),
  ]),
);
const plain = new Map();
const appRoute =
  /^\/(?:package\/[a-z0-9-]+|plan(?:\/[a-z0-9-]+)?|hire(?:\/[a-z0-9-]+)?|saved|studio|brief|equipment)\/?$/;
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/brief') return handleBriefAnalysis(request, env);
    if (pathname === '/api/requests') return handleSubmission(request, env);
    if (
      pathname.startsWith('/api/zoho/') ||
      ['/zoho-connect', '/zoho-connected'].includes(pathname)
    )
      return handleZoho(request, env);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    if (!['GET', 'HEAD'].includes(request.method))
      return new Response('Method not allowed', { status: 405 });
    const key = pathname === '/' || appRoute.test(pathname) ? '/index.html' : pathname;
    const asset = assets[key];
    if (!asset) return new Response('Not found', { status: 404 });
    const gzip = /(?:^|,)\s*gzip\s*(?:,|$)/i.test(request.headers.get('Accept-Encoding') || '');
    const headers = {
      'Content-Type': asset.type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': key.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
      ETag: asset.etag,
      Vary: 'Accept-Encoding',
    };
    if (request.headers.get('If-None-Match') === asset.etag)
      return new Response(null, { status: 304, headers });
    if (gzip) headers['Content-Encoding'] = 'gzip';
    let body = null;
    if (request.method !== 'HEAD') {
      if (gzip) body = compressed.get(key);
      else {
        if (!plain.has(key))
          plain.set(
            key,
            new Response(
              new Blob([compressed.get(key)]).stream().pipeThrough(new DecompressionStream('gzip')),
            ).arrayBuffer(),
          );
        body = await plain.get(key);
      }
    }
    return new Response(body, { headers });
  },
};
