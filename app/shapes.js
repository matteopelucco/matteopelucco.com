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

// Pixel art: riempie le celle i cui caratteri sono in `on`
const pixels = (c, rows, x0, y0, size, on) => {
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (on.includes(ch)) c.fillRect(x0 + x * size, y0 + y * size, size, size);
    });
  });
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
  mario: inBox((c) => {
    // sprite NES (R rosso, B marrone, S pelle): il marrone del viso è un buco
    const sprite = [
      "...RRRRR....",
      "..RRRRRRRRR.",
      "..BBBSSBS...",
      ".BSBSSSBSSS.",
      ".BSBBSSSBSSS",
      ".BBSSSSBBBB.",
      "...SSSSSSS..",
      "..RRBRRR....",
      ".RRRBRRBRRR.",
      "RRRRBBBBRRRR",
      "SSRBSBBSBRSS",
      "SSSBBBBBBSSS",
      "SSBBBBBBBBSS",
      "..BBB..BBB..",
      ".BBB....BBB.",
      "BBBB....BBBB",
    ];
    pixels(c, sprite, 14, 4, 6, "RSB");
    cut(c, () => pixels(c, sprite.slice(0, 6), 14, 4, 6, "B"));
    pixels(c, sprite.slice(0, 2), 14, 4, 6, "R");
  }),

  bubbleDragon: inBox((c) => {
    // creste sulla schiena
    poly(c, [[26, 30], [10, 20], [20, 42]]);
    poly(c, [[20, 44], [2, 44], [18, 58]]);
    poly(c, [[20, 60], [4, 70], [24, 72]]);
    ell(c, 44, 56, 27, 30);
    ell(c, 70, 46, 17, 13);
    // piedi e braccio
    ell(c, 32, 88, 11, 5);
    ell(c, 58, 88, 11, 5);
    ell(c, 66, 66, 7, 4, -0.6);
    // bolla
    c.beginPath();
    c.arc(88, 80, 10, 0, Math.PI * 2);
    c.arc(88, 80, 7, 0, Math.PI * 2, true);
    c.fill();
    cut(c, () => {
      ell(c, 58, 34, 8, 10);
      fillPath(c, "M70,54 Q78,58 86,54 L86,57 Q78,62 70,57 Z");
    });
    ell(c, 61, 36, 4, 5);
  }),

  commodore64: inBox((c) => {
    // logo C= : anello aperto a destra + due bandierine
    c.beginPath();
    c.arc(42, 50, 36, 0, Math.PI * 2);
    c.arc(42, 50, 21, 0, Math.PI * 2, true);
    c.fill("evenodd");
    cut(c, () => c.fillRect(56, 34, 50, 32));
    poly(c, [[60, 35], [94, 35], [82, 48], [60, 48]]);
    poly(c, [[60, 52], [82, 52], [94, 65], [60, 65]]);
  }),

  mauiHook: inBox((c) => {
    strokePath(c, "M62,10 L62,60 C62,94 22,96 20,66 L20,44", 11);
    // punta e pomello
    poly(c, [[20, 26], [10, 48], [30, 48]]);
    ell(c, 62, 8, 9, 7);
    cut(c, () => {
      // incisioni
      for (let y = 22; y <= 54; y += 8) c.fillRect(57, y, 10, 2.2);
      ell(c, 62, 8, 3.5, 2.5);
    });
  }),

  mickey: inBox((c) => {
    ell(c, 50, 60, 27);
    ell(c, 22, 26, 17);
    ell(c, 78, 26, 17);
  }),

  donald: inBox((c) => {
    // cappello da marinaio con nastro
    fillPath(c, "M26,34 Q28,10 52,8 Q68,8 70,26 Z");
    fillPath(c, "M22,36 Q46,24 74,28 L74,32 Q46,30 22,40 Z");
    poly(c, [[28, 32], [8, 38], [14, 46], [30, 38]]);
    ell(c, 46, 52, 22, 21);
    // becco
    fillPath(c, "M58,52 Q84,44 98,54 Q88,68 60,68 Z");
    // ciuffo
    poly(c, [[26, 60], [16, 70], [30, 68]]);
    cut(c, () => {
      ell(c, 56, 44, 3, 5);
      fillPath(c, "M62,60 Q80,58 94,56 L94,58 Q80,62 62,63 Z");
      c.fillRect(24, 34, 48, 2.2);
    });
  }),

  goofy: inBox((c) => {
    // cappello alto
    poly(c, [[34, 4], [58, 2], [64, 28], [28, 28]]);
    ell(c, 46, 28, 24, 4);
    ell(c, 44, 46, 18, 17);
    // muso e naso
    fillPath(c, "M54,38 Q84,34 90,44 Q92,58 76,60 L56,60 Z");
    ell(c, 90, 42, 7, 6);
    // orecchio cadente
    fillPath(c, "M30,40 Q14,52 16,80 Q22,86 28,78 Q30,58 38,48 Z");
    // dentoni
    c.fillRect(64, 60, 5, 7);
    c.fillRect(70, 60, 5, 7);
    cut(c, () => {
      ell(c, 52, 40, 3, 5);
      c.fillRect(30, 26, 32, 2);
      c.fillRect(56, 57, 26, 2);
    });
  }),

  tinkerBell: inBox((c) => {
    // ali
    ell(c, 30, 30, 18, 8, -0.5);
    ell(c, 70, 30, 18, 8, 0.5);
    ell(c, 34, 46, 12, 5, 0.4);
    ell(c, 66, 46, 12, 5, -0.4);
    // testa con chignon
    ell(c, 50, 20, 7);
    ell(c, 55, 11, 4);
    // corpo e gonna a punte
    poly(c, [[46, 27], [54, 27], [56, 44], [44, 44]]);
    poly(c, [[43, 42], [57, 42], [68, 58], [60, 55], [56, 61], [50, 56], [44, 61], [40, 55], [32, 58]]);
    // braccia e gambe
    strokePath(c, "M46,32 L36,40 M54,32 L64,22", 4);
    strokePath(c, "M47,58 L42,86 L38,90 M53,58 L58,84 L62,88", 5);
    // scia di polvere magica
    [[72, 70, 3], [80, 78, 2.6], [86, 88, 2.2], [76, 88, 2], [92, 76, 2]].forEach(([x, y, r]) =>
      ell(c, x, y, r)
    );
  }),

  goonies: inBox((c) => {
    // doblone dai bordi irregolari con i tre buchi
    const pts = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 42 + Math.sin(i * 2.7) * 1.8 + Math.cos(i * 1.3) * 1.2;
      pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
    }
    poly(c, pts);
    cut(c, () => {
      c.beginPath();
      c.arc(50, 50, 36, 0, Math.PI * 2);
      c.arc(50, 50, 34, 0, Math.PI * 2, true);
      c.fill("evenodd");
      ell(c, 38, 40, 6);
      ell(c, 62, 40, 6);
      ell(c, 50, 64, 6);
    });
  }),

  backToTheFuture: inBox((c) => {
    c.textAlign = "center";
    c.textBaseline = "alphabetic";
    c.save();
    c.transform(1, 0, -0.18, 1, 9, 0);
    c.font = "800 18px Archivo, Arial, sans-serif";
    c.fillText("BACK TO THE", 50, 44, 78);
    c.font = "800 30px Archivo, Arial, sans-serif";
    c.fillText("FUTURE", 50, 72, 88);
    c.restore();
    // frecce sopra e sotto
    c.fillRect(8, 24, 80, 3);
    poly(c, [[86, 19], [98, 25.5], [86, 32]]);
    c.fillRect(2, 77, 86, 3);
    poly(c, [[86, 72], [98, 78.5], [86, 85]]);
  }),

  indyHat: inBox((c) => {
    // fedora: tesa larga e corona con la piega centrale
    fillPath(c, "M26,64 Q22,30 36,26 Q44,24 50,32 Q56,24 64,26 Q78,30 74,64 Z");
    fillPath(c, "M2,66 Q50,52 98,66 Q92,78 50,76 Q8,78 2,66 Z");
    cut(c, () => {
      fillPath(c, "M25,54 Q50,50 75,54 L75,57 Q50,53 25,57 Z");
      fillPath(c, "M49,33 Q50,44 49,52 L51,52 Q50,44 51,33 Z");
    });
  }),
};

export default SHAPES;
