// ContentAI Service Worker v1.0
const CACHE_NAME = 'contentai-v1';
const ASSETS = [
  '/ContentAI/',
  '/ContentAI/index.html',
  '/ContentAI/style.css',
  '/ContentAI/app.js',
  '/ContentAI/manifest.json'
];

// Install — cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/ContentAI/'));
    })
  );
});
