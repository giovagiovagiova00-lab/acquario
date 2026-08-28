# Come far girare il gioco fuori da Chrome e sul telefono

Il gioco resta un file HTML, ma con i file aggiunti in questa cartella diventa
una **web app installabile**: si apre da un'icona, occupa tutto lo schermo e
funziona anche senza connessione.

## Contenuto della cartella

```
acquario/
├─ index.html          ← il gioco (rinominato da acquario_game.html)
├─ manifest.json       ← nome, icone, "apri a tutto schermo"
├─ sw.js               ← fa funzionare tutto offline
├─ icona-192.png
├─ icona-512.png
├─ icona-512-maskable.png
├─ icona-180.png       ← icona per iPhone
└─ img/                ← le 90 immagini, invariata
```

**Il file va rinominato `index.html`**, altrimenti l'indirizzo del gioco
finisce con `/acquario_game.html` e l'installazione funziona peggio.

---

## 1. A tutto schermo sul computer, subito

Non serve niente di quanto sopra. Nel gioco vai su **Impostazioni →
Schermo intero → Sì**, oppure premi **F** in qualsiasi momento. Sparisce
tutta l'interfaccia di Chrome, comprese le schede. `Esc` esce.

L'impostazione resta salvata: la volta dopo, appena premi "Entra", parte
già a tutto schermo.

## 2. Un'icona sul desktop, senza barra di Chrome

Serve che la cartella sia raggiungibile via `http`, non via `file://`.
Due strade.

### Strada A — un server locale (offline, sul tuo computer)

Se hai Python installato, apri il Prompt dei comandi dentro la cartella e lancia:

```
python -m http.server 8000
```

Poi apri `http://localhost:8000`. Da lì Chrome ti offre **⋮ → Trasmetti,
salva e condividi → Installa pagina come app**. L'icona finisce sul desktop
e il gioco si apre in una finestra sua, senza barra degli indirizzi né schede.

Lo svantaggio: quel comando va rilanciato ogni volta che riavvii il PC.

### Strada B — pubblicare la cartella (consigliata)

È anche l'unico modo per averlo sul telefono, quindi tanto vale fare questa.
Vedi sotto.

---

## 3. Sul telefono, come un'app vera

Serve un indirizzo `https`. Il modo gratuito più semplice è **GitHub Pages**.

1. Crea un account su github.com se non ce l'hai.
2. Crea un repository nuovo, per esempio `acquario`, e mettilo **Public**.
3. Carica il contenuto della cartella (`index.html`, `manifest.json`, `sw.js`,
   le icone e **tutta la cartella `img`**). Si può fare da browser con
   "Add file → Upload files", trascinando tutto insieme.
4. Vai su **Settings → Pages**, alla voce *Source* scegli `Deploy from a branch`,
   ramo `main`, cartella `/ (root)`, e salva.
5. Dopo un minuto avrai un indirizzo tipo
   `https://tuonome.github.io/acquario/`.

Poi, dal telefono:

- **Android (Chrome):** apri l'indirizzo, tocca **⋮ → Installa app**.
- **iPhone (Safari):** apri l'indirizzo, tocca **Condividi → Aggiungi a Home**.
  Su iPhone funziona solo da Safari, non da Chrome.

Compare l'icona con il pesce. Toccandola il gioco parte a tutto schermo,
senza nessun elemento del browser.

### Funziona senza rete?

Sì, dalla seconda apertura. La prima volta lascia caricare qualche scena e
guarda un paio di padiglioni: `sw.js` salva in cache le immagini man mano
che vengono richieste. Da lì in poi va anche in aereo.

Se vuoi essere certo che sia tutto scaricato, fai un giro completo del parco
una volta con la connessione attiva.

### Quando aggiorni il gioco

Ricarica i file su GitHub **e** cambia il numero di versione in cima a `sw.js`:

```js
const VERSIONE = 'acquario-v2';   // era v1
```

Senza quel cambio i telefoni continuano a mostrare la versione vecchia
presa dalla cache.

---

## Note

- Le immagini restano dove sono, in `img/`. Non cambia niente nel codice.
- Aperto ancora con doppio click come file locale, il gioco funziona come
  prima: perde solo l'installazione e la modalità offline. In quel caso la
  console lo scrive.
- Su iPhone con il notch l'interfaccia ora tiene conto delle zone sicure,
  quindi soldi, stamina e capitolo non finiscono sotto la tacca.
