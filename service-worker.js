
const CACHE_NAME = "playland-checklist-v2";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalar el Service Worker y guardar archivos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS);
    })
  );

  self.skipWaiting();
});

// Activar el Service Worker y eliminar cachés anteriores
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      );
    })
  );

  self.clients.claim();
});

// Buscar primero en caché y después en la red
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      if (respuestaCache) {
        return respuestaCache;
      }

      return fetch(event.request);
    })
  );
});
