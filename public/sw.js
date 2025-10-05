// NASA Fire & Flood Globe - Service Worker
// Offline-first cache strategy for instant image loading

const CACHE_NAME = 'nasa-globe-v1';
const RUNTIME_CACHE = 'nasa-runtime-v1';

// Cache all NASA GIBS imagery requests
const GIBS_URL = 'https://gibs.earthdata.nasa.gov';

// Install event - setup cache
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache opened');
      // Pre-cache critical assets
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - cache-first strategy for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle GIBS imagery requests
  if (url.origin === GIBS_URL) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Cache hit - return immediately (INSTANT!)
            console.log('[SW] Cache HIT:', url.pathname.substring(0, 50) + '...');
            return cachedResponse;
          }
          
          // Cache miss - fetch and cache
          console.log('[SW] Cache MISS, fetching:', url.pathname.substring(0, 50) + '...');
          return fetch(request).then((response) => {
            // Only cache successful responses
            if (response.status === 200) {
              // Clone the response before caching
              cache.put(request, response.clone());
            }
            return response;
          }).catch((error) => {
            console.error('[SW] Fetch failed:', error);
            throw error;
          });
        });
      })
    );
  } else {
    // For non-GIBS requests, use network-first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Message event - handle cache management commands
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(RUNTIME_CACHE).then(() => {
        console.log('[SW] Runtime cache cleared');
        return caches.open(RUNTIME_CACHE);
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.keys().then((keys) => {
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'CACHE_SIZE',
                size: keys.length,
              });
            });
          });
        });
      })
    );
  }
});
