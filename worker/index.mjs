import assets from 'visionhaus:assets';
import { handleSubmission } from './requests.mjs';
import { handleBriefAnalysis } from './brief.mjs';
import { handleZoho } from './zoho.mjs';

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
    const asset = assets[pathname === '/' ? '/index.html' : pathname];
    if (!asset) return new Response('Not found', { status: 404 });
    const body =
      request.method === 'HEAD'
        ? null
        : new Blob([Uint8Array.from(atob(asset.body), (c) => c.charCodeAt(0))])
            .stream()
            .pipeThrough(new DecompressionStream('gzip'));
    return new Response(body, {
      headers: {
        'Content-Type': asset.type,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      },
    });
  },
};
