const CACHE_NAME = 'fitbro-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap'
];

// Install: Cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate Strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests unless they are fonts/CDN
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('googleapis') && 
      !event.request.url.includes('gstatic') &&
      !event.request.url.includes('tailwindcss')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        
        // Return cached version immediately, or wait for network if not in cache
        return cachedResponse || fetchPromise;
      });
    }).catch(() => {
      // Fallback for when both network and cache fail
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
    })
  );
});