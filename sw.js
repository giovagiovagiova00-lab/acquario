/* Service worker di "Una giornata all'Acquario".

   ⚠️ QUANDO AGGIORNI IL GIOCO, CAMBIA IL NUMERO QUI SOTTO.
   È l'unica cosa da fare: al cambio, le cache vecchie vengono
   cancellate da sole su tutti i telefoni. */
const VERSIONE = 'acquario-v6';

/* Il guscio dell'app: serve perché il gioco parta anche senza rete. */
const GUSCIO = [
  './', './index.html', './manifest.json',
  './acquario.ico', './icona-32.png', './icona-180.png',
  './icona-192.png', './icona-512.png', './icona-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSIONE)
      .then(c => Promise.allSettled(GUSCIO.map(u => c.add(u))))
      .then(() => self.skipWaiting())      // il nuovo prende subito il posto del vecchio
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== VERSIONE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

/* Due strategie diverse, ed è questo che fa arrivare l'aggiornamento subito:

   · la PAGINA (index.html) si chiede sempre alla rete per prima, così chi
     riapre il gioco vede immediatamente la versione nuova. Se la rete non
     c'è, si ripiega sulla copia salvata e il gioco funziona lo stesso.

   · le IMMAGINI e i font si prendono dalla cache quando ci sono, perché non
     cambiano quasi mai e scaricarli di nuovo sarebbe solo lentezza.        */
function èPagina(req){
  return req.mode === 'navigate' ||
         (req.destination === 'document') ||
         req.url.endsWith('/index.html') ||
         req.url.endsWith('/manifest.json');
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  if (èPagina(e.request)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copia = res.clone();
          caches.open(VERSIONE).then(c => c.put(e.request, copia)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(salvata => {
      if (salvata) return salvata;
      return fetch(e.request).then(res => {
        const copia = res.clone();
        caches.open(VERSIONE).then(c => c.put(e.request, copia)).catch(() => {});
        return res;
      }).catch(() => salvata);
    })
  );
});
