/* ==========================================================================
   BEYBLADE X TOURNAMENT - SERVICE WORKER (OFFLINE FIRST & PWA)
   ========================================================================== */
const CACHE_NAME = 'beyblade-x-v1.0.3';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './audio/go-shoot.mp3',
  './audio/bgm.mp3',
  './icons/favicon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

function putInCache(request, response) {
  if (response && response.status === 200) {
    const clone = response.clone();
    void caches.open(CACHE_NAME).then((cache) => void cache.put(request, clone));
  }
  return response;
}

globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => globalThis.skipWaiting())
  );
});

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => globalThis.clients.claim())
  );
});

globalThis.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass Firebase Realtime Database live websocket & REST traffic
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('googleapis.com')) {
    return;
  }

  // Navigation requests: Network-first, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => putInCache(request, networkResponse))
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static assets: Cache-first with background network revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        void fetch(request)
          .then((networkResponse) => putInCache(request, networkResponse))
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => putInCache(request, networkResponse));
    })
  );
});
