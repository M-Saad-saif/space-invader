let CACHE_NAME = "spaceinvader-cache-v1";
let urlsToCache = [
  "./",
  "./index.html",
  "./space invader.js",
  "./bg.jpg",
  "./game.png",
  "./hitinvader.wav",
  "./invaderpic.jpg",
  "./Plop.ogg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
