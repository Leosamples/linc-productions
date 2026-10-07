"use client";

import { useEffect, useRef } from "react";

// Fixed earth video that stays behind the whole page while scrolling.
// A dark shade fades in as the visitor scrolls past the hero so the
// content below stays readable while the globe keeps glowing behind it.
export default function HeroBackdrop() {
  const shadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shade = shadeRef.current;
    if (!shade) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.85), 1);
      shade.style.opacity = String(progress);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-earth-poster.jpg"
        className="h-full w-full object-cover brightness-[1.3] contrast-[1.08] saturate-[1.25]"
      >
        <source src="/video/hero-earth.mp4" type="video/mp4" />
      </video>
      {/* Soft blue atmosphere glow around the globe */}
      <div className="absolute inset-0 mix-blend-screen bg-[radial-gradient(ellipse_at_50%_60%,rgba(53,183,255,0.28),transparent_62%)]" />
      {/* Light veil so the hero copy reads without dimming the globe */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/10 to-ink/45" />
      {/* Scroll-driven shade for the sections below the hero */}
      <div ref={shadeRef} className="absolute inset-0 bg-ink/75" style={{ opacity: 0 }} />
    </div>
  );
}
