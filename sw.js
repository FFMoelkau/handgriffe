/* Service Worker – macht die App offline verfügbar.
   WICHTIG: Bei jeder Änderung an index.html die Versionsnummer erhöhen,
   sonst sehen die Handys weiterhin die alte Fassung.              */
const VERSION = 'handgriff-trainer-v1';
const DATEIEN = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(antwort => {
        const kopie = antwort.clone();
        caches.open(VERSION).then(c => c.put(e.request, kopie)).catch(() => {});
        return antwort;
      })
      .catch(() => caches.match(e.request).then(t => t || caches.match('./index.html')))
  );
});
