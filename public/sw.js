const CACHE_NAME = 'avorria-aos-v1'
const STATIC_ASSETS = [
  '/aos/mobile',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if pages not yet cached
      })
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'offline', queued: true }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    return
  }

  // Cache-first for AOS mobile shell
  if (url.pathname.startsWith('/aos/mobile')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          }
          return res
        })
        return cached || fetchPromise
      })
    )
    return
  }
})

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-survey-data') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_REQUESTED' }))
      })
    )
  }
})
