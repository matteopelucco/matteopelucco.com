# matteopelucco.com

Placeholder single-page "sito in costruzione".

Il nome è composto da migliaia di particelle (campionate dai pixel del testo
renderizzato su canvas offscreen) che si disperdono al passaggio del puntatore
e si ricompongono elasticamente. Estetica HUD, palette ciano → violetto.

## Stack

- Next.js 14 (App Router), zero dipendenze extra
- Animazioni: canvas vanilla + CSS puro
- Accessibilità: `prefers-reduced-motion` rispettato (render statico), nome in `sr-only`
- Responsive: sotto gli 860px il nome va su due righe

## Sviluppo

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy (GitHub → Vercel → Cloudflare)

1. Push del repo su GitHub
2. Vercel → Add New Project → importa il repo (framework: Next.js, zero config)
3. Vercel → Settings → Domains → aggiungi `matteopelucco.com` (e `www` se vuoi)
4. Cloudflare DNS:
   - `CNAME` apex (o `www`) → `cname.vercel-dns.com`
   - Proxy status: **DNS only** (nuvola grigia), per lasciare l'SSL a Vercel
     ed evitare il doppio layer di proxy/redirect

## Struttura

```
app/
  layout.jsx    # metadata, OG, font (Archivo 800 + JetBrains Mono)
  globals.css   # reset
  page.jsx      # homepage — particle field (client component)
  v3.css        # stile HUD/scanline
```
