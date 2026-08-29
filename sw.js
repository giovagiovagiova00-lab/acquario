/* Service worker di "Una giornata all'Acquario".
   All'installazione mette in cache il guscio dell'app; poi salva ogni
   immagine e ogni font man mano che vengono richiesti, così dalla
   seconda apertura il gioco funziona senza rete.

   ⚠️ OGNI VOLTA CHE AGGIORNI IL GIOCO, CAMBIA IL NUMERO QUI SOTTO.
   Senza quel cambio i telefoni continuano a servire la versione vecchia. */
const VERSIONE = 'acquario-v5';

const GUSCIO = [
  './', './index.html', './manifest.json',
  './acquario.ico', './icona-32.png', './icona-180.png',
  './icona-192.png', './icona-512.png', './icona-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSIONE)
      /* uno per uno: se manca un file l'installazione non fallisce tutta */
      .then(c => Promise.allSettled(GUSCIO.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(salvata => {
      if (salvata) return salvata;
      return fetch(e.request).then(res => {
        const copia = res.clone();
        caches.open(VERSIONE).then(c => c.put(e.request, copia)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
