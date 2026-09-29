"use client";

import { useEffect, useRef } from "react";

// Campo de estrellas muy fino, en grises. Tres capas con paralaje suave al
// desplazarse; se detiene con la pestaña oculta o con "reducir movimiento".
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    type Star = { x: number; y: number; r: number; a: number; z: number; tw: number };
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const n = Math.round((w * h) / 3200);
      stars = Array.from({ length: n }, () => {
        const z = Math.random();
        return { x: Math.random() * w, y: Math.random() * h * 3, r: 0.25 + z * 0.75, a: 0.15 + z * 0.55, z, tw: Math.random() * Math.PI * 2 };
      });
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      for (const s of stars) {
        const y = (((s.y - sy * (0.02 + s.z * 0.08)) % (h * 3)) + h * 3) % (h * 3);
        if (y > h) continue;
        const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 0.0012 + s.tw);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "#dfe3ea";
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || t - last < 50) return;
      last = t;
      draw(t);
    };

    init();
    if (reduced) {
      draw(0);
      const onScroll = () => draw(0);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", init);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", init);
      };
    }
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 size-full" aria-hidden="true" />;
}
