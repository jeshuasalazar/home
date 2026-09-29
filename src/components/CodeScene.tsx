"use client";

import { useEffect, useRef } from "react";

// Escena realista dibujada como código: la imagen se convierte en caracteres
// monoespaciados que se decodifican al entrar en pantalla. Una línea de escaneo
// recorre la escena y deja ver la foto real bajo el código. Mismo estándar
// para todas las escenas; se pausa fuera de pantalla y respeta "reducir movimiento".

const RAMP = " .·:-=+*#%@";
const NOISE = "01<>/\\{}[]#%&*+=-_";

export default function CodeScene({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).getPropertyValue("--font-mono-stack") || "monospace";

    let raf = 0;
    let visible = false;
    let started = 0;
    let cols = 0;
    let rows = 0;
    let lum: Float32Array = new Float32Array(0);
    let delay: Float32Array = new Float32Array(0);
    let w = 0;
    let h = 0;
    let CELL_W = 5;
    let CELL_H = 7;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const img = new Image();
    const ascii = document.createElement("canvas");
    const photo = document.createElement("canvas");
    const band = document.createElement("canvas");

    const charFor = (l: number) => RAMP[Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))];
    const shade = (l: number) => {
      const g = Math.round(55 + l * 200);
      return `rgb(${g},${g},${g + 4})`;
    };

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      if (!w || !h || !img.naturalWidth) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      CELL_W = w < 300 ? 3.5 : w < 420 ? 4 : 5;
      CELL_H = CELL_W * 1.45;
      cols = Math.floor(w / CELL_W);
      rows = Math.floor(h / CELL_H);

      // Luminancia por celda (object-fit: cover)
      const s = document.createElement("canvas");
      s.width = cols;
      s.height = rows;
      const sc = s.getContext("2d", { willReadFrequently: true });
      if (!sc) return;
      const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      sc.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      const data = sc.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      delay = new Float32Array(cols * rows);
      // Niveles automáticos: estira del percentil 4 al 99.5 y aclara medios tonos
      const raw = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) raw[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
      const sorted = Float32Array.from(raw).sort();
      const lo = sorted[Math.floor(sorted.length * 0.04)];
      const hi = Math.max(lo + 0.05, sorted[Math.floor(sorted.length * 0.995)]);
      for (let i = 0; i < cols * rows; i++) {
        lum[i] = Math.min(1, Math.max(0, (raw[i] - lo) / (hi - lo))) ** 0.75;
        const x = i % cols;
        delay[i] = (x / cols) * 900 + Math.random() * 500;
      }

      // Capa final de código, pre-renderizada
      ascii.width = canvas.width;
      ascii.height = canvas.height;
      const a = ascii.getContext("2d");
      if (!a) return;
      a.scale(dpr, dpr);
      a.font = `${CELL_H * 1.05}px ${font}`;
      a.textBaseline = "top";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const l = lum[y * cols + x];
          if (l < 0.06) continue;
          a.fillStyle = shade(l);
          a.fillText(charFor(l), x * CELL_W, y * CELL_H);
        }
      }

      // Foto real en gris para la línea de escaneo
      photo.width = canvas.width;
      photo.height = canvas.height;
      const p = photo.getContext("2d");
      if (!p) return;
      const ps = Math.max(photo.width / img.naturalWidth, photo.height / img.naturalHeight);
      p.filter = "grayscale(1) contrast(1.1) brightness(0.9)";
      p.drawImage(img, (photo.width - img.naturalWidth * ps) / 2, (photo.height - img.naturalHeight * ps) / 2, img.naturalWidth * ps, img.naturalHeight * ps);
    };

    const drawDecode = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CELL_H * 1.05}px ${font}`;
      ctx.textBaseline = "top";
      let done = true;
      for (let i = 0; i < cols * rows; i++) {
        const l = lum[i];
        if (l < 0.06) continue;
        const e = t - delay[i];
        if (e < 0) {
          done = false;
          continue;
        }
        const x = (i % cols) * CELL_W;
        const y = Math.floor(i / cols) * CELL_H;
        if (e < 260) {
          done = false;
          ctx.fillStyle = "rgb(210,212,218)";
          ctx.fillText(NOISE[(Math.random() * NOISE.length) | 0], x, y);
        } else {
          ctx.fillStyle = shade(l);
          ctx.fillText(charFor(l), x, y);
        }
      }
      return done;
    };

    const drawIdle = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(ascii, 0, 0);

      // Línea de escaneo: cada 6 s revela la foto real
      const period = 6000;
      const phase = (t % period) / period;
      const bandH = canvas.height * 0.22;
      const y = phase * (canvas.height + bandH * 2) - bandH;
      const top = Math.max(0, Math.floor(y - bandH));
      const bh = Math.min(canvas.height, Math.ceil(y)) - top;
      if (bh > 0) {
        band.width = canvas.width;
        band.height = bh;
        const b = band.getContext("2d");
        if (b) {
          b.clearRect(0, 0, band.width, bh);
          b.drawImage(photo, 0, top, canvas.width, bh, 0, 0, canvas.width, bh);
          const grad = b.createLinearGradient(0, y - bandH - top, 0, y - top);
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(1, "rgba(0,0,0,0.9)");
          b.globalCompositeOperation = "destination-in";
          b.fillStyle = grad;
          b.fillRect(0, 0, band.width, bh);
          b.globalCompositeOperation = "source-over";
          ctx.drawImage(band, 0, top);
        }
      }
      ctx.fillStyle = "rgba(235,238,245,0.55)";
      ctx.fillRect(0, y, canvas.width, Math.max(1, dpr));

      // Pequeños glitches
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL_H * 1.05}px ${font}`;
      ctx.textBaseline = "top";
      for (let k = 0; k < 6; k++) {
        const i = (Math.random() * cols * rows) | 0;
        if (lum[i] < 0.12) continue;
        const x = (i % cols) * CELL_W;
        const yy = Math.floor(i / cols) * CELL_H;
        ctx.clearRect(x, yy, CELL_W, CELL_H);
        ctx.fillStyle = "rgb(240,242,248)";
        ctx.fillText(NOISE[(Math.random() * NOISE.length) | 0], x, yy);
      }
    };

    let last = 0;
    let decoded = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 40) return;
      last = now;
      if (!started) started = now;
      if (!decoded) decoded = drawDecode(now - started);
      else drawIdle(now - started);
    };

    const start = () => {
      layout();
      if (reduced) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(ascii, 0, 0);
        return;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      if (img.complete) layout();
    });
    ro.observe(canvas);
    img.onload = () => document.fonts.ready.then(start);
    img.src = src;

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [src]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
