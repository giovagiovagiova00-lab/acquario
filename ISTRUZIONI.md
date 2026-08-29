# Aggiornare il gioco su GitHub Pages

## File da caricare nel repository (radice, non in sottocartelle)

```
index.html                  ← il gioco, versione con premessa, laghetto, sondaggio
manifest.json               ← nome, icone, "apri a tutto schermo"
sw.js                       ← offline + installazione
robots.txt                  ← tiene il gioco fuori da Google
acquario.ico
icona-32.png
icona-180.png               ← iPhone
icona-192.png
icona-512.png
icona-512-maskable.png      ← Android (icone ritagliate a cerchio)
img/                        ← le immagini, invariata
```

Sostituisci `index.html` con questo e aggiungi gli altri. La cartella `img`
resta com'è.

## Attivare GitHub Pages (se non l'hai già fatto)

Settings → Pages → Source: `Deploy from a branch`, ramo `main`,
cartella `/ (root)`. Dopo un minuto hai l'indirizzo
`https://tuonome.github.io/nomerepo/`.

## Installarlo

- **Android (Chrome):** apri l'indirizzo → ⋮ → *Installa app*
- **iPhone (Safari):** apri l'indirizzo → Condividi → *Aggiungi a Home*
  (solo da Safari, non da Chrome)
- **Computer (Chrome):** ⋮ → *Trasmetti, salva e condividi* → *Installa pagina come app*

## ⚠️ La regola da non dimenticare

Ogni volta che carichi una versione nuova del gioco, **cambia il numero
di versione in cima a `sw.js`**:

```js
const VERSIONE = 'acquario-v2';   // era v1
```

Quel numero è il nome della cache. Se resta uguale, chi ha già aperto il
gioco continuerà a vedere la versione vecchia salvata sul telefono, anche
dopo che hai caricato quella nuova. È l'errore classico.

## Offline

Funziona dalla seconda apertura. La prima volta le immagini vengono
salvate man mano che le incontri, quindi conviene fare un giro completo
del parco con la connessione attiva.

## Nota sul repository pubblico

Il gioco contiene nomi, foto e battute su una sessantina di colleghi reali.
`robots.txt` e il meta `noindex` lo tengono fuori dai motori di ricerca,
ma su un repository pubblico chiunque abbia l'indirizzo può entrare, e i
file sono sfogliabili anche da GitHub stesso.

Se vuoi che resti fra colleghi, l'alternativa gratuita è **Cloudflare Pages
+ Cloudflare Access**: carichi la stessa cartella, poi in Zero Trust crei
una regola che consente solo gli indirizzi email dei colleghi (o il dominio
aziendale). Chi non è in lista vede solo una schermata di login, e l'app
sul telefono si installa comunque.
