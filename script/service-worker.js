self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('darksl-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/UserData/Logo.png',
                // Add other assets you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
