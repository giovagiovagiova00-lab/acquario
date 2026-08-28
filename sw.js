/* Service worker di "Una giornata all'Acquario".
   Strategia: al primo caricamento mette in cache il guscio dell'app,
   poi salva ogni immagine e ogni font man mano che vengono richiesti.
   Dalla seconda apertura il gioco funziona senza rete.
   Per pubblicare una versione nuova, cambia il numero qui sotto. */
const VERSIONE = 'acquario-v1';

const GUSCIO = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  './icona-512-maskable.png',
  './icona-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSIONE)
      /* addAll fallisce tutto se un file manca: qui li aggiungiamo
         uno per uno così un'assenza non blocca l'installazione */
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
    caches.match(e.request).then(cache => {
      if (cache) return cache;                      // già salvato: rispondi subito
      return fetch(e.request).then(res => {
        /* salva per la prossima volta: immagini, font, tutto */
        const copia = res.clone();
        caches.open(VERSIONE).then(c => c.put(e.request, copia)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));  // offline e mai visto prima
    })
  );
});
