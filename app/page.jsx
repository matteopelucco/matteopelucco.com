"use client";

import { useEffect, useRef } from "react";
import "./v3.css";


export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sampleText() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // testo su canvas offscreen per campionare i pixel
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d");
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      const twoLines = w < 860;
      const size = twoLines
        ? Math.min(w / 6.2, 110)
        : Math.min(w / 10.5, 150);
      octx.font = `800 ${size}px Archivo, Arial, sans-serif`;

      if (twoLines) {
        octx.fillText("MATTEO", w / 2, h / 2 - size * 0.62);
        octx.fillText("PELUCCO", w / 2, h / 2 + size * 0.62);
      } else {
        octx.fillText("MATTEO PELUCCO", w / 2, h / 2);
      }

      const data = octx.getImageData(0, 0, w, h).data;
      const gap = w < 860 ? 5 : 6;
      particles = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            const t = x / w; // gradiente di colore lungo la x
            particles.push({
              tx: x,
              ty: y,
              x: reduced ? x : Math.random() * w,
              y: reduced ? y : Math.random() * h,
              vx: 0,
              vy: 0,
              hue: 178 + t * 92, // ciano → violetto
            });
          }
        }
      }
    }

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // forza elastica verso la posizione target
        p.vx += (p.tx - p.x) * 0.045;
        p.vy += (p.ty - p.y) * 0.045;

        // repulsione dal puntatore
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 10000) {
          const d = Math.sqrt(d2) || 1;
          const f = (100 - d) / 100;
          p.vx += (dx / d) * f * 5.5;
          p.vy += (dy / d) * f * 5.5;
        }

        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = `hsl(${p.hue} 95% 65%)`;
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }
      raf = requestAnimationFrame(tick);
    }

    function drawStatic() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.fillStyle = `hsl(${p.hue} 95% 65%)`;
        ctx.fillRect(p.tx, p.ty, 1.8, 1.8);
      }
    }

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => {
      sampleText();
      if (reduced) drawStatic();
    };

    // attende il font per campionare le forme corrette
    const start = () => {
      sampleText();
      if (reduced) {
        drawStatic();
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main className="p-stage">
      <canvas ref={canvasRef} className="p-canvas" />
      <h1 className="sr-only">Matteo Pelucco — sito in costruzione</h1>

      <div className="p-hud" aria-hidden="true">
        <span className="p-corner p-tl" />
        <span className="p-corner p-tr" />
        <span className="p-corner p-bl" />
        <span className="p-corner p-br" />

        <div className="p-label p-top-left">
          MP://BUILD <span className="p-dim">v0.1</span>
        </div>
        <div className="p-label p-top-right p-dim">matteopelucco.com</div>
        <div className="p-label p-bottom-left">
          <span className="p-cursor">&gt;</span> sito in costruzione
          <span className="p-blink">_</span>
        </div>
        <div className="p-label p-bottom-right p-dim">&copy; 2026</div>
      </div>

      <div className="p-scan" aria-hidden="true" />
    </main>
  );
}
