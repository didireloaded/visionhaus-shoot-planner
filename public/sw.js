const CACHE='vh-shell-build';
const SHELL=__VH_SHELL_ASSETS__;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('vh-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/zoho-'))return;
 // Navigation always reads the current shell. A waiting update never changes an active session.
 if(event.request.mode==='navigate'){
   event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match('/'))||fetch(event.request)));
   return;
 }
 event.respondWith(caches.open(CACHE).then(async cache=>{
   const cached=await cache.match(event.request);
   const refresh=fetch(event.request).then(response=>{if(response.ok)cache.put(event.request,response.clone());return response;});
   if(cached){event.waitUntil(refresh.catch(()=>{}));return cached;}
   return refresh.catch(()=>new Response('Offline',{status:503}));
 }));
});
