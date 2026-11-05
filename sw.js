/* Oś czasu – praca bez internetu: pliki aplikacji i biblioteka mapy z pamięci podręcznej */
const C="osczasu-v2";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png",
 "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css","https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  const shell=u.origin===location.origin||u.hostname==="cdnjs.cloudflare.com";
  if(!shell)return; /* mapa, adresy i Dysk Google zawsze z sieci */
  if(u.origin===location.origin&&(e.request.mode==="navigate"||u.pathname.endsWith("index.html"))){
    e.respondWith(fetch(e.request.url,{cache:"no-store",credentials:"same-origin"}).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const c=x.clone();caches.open(C).then(y=>y.put(e.request,c));return x;})));
});
