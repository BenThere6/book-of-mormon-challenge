const CACHE_NAME = 'lehis-legacy-cache-v1';
const urlsToCache = [
  '/',
  '/index.html', // Adjust as needed for your app's main entry point
  // Include other static assets like CSS, images, and JavaScript bundles
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});