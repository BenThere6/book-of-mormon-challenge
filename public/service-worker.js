const CACHE_NAME = 'background-images-cache-v1';
const BACKGROUND_IMAGES = [
  'background-images/alma-baptizing.jpg',
  'background-images/alma-the-younger.jpg',
  'background-images/ammon.jpg',
  'background-images/brother-of-jared.jpg',
  'background-images/christ-in-america.jpg',
  'background-images/king-benjamin.jpg',
  'background-images/leaderboard-image.jpg',
  'background-images/settings-image.jpg',
  'background-images/history-image.jpg',
  'title-image.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(BACKGROUND_IMAGES);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (BACKGROUND_IMAGES.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});