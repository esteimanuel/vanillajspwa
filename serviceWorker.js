const staticAssets=[
    './',
    './index.html',
    './style.css',
    './manga-chapter.js',
    './manga-info.js',
    './manga-list.js',
    './vaadin-router.js',
];

self.addEventListener('install', async event=>{
    const cache = await caches.open('static-cache');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.url){
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req){
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req){
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        // if (!req.includes('mangasimg')) {
            cache.put(req, res.clone());
        // }
        return res;
    } 
    catch (error) {
        return await cache.match(req);
    }
}