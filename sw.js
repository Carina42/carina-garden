// 小娜花园 · sw.js (very small offline cache)
const CACHE = "xn-garden-v11";
const ASSETS = [
  "/", "/index.html", "/reading.html", "/style.css", "/main.js", "/reading.js", "/manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try{
      const fresh = await fetch(req);
      return fresh;
    }catch(_){
      return caches.match("/index.html");
    }
  })());
});
