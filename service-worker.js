const cacheName = "cache-v2";

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll([
                "/",
                "/index.html",

                "/dist/editor.bundle.js",

                "/css/style.css",
                "/css/editor.css",

                "/media/App-Icon.png",
                "/media/favicon.ico",
                "/media/file.svg",
                "/media/psc.svg",
                "/media/desktop.png",
                "/media/phone.png",

                "/PS2/main.py",
                "/PS2/ps2/__init__.py",
                "/PS2/ps2/app.py",
                "/PS2/ps2/expr/__init__.py",
                "/PS2/ps2/expr/expression.py",
                "/PS2/ps2/interpret/__init__.py",
                "/PS2/ps2/interpret/interpretor.py",
                "/PS2/ps2/parser/__init__.py",
                "/PS2/ps2/parser/parser.py",
                "/PS2/ps2/scan/__init__.py",
                "/PS2/ps2/scan/ps2_token.py",
                "/PS2/ps2/scan/scanner.py",
                "/PS2/ps2/statement/__init__.py",
                "/PS2/ps2/statement/statement.py",
                "/PS2/ps2/symbol_table/__init__.py",
                "/PS2/ps2/symbol_table/environment.py",
                "/PS2/ps2/utilities.py"
            ])
                .then(() => {console.log("Cached files!")})
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith((async () => {
        const r = await caches.match(e.request.url);

        if (r && !navigator.onLine) return r;

        const response = await fetch(e.request);

        if (e.request.url.startsWith('http')) {
            const cache = await caches.open(cacheName);
            await cache.put(e.request.url, response.clone());
            console.log(await caches.match(e.request.url))
        }

        return response;
    })());
});
