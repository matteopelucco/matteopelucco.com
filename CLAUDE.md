# CLAUDE.md — matteopelucco.com

## Progetto

Pagina placeholder "sito in costruzione" per matteopelucco.com.
Il nome è composto da migliaia di particelle campionate dai pixel del testo renderizzato su canvas offscreen: si disperdono al passaggio del cursore e si ricompongono con fisica spring. Estetica HUD (heads-up display), palette ciano → violetto.

**Versione corrente:** v0.2 — il numero di build è incrementale e viene aggiornato automaticamente ad ogni `npm run build`.

---

## Stack

- **Next.js 14** (App Router) — zero dipendenze extra oltre a React 18
- **Canvas API** (vanilla) per le particelle, **CSS puro** per HUD e animazioni
- **Font:** Archivo 800 (testo principale), JetBrains Mono (HUD)
- **Deploy:** GitHub → Vercel (framework Next.js, zero config) → Cloudflare DNS (proxy disabilitato, SSL gestito da Vercel)

---

## Struttura file

```
app/
  layout.jsx      # metadata, OG tags, font Google (Archivo + JetBrains Mono)
  page.jsx        # homepage — client component, canvas particle field + overlay HUD
  config.js       # UNICA sorgente di verità per testi, fisica e colori — modificare qui
  globals.css     # reset CSS minimale
  v3.css          # tutto lo stile HUD, angoli, scanline, animazioni, responsive

scripts/
  prebuild.js     # incrementa build.json (number + date) prima di ogni build

build.json        # stato del build corrente { number, date } — committare dopo ogni build
next.config.mjs   # legge build.json, espone BUILD_NUMBER e BUILD_DATE come env vars
package.json      # versione app, script (prebuild → build)
```

---

## Sviluppo locale

```bash
npm install
npm run dev      # http://localhost:3000  (prebuild NON gira in dev)
npm run build    # incrementa build.json, poi next build
```

---

## Build incrementale

Ogni `npm run build` esegue `scripts/prebuild.js` che:
1. Legge `build.json`
2. Incrementa `number` di 1
3. Aggiorna `date` alla data odierna (`YYYY-MM-DD`)
4. Riscrive il file

`next.config.mjs` inietta `BUILD_NUMBER` e `BUILD_DATE` come variabili d'ambiente al build time.
Il componente `page.jsx` le legge via `process.env.BUILD_NUMBER` / `process.env.BUILD_DATE`.

**Dopo ogni build di produzione committare `build.json`** per mantenere la sequenza coerente.

---

## Personalizzazione rapida

Tutto ciò che riguarda testi, fisica e colori è centralizzato in **`app/config.js`**:

| Chiave | Descrizione |
|---|---|
| `name` | Testo renderizzato come particelle |
| `hudTopLeft` / `hudVersion` | Label e versione in alto a sinistra |
| `hudTopRight` / `hudBottomLeft` / `hudBottomRight` | Altre label HUD |
| `springForce` | Forza di riattrazione verso la posizione target |
| `damping` | Smorzamento velocità (più alto = meno frizione) |
| `repulsionRadius` / `repulsionForce` | Raggio e intensità repulsione cursore |
| `particleSize` | Dimensione quadrato-particella in px |
| `colorCycleSpeed` | Velocità rotazione hue (gradi/sec, 0 = statico) |
| `colorHueSpread` | Ampiezza gradiente hue sinistra→destra (gradi) |
| `colorSaturation` / `colorLightness` | Saturazione e luminosità HSL |

---

## Convenzioni

- Nessun CSS-in-JS, nessuna libreria di stile: tutto in `v3.css`
- Il canvas usa `devicePixelRatio` (max 2) per nitidezza su Retina
- `prefers-reduced-motion`: le particelle vengono renderizzate statiche, nessuna animazione canvas
- Sotto 860px il nome va su due righe; il gap tra particelle si riduce da 6 a 5px
- `aria-hidden="true"` sull'HUD; `h1.sr-only` garantisce accessibilità
- I metadati OG derivano tutti da `config.js` via `layout.jsx`

---

## Deploy

1. Push su `main` → Vercel triggera il build automaticamente
2. Vercel esegue `npm run build` (che incrementa `build.json`)
3. Il `build.json` aggiornato da Vercel non viene ricommittato automaticamente: se serve tracciarlo, farlo manualmente dopo il deploy
