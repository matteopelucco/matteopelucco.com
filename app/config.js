// ── Configurazione sito ──────────────────────────────────────────
// Modifica qui per personalizzare testi, fisica e colori.

const SITE_CONFIG = {
  // ── Metadata ──────────────────────────────────────────────────
  pageTitle:       "matteo pelucco — in costruzione",
  pageDescription: "matteopelucco.com — sito in costruzione, coming soon.",

  // ── Testo principale (composto da particelle) ─────────────────
  name: "MATTEO PELUCCO",

  // ── Etichette HUD ─────────────────────────────────────────────
  hudTopLeft:    "MP://BUILD",
  hudVersion:    "v0.2",
  hudTopRight:   "matteopelucco.com",
  hudBottomLeft: "sito in costruzione",
  hudBottomRight: "© 2026",

  // ── Fisica particelle ─────────────────────────────────────────
  springForce:     0.045,  // attrazione verso la posizione target (0.01–0.1)
  damping:         0.86,   // smorzamento velocità (0–1, più alto = meno frizione)
  repulsionRadius: 100,    // raggio repulsione cursore in px
  repulsionForce:  5.5,    // intensità repulsione cursore
  particleSize:    1.8,    // lato del quadrato-particella in px

  // ── Colori ───────────────────────────────────────────────────
  colorCycleSpeed: 10,     // gradi/secondo — velocità rotazione hue (0 = statico)
  colorHueSpread:  92,     // ampiezza gradiente hue da sinistra a destra (in gradi)
  colorSaturation: 95,     // saturazione HSL in % (fluo: 90–100)
  colorLightness:  65,     // luminosità HSL in % (fluo: 60–70)
};

export default SITE_CONFIG;
