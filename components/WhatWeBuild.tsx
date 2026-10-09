"use client";

import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

// "What We Build" on the home page: a mission-control style panel of five
// systems plus a featured Linc OS cell, floating over the space backdrop.

export type BuildItem = { title: string; desc: string };

const C = "currentColor";
const BLUE = "#35B7FF";
const iconProps = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke: C, strokeWidth: 1.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

// Custom line icons; the element with className "wwb-accent" is the blue accent that glows on hover.
const ICONS: Record<string, ReactNode> = {
  "Brand Presence Systems": (
    <svg {...iconProps}>
      <circle cx="14" cy="14" r="11" />
      <circle cx="14" cy="14" r="6.5" />
      <path d="M14 1.5v5M14 21.5v5M1.5 14h5M21.5 14h5" />
      <circle className="wwb-accent" cx="14" cy="14" r="2" fill={BLUE} stroke="none" />
    </svg>
  ),
  "Content Systems": (
    <svg {...iconProps}>
      <rect x="8.5" y="3.5" width="16" height="11.5" rx=".5" />
      <path d="M5.5 7.5v10.5a.5.5 0 0 0 .5.5h15" opacity=".55" />
      <rect x="3.5" y="10.5" width="16" height="12" rx=".5" />
      <path className="wwb-accent" d="M10 13.6v6l5-3z" stroke={BLUE} />
    </svg>
  ),
  "Funnels & Lead Systems": (
    <svg {...iconProps}>
      <path d="M3.5 4.5h21l-8 9v6.5l-5 2.5v-9z" />
      <path d="M7 8h14" opacity=".55" />
      <circle className="wwb-accent" cx="14" cy="25" r="1.9" fill={BLUE} stroke="none" />
    </svg>
  ),
  "Cinematic Campaigns": (
    <svg {...iconProps}>
      <circle cx="14" cy="14" r="11" />
      <path d="M14 3l4.2 7.3M24.5 10.5l-8.4 0M21.3 21.6l-4.2-7.3M14 25l-4.2-7.3M3.5 17.5h8.4M6.7 6.4l4.2 7.3" />
      <path className="wwb-accent" d="M14 10.6l2.9 1.7v3.4L14 17.4l-2.9-1.7v-3.4z" stroke={BLUE} />
    </svg>
  ),
  "AI-Assisted Creative Systems": (
    <svg {...iconProps}>
      <path d="M6 20.5l6-5M12 15.5l8.5 3.5M12 15.5l-1.5-8M20.5 19l1-9" opacity=".7" />
      <circle cx="6" cy="20.5" r="2" />
      <circle cx="12" cy="15.5" r="2" />
      <circle cx="10.5" cy="7.5" r="2" />
      <circle cx="20.5" cy="19" r="2" />
      <path className="wwb-accent" d="M21.5 2.5v6M18.5 5.5h6M19.6 3.6l3.8 3.8M23.4 3.6l-3.8 3.8" stroke={BLUE} strokeWidth="1" />
    </svg>
  ),
};

const TAGS: Record<string, string[]> = {
  "Brand Presence Systems": ["Identity", "Voice", "Positioning"],
  "Content Systems": ["Web", "Film", "Campaigns"],
  "Funnels & Lead Systems": ["SEO", "Paid", "Lifecycle"],
  "Cinematic Campaigns": ["Concept", "Script", "Grade"],
  "AI-Assisted Creative Systems": ["Copilots", "Automation", "Memory"],
};

// Cursor-follow spotlight: position the glow via CSS variables.
function track(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function WhatWeBuild({ items }: { items: BuildItem[] }) {
  return (
    // reducedMotion="user": Framer drops the transforms for reduced-motion visitors
    // (same markup on server and client, so no hydration mismatch).
    <MotionConfig reducedMotion="user">
    <section className="container-edit py-24">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="kicker">What We Build</span>
        <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
          Systems. Story. Culture. Growth.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted md:text-base">
          Five connected systems. One studio running them.
        </p>
        <div className="wwb-rule mt-8" aria-hidden="true" />
      </motion.header>

      <motion.div
        className="mt-12 grid border border-line sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {items.map((s, n) => (
          <motion.div key={s.title} variants={item} className="flex">
            <article className="wwb-card group" onMouseMove={track}>
              <span className="wwb-spot" aria-hidden="true" />
              <span className="wwb-topline" aria-hidden="true" />
              <span className="wwb-index" aria-hidden="true">
                {String(n + 1).padStart(2, "0")}
              </span>

              <div className="wwb-icon">{ICONS[s.title]}</div>
              <h3 className="mt-6 font-serif text-[28px] leading-[1.1] text-paper md:text-[30px]">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{s.desc}</p>

              <div className="mt-auto flex flex-col gap-5 pt-8">
                <ul className="flex flex-wrap gap-2">
                  {(TAGS[s.title] || []).map((tag) => (
                    <li key={tag} className="wwb-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
                <Link href="/services" className="wwb-link focus-ring self-end">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </motion.div>
        ))}

        {/* Featured sixth cell: fills the last slot so every row is complete */}
        <motion.div variants={item} className="flex">
          <article className="wwb-card wwb-featured group" onMouseMove={track}>
            <span className="wwb-spot" aria-hidden="true" />
            <span className="wwb-topline" aria-hidden="true" />
            <svg className="wwb-orbit" viewBox="0 0 200 200" aria-hidden="true">
              <ellipse cx="100" cy="100" rx="92" ry="38" />
              <ellipse cx="100" cy="100" rx="70" ry="70" strokeDasharray="2 6" />
              <circle cx="192" cy="100" r="3" fill={BLUE} stroke="none" />
            </svg>
            <span className="wwb-live">
              <i aria-hidden="true" />
              Live
            </span>

            <div className="relative">
              <h3 className="mt-14 font-serif text-[28px] leading-[1.1] text-paper md:text-[30px]">Linc OS</h3>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/80">
                The operating system behind every engagement.
              </p>
            </div>
            <div className="relative mt-auto flex justify-end pt-8">
              <Link href="/linc-os" className="wwb-link focus-ring">
                Explore Linc OS <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </motion.div>
      </motion.div>
    </section>
    </MotionConfig>
  );
}
