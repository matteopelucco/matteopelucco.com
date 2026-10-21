// ── Forme geometriche ────────────────────────────────────────────
// Ogni forma disegna una sagoma piena (bianca) sul canvas offscreen,
// i cui pixel vengono campionati come posizioni target delle particelle.
// Le sagome sono disegnate in un box 100×100 centrato e scalato a schermo.

const poly = (c, pts) => {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
};

const ell = (c, x, y, rx, ry = rx, rot = 0) => {
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  c.fill();
};

const fillPath = (c, d) => c.fill(new Path2D(d));

const strokePath = (c, d, width) => {
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke(new Path2D(d));
};

// Rimuove i pixel disegnati da fn (buchi: occhi, pulsanti, ...)
const cut = (c, fn) => {
  c.save();
  c.globalCompositeOperation = "destination-out";
  fn();
  c.restore();
};

// Disegna fn in un box 100×100 che occupa `fit` del lato corto dello schermo
const inBox = (draw, fit = 0.72) => (c, w, h) => {
  const s = (Math.min(w, h) * fit) / 100;
  c.save();
  c.strokeStyle = c.fillStyle;
  c.translate(w / 2, h / 2);
  c.scale(s, s);
  c.translate(-50, -50);
  draw(c);
  c.restore();
};

// Le chitarre sono disegnate verticali attorno all'origine e poi ruotate
const diagonal = (draw, scale) => (c) => {
  c.translate(50, 50);
  c.rotate(Math.PI / 4);
  c.scale(scale, scale);
  draw(c);
};

const SHAPES = {
  star(c, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const outer = Math.min(w, h) * 0.36;
    const inner = outer * 0.42;
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    c.closePath();
    c.fill();
  },

  yoda: inBox((c) => {
    // orecchie
    fillPath(c, "M38,36 Q20,26 2,22 Q8,34 18,40 Q28,46 38,48 Z");
    fillPath(c, "M62,36 Q80,26 98,22 Q92,34 82,40 Q72,46 62,48 Z");
    // testa
    ell(c, 50, 40, 16, 15);
    // tunica
    fillPath(c, "M40,52 Q50,58 60,52 L66,62 Q74,80 76,98 L24,98 Q26,80 34,62 Z");
    cut(c, () => {
      ell(c, 43, 39, 3.2, 2.6);
      ell(c, 57, 39, 3.2, 2.6);
    });
  }),

  vader: inBox((c) => {
    c.beginPath();
    c.moveTo(20, 42);
    c.bezierCurveTo(20, 10, 80, 10, 80, 42);
    c.lineTo(84, 62);
    c.lineTo(96, 88);
    c.lineTo(72, 82);
    c.lineTo(64, 94);
    c.lineTo(36, 94);
    c.lineTo(28, 82);
    c.lineTo(4, 88);
    c.lineTo(16, 62);
    c.closePath();
    c.fill();
    cut(c, () => {
      // occhi
      poly(c, [[27, 46], [46, 47], [45, 57], [33, 56]]);
      poly(c, [[73, 46], [54, 47], [55, 57], [67, 56]]);
      // griglia bocca
      poly(c, [[50, 60], [38, 86], [62, 86]]);
      // visiera
      c.fillRect(22, 40, 56, 2.5);
    });
    poly(c, [[50, 67], [43, 82], [57, 82]]);
  }),

  falcon: inBox((c) => {
    ell(c, 44, 50, 34);
    // mandibole
    fillPath(c, "M62,30 L98,38 L98,48 L66,48 Z");
    fillPath(c, "M62,70 L98,62 L98,52 L66,52 Z");
    // cabina di pilotaggio laterale
    fillPath(c, "M54,20 L80,10 Q88,8 88,16 Q88,22 80,22 L60,30 Z");
    cut(c, () => {
      c.fillRect(70, 47, 30, 6);
      // anello centrale
      c.beginPath();
      c.arc(44, 50, 11, 0, Math.PI * 2);
      c.arc(44, 50, 7, 0, Math.PI * 2, true);
      c.fill();
      // motori posteriori
      c.fillRect(8, 30, 3, 40);
    });
  }),

  pikachu: inBox((c) => {
    // orecchie
    fillPath(c, "M34,30 Q22,14 12,0 Q30,8 44,24 Z");
    fillPath(c, "M66,30 Q78,14 88,0 Q70,8 56,24 Z");
    ell(c, 50, 38, 21, 17);
    ell(c, 50, 70, 20, 22);
    // piedi
    ell(c, 38, 92, 8, 4);
    ell(c, 62, 92, 8, 4);
    // coda a saetta
    fillPath(c, "M66,78 L80,66 L74,58 L92,40 L100,46 L86,58 L92,64 L70,84 Z");
    cut(c, () => {
      ell(c, 42, 36, 3.5);
      ell(c, 58, 36, 3.5);
      // braccia
      c.fillRect(33, 61, 12, 2.5);
      c.fillRect(55, 61, 12, 2.5);
    });
  }),

  joystick: inBox((c) => {
    // controller NES
    c.beginPath();
    c.roundRect(4, 28, 92, 44, 5);
    c.fill();
    cut(c, () => {
      // croce direzionale
      c.fillRect(13, 46, 22, 8);
      c.fillRect(20, 39, 8, 22);
      // select / start
      c.beginPath();
      c.roundRect(40, 56, 9, 4, 2);
      c.roundRect(52, 56, 9, 4, 2);
      c.fill();
      // B / A
      ell(c, 72, 56, 5.5);
      ell(c, 86, 56, 5.5);
      // separatore centrale
      c.fillRect(40, 38, 21, 2.5);
      c.fillRect(40, 44, 21, 2.5);
    });
  }),

  stratocaster: inBox(
    diagonal((c) => {
      // corpo a doppia spalla mancante, corno superiore più lungo
      fillPath(
        c,
        "M4,16 Q9,8 11,2 Q16,-1 18,8 Q20,18 17,24 Q24,34 22,48 Q18,64 0,64 " +
          "Q-18,64 -22,48 Q-24,34 -18,24 Q-21,16 -19,6 Q-17,-8 -12,-8 " +
          "Q-8,-6 -8,6 Q-7,14 -4,16 Z"
      );
      c.fillRect(-3.5, -60, 7, 76);
      // paletta asimmetrica
      fillPath(c, "M-3,-58 L-5,-66 Q-5,-82 2,-84 Q8,-84 8,-78 Q5,-74 5,-68 L3,-58 Z");
      cut(c, () => {
        // ponte e pickup
        c.fillRect(-7, 48, 14, 2.5);
        c.fillRect(-6, 26, 12, 2);
        c.fillRect(-6, 34, 12, 2);
        c.fillRect(-6, 42, 12, 2);
      });
    }, 0.68)
  ),

  lespaul: inBox(
    diagonal((c) => {
      // corpo a spalla mancante singola
      fillPath(
        c,
        "M3,6 Q6,-2 10,-4 Q14,-4 14,6 Q22,10 22,22 Q22,30 18,34 Q26,42 24,54 " +
          "Q20,66 0,66 Q-20,66 -24,54 Q-26,42 -18,34 Q-22,30 -22,20 " +
          "Q-22,4 -10,2 Q-5,1 -3,6 Z"
      );
      c.fillRect(-3.5, -58, 7, 66);
      // paletta "open book"
      fillPath(c, "M-3,-58 L-7,-62 L-7,-78 Q-3,-76 0,-80 Q3,-76 7,-78 L7,-62 L3,-58 Z");
      cut(c, () => {
        // humbucker e ponte
        c.fillRect(-6, 20, 12, 5);
        c.fillRect(-6, 38, 12, 5);
        c.fillRect(-7, 48, 14, 2);
        // manopole
        ell(c, 13, 50, 2);
        ell(c, 15, 58, 2);
      });
    }, 0.68)
  ),

  charmander: inBox((c) => {
    // coda curva con fiamma
    strokePath(c, "M54,72 Q80,82 80,56", 8);
    fillPath(c, "M80,24 Q96,40 88,50 Q80,58 72,50 Q66,40 80,24 Z");
    // testa e corpo
    ell(c, 40, 24, 17, 15);
    ell(c, 44, 60, 17, 21);
    // braccia
    ell(c, 28, 52, 8, 4, -0.5);
    ell(c, 58, 50, 7, 4, 0.5);
    // gambe
    ell(c, 34, 82, 8, 10);
    ell(c, 54, 82, 8, 10);
    ell(c, 32, 92, 9, 4);
    ell(c, 56, 92, 9, 4);
    cut(c, () => {
      ell(c, 44, 20, 3, 4.5);
      fillPath(c, "M26,30 Q34,34 42,31 L42,33 Q34,37 26,32 Z");
    });
  }),

  trebleClef: inBox((c) => {
    strokePath(
      c,
      "M42,90 C50,96 60,90 56,80 L46,18 C44,6 54,0 58,8 C62,16 54,26 44,32 " +
        "C30,42 24,56 32,66 C40,76 58,74 62,64 C66,52 58,44 50,44 " +
        "C42,44 38,54 44,60",
      6
    );
    ell(c, 40, 88, 6);
  }),
};

export default SHAPES;
