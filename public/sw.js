const CACHE='vh-zoho-quotes-v16';
const SHELL=['/','/style.css','/app.js','/submission.mjs','/domain.mjs','/dates.mjs','/rentals.mjs','/brand-mark.png','/visionhaus-logo.png','/icon-192.png','/icon-512.png','/manifest.webmanifest','/vendor/lucide.min.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(response=>response||new Response('Offline',{status:503}))));});
