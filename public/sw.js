/**
 * Service Worker untuk CashPlan PWA.
 * Strategi: Cache-first untuk assets statis, network-first untuk navigasi.
 */

const CACHE_NAME = 'cashplan-v1';

// Assets yang di-cache saat install
const PRECACHE_ASSETS = ['/', '/manifest.json', '/icons/android/launchericon-192x192.png'];

// Install: cache assets awal
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

// Fetch: network-first untuk navigasi, cache-first untuk assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navigasi (HTML pages) — network first, fallback ke cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/')),
    );
    return;
  }

  // Assets statis — cache first, fallback ke network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Cache response baru untuk request berikutnya
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    }),
  );
});
