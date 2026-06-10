const CACHE_NAME = 'tradeedge-ai-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ---- Install ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ---- Activate ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- Fetch ----
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network-first for API calls (with offline fallback to cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request.clone())
        .then((response) => {
          if (response.ok && request.method === 'GET') {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cloned);
            });
          }
          return response;
        })
        .catch(() => {
          if (request.method === 'GET') {
            return caches.match(request).then(cached => {
              if (cached) return cached;
              return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            });
          }
          
          // For non-GET requests (like POST /api/analyze)
          if (url.pathname === '/api/analyze') {
            return new Response(
              JSON.stringify({ error: 'offline', detail: 'No network connection.' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          }
          return new Response(JSON.stringify({ error: 'failed' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Cache-first for static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          return response;
        });
      })
    );
    return;
  }

  // Default: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ---- Push Notifications ----
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'TradeEdge AI', body: 'New trade signal available!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'tradeedge-notification',
    })
  );
});
