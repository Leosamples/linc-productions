"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createMars } from "@/lib/marsStage";
import type { Stop } from "@/components/servicesData";

const TOUR_MS = 7500;
const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function MarsStage({ stops }: { stops: Stop[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const engine = useRef<{ focus: (i: number) => void; destroy: () => void } | null>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ok, setOk] = useState(true);
  const [ready, setReady] = useState(false);
  const count = stops.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const canvas = canvasRef.current;
    const markersEl = markersRef.current;
    if (!canvas || !markersEl) return;
    const e = createMars({
      canvas,
      markersEl,
      stops,
      onSelect: (n: number) => {
        setI(n);
        setPlaying(false);
      },
      onDrift: () => setPlaying(false),
      onReady: () => setReady(true),
    });
    if (!e) {
      setOk(false);
      return;
    }
    engine.current = e;
    return () => {
      e.destroy();
      engine.current = null;
    };
  }, [stops]);

  useEffect(() => {
    engine.current?.focus(i);
  }, [i]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % count), TOUR_MS);
    return () => window.clearInterval(id);
  }, [playing, count]);

  const select = useCallback((n: number) => {
    setI(n);
    setPlaying(false);
    engine.current?.focus(n);
  }, []);

  const s = stops[i];
  const prevIdx = (i - 1 + count) % count;
  const nextIdx = (i + 1) % count;

  return (
    <section
      className={`mars-stage${ready ? " ready" : ""}${ok ? "" : " nogl"}`}
      aria-label="Linc Productions systems"
    >
      <canvas ref={canvasRef} className="mars-canvas" aria-hidden="true" />
      <div ref={markersRef} className="mars-markers" />
      <div className="mars-veil" aria-hidden="true" />

      <div className="mars-top">
        <button type="button" className="mars-nav" onClick={() => select(prevIdx)} aria-label={`Previous system: ${stops[prevIdx].title}`}>
          <span className="mars-dot">{pad(prevIdx)}</span>
          <span className="mars-nav-t">{stops[prevIdx].short}</span>
        </button>
        <Link href="/strategy" className="mars-cta">
          Discuss this project
        </Link>
        <button type="button" className="mars-nav mars-nav-r" onClick={() => select(nextIdx)} aria-label={`Next system: ${stops[nextIdx].title}`}>
          <span className="mars-dot">{pad(nextIdx)}</span>
          <span className="mars-nav-t">{stops[nextIdx].short}</span>
        </button>
      </div>

      <header className="mars-head">
        <p className="mars-kick">
          System {pad(i)} / {String(count).padStart(2, "0")}
        </p>
        <h1 className="mars-h1">Six systems. One studio.</h1>
      </header>

      <aside className="mars-panel" aria-live="polite" key={s.id}>
        <h2>{s.title}</h2>
        <p>{s.desc}</p>
        <ul>
          {s.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <Link href="/strategy" className="mars-link">
          Book a Strategy Session →
        </Link>
      </aside>

      <div className="mars-bar">
        <button
          type="button"
          className="mars-play"
          aria-label={playing ? "Pause tour" : "Play tour"}
          onClick={() => {
            if (!playing) engine.current?.focus(i);
            setPlaying((p) => !p);
          }}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="mars-chapters">
          {stops.map((st, n) => (
            <button
              key={st.id}
              type="button"
              className={`mars-ch${n === i ? " on" : ""}`}
              aria-label={st.title}
              aria-current={n === i}
              onClick={() => select(n)}
            >
              {pad(n)}
              <i className={playing && n === i ? "run" : ""} />
            </button>
          ))}
        </div>
      </div>

      <a href="#all-systems" className="mars-down" aria-label="See all systems">
        ↓
      </a>
    </section>
  );
}
