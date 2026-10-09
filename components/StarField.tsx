"use client";

import { useEffect, useRef } from "react";

// Fixed, full-viewport starfield for the home page. Sits above the Earth/Sun
// backdrop with mix-blend-mode: screen (so stars show over both) and below
// the page content. Twinkles on per-star phases and drifts slowly with scroll
// (far stars ~0.02x, near stars ~0.08x). Reduced motion: one static frame.

type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; k: number; c: string };

const TINTS = ["255,255,255", "205,222,255", "255,232,205"];

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, stars: Star[] = [], raf = 0, last = 0;

    const seed = () => {
      const n = W < 760 ? 110 : 220;
      stars = Array.from({ length: n }, () => {
        const depth = Math.random(); // 0 = far, 1 = near
        const tint = Math.random();
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          r: (0.4 + depth * 1.2) / 2, // 0.4–1.6px across
          a: 0.35 + Math.random() * 0.55,
          tw: 0.5 + Math.random() * 1.6,
          ph: Math.random() * Math.PI * 2,
          k: 0.02 + depth * 0.06, // parallax: far 0.02x, near 0.08x
          c: tint < 0.8 ? TINTS[0] : tint < 0.9 ? TINTS[1] : TINTS[2],
        };
      });
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (now: number) => {
      const t = now / 1000;
      const sy = reduce ? 0 : window.scrollY;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * s.tw + s.ph);
        const y = (((s.y - sy * s.k) % H) + H) % H;
        ctx.fillStyle = `rgba(${s.c},${(s.a * tw).toFixed(3)})`;
        if (s.r < 0.45) ctx.fillRect(s.x - s.r, y - s.r, s.r * 2, s.r * 2);
        else {
          ctx.beginPath();
          ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 15) return; // cap at ~60fps on high-refresh screens (15ms leaves room for 60Hz jitter)
      last = now;
      draw(now);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) draw(performance.now());
      else if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => { size(); start(); }, 120);
    };

    size();
    start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1, mixBlendMode: "screen" }}
    />
  );
}
