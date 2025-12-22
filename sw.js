const CACHE_NAME = "chaihome-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./reading.html",
  "./writing.html",
  "./sleep.html",
  "./exercise.html",
  "./todo.html",
  "./goals.html",
  "./style.css",
  "./main.js",
  "./reading.js",
  "./writing.js",
  "./sleep.js",
  "./exercise.js",
  "./todo.js",
  "./goals.js",
  "./chatbot.js",
  "./chatbot.css",
  "./themePicker.js",
  "./monthlyChart.js",
  "./emotionHeatmap.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k===CACHE_NAME?null:caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event)=>{
  const req = event.request;
  // network-first for api.open-meteo
  if(req.url.includes("api.open-meteo.com")){
    event.respondWith(
      fetch(req).catch(()=>caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>{
      if(cached) return cached;
      return fetch(req).then(res=>{
        // cache new
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=>cached || new Response("离线中：资源暂不可用", {status: 503, headers:{"Content-Type":"text/plain; charset=utf-8"}}));
    })
  );
});
