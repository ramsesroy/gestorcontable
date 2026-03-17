// CMS Cobranzas — Service Worker v3
var CACHE_NAME = 'cms-cobranzas-v3';
var URLS_TO_CACHE = [
    './',
    './login.html',
    './registration.html',
    './search.html',
    './dashboard.html',
    './courses.html',
    './branches.html',
    '../../public/css/app.css',
    '../../public/css/material-icons.css',
    '../../public/css/fontawesome.css',
    '../../public/css/preloader.css',
    '../../public/vendor/spinkit.css',
    '../../public/vendor/perfect-scrollbar.css',
    '../../public/vendor/jquery.min.js',
    '../../public/vendor/popper.min.js',
    '../../public/vendor/bootstrap.min.js',
    '../../public/vendor/perfect-scrollbar.min.js',
    '../../public/vendor/dom-factory.js',
    '../../public/vendor/material-design-kit.js',
    '../../public/vendor/Chart.min.js',
    '../../public/js/app.js',
    '../../public/js/preloader.js',
    '../../public/images/illustration/student/128/white.svg'
];

// Install: cache the app shell
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (name) {
                    return name !== CACHE_NAME;
                }).map(function (name) {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first for API calls, Cache-first for static assets
self.addEventListener('fetch', function (event) {
    var url = event.request.url;

    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    // Skip non-http schemes (chrome-extension, etc)
    if (!url.startsWith('http')) return;

    // Always go to network for Supabase API calls
    if (url.includes('supabase.co') || url.includes('cdn.jsdelivr') || url.includes('cdn.sheetjs') || url.includes('fonts.googleapis')) {
        event.respondWith(
            fetch(event.request).catch(function () {
                // If offline and it's a page, show cached version
                return caches.match(event.request);
            })
        );
        return;
    }

    // Network-first for HTML pages
    if (url.includes('.html') || event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).then(function (networkResponse) {
                if (networkResponse && networkResponse.status === 200) {
                    var responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(function () {
                return caches.match(event.request);
            })
        );
        return;
    }

    // Cache-first for local static assets (CSS, JS, Fonts, Images)
    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            if (cachedResponse) {
                // Return cached, but also update cache in background
                fetch(event.request).then(function (networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(function () { /* offline, ignore */ });
                return cachedResponse;
            }
            return fetch(event.request).then(function (networkResponse) {
                if (networkResponse && networkResponse.status === 200) {
                    var responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
