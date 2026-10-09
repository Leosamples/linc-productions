import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SunScrollBackdrop from "@/components/SunScrollBackdrop";
import ShootingStars from "@/components/ShootingStars";
import StarField from "@/components/StarField";
import WhatWeBuild from "@/components/WhatWeBuild";

const WHAT_WE_BUILD = [
  { title: "Brand Presence Systems", desc: "Brand strategy, identity systems and voice — built to make executive businesses instantly recognizable and instantly trusted." },
  { title: "Content Systems", desc: "Websites, content and campaigns engineered as one connected system — not one-off deliverables." },
  { title: "Funnels & Lead Systems", desc: "Growth systems that turn traffic into pipeline — SEO, paid, funnels and lifecycle built to compound." },
  { title: "Cinematic Campaigns", desc: "Brand films, documentary features and commercial spots — from concept and script to color grade, built to hold attention and close deals." },
  { title: "AI-Assisted Creative Systems", desc: "Custom AI systems — copilots, automation and memory layers — embedded into how your business actually runs." },
];

const SIX_SYSTEMS = [
  { name: "Creative Systems", tagline: "The operating system for your creative output." },
  { name: "Brand Systems", tagline: "Identity built to hold authority." },
  { name: "Growth Systems", tagline: "Demand, engineered." },
  { name: "AI Systems", tagline: "Intelligence, built into the business." },
  { name: "Production Systems", tagline: "Execution, without the chaos." },
  { name: "Linc OS", tagline: "The system underneath every engagement." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <SunScrollBackdrop />
      <StarField />
      <ShootingStars fullscreen />
      <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden">
        <div className="container-edit relative py-24 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
          <Reveal>
            <div className="hero-mark-wrap mb-10 flex justify-center">
              <Image
                src="/images/logo-full.png"
                alt="Linc Productions"
                width={714}
                height={562}
                priority
                className="hero-mark h-auto w-56 md:w-96"
              />
            </div>
          </Reveal>

          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs text-paper/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Creative Operating Infrastructure
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mx-auto mt-8 max-w-4xl text-[2.5rem] font-bold leading-[1.05] text-paper sm:text-6xl md:text-7xl">
              Systems for{" "}
              <span className="font-serif font-normal italic text-paper/80">serious brands</span>
              <br />
              built to move fast.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              We combine cinematic storytelling, branding, content systems, and modern
              infrastructure to help businesses grow with clarity and authority.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/strategy"
                className="focus-ring rounded-full bg-paper px-7 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Book Strategy Session
              </Link>
              <Link
                href="/portfolio"
                className="focus-ring rounded-full border border-white/15 px-7 py-3 text-sm text-paper transition-colors hover:border-signal hover:text-signal"
              >
                View Our Work
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      <div className="rule" />

      {/* What we build */}
      <WhatWeBuild items={WHAT_WE_BUILD} />

      <div className="rule" />

      {/* Studio — six systems */}
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">The Studio</span>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl text-paper md:text-4xl">
            A creative intelligence agency built for the modern era.
          </h2>
          <p className="mt-5 max-w-copy text-sm leading-relaxed text-muted md:text-base">
            We use modern creative systems and AI-assisted workflows to help brands move
            faster without sacrificing originality, quality, or emotional impact.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SIX_SYSTEMS.map((w) => (
            <div key={w.name} className="rounded-sm border border-line bg-black/30 p-7 backdrop-blur-sm">
              <h3 className="font-serif text-lg text-paper">{w.name}</h3>
              <p className="mt-2 text-sm text-muted">{w.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Client experience */}
      <section className="container-edit py-20 md:py-28">
        <div>
          <Reveal>
            <span className="kicker">Your Client Experience</span>
            <h2 className="mt-4 font-serif text-3xl text-paper md:text-4xl">
              One portal. Every engagement.
            </h2>
            <p className="mt-5 max-w-copy text-sm leading-relaxed text-muted md:text-base">
              Projects, files, messages, approvals and invoices — every engagement lives
              inside one client portal, not a scattered inbox.
            </p>
            <Link
              href="/portal"
              className="mt-7 inline-block focus-ring rounded-full border border-white/15 px-6 py-3 text-sm text-paper transition-colors hover:border-signal hover:text-signal"
            >
              Enter Client Portal
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* Closing CTA */}
      <section className="container-edit py-24 text-center md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl text-paper md:text-5xl">
            Ready to build your creative operating system?
          </h2>
          <Link
            href="/strategy"
            className="mt-8 inline-block focus-ring rounded-full bg-paper px-7 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Book a Strategy Call
          </Link>
        </Reveal>
      </section>
    </>
  );
}
