import Link from "next/link";
import Reveal from "@/components/Reveal";

const WHAT_WE_BUILD = [
  { title: "Brand Presence Systems", desc: "Brand strategy, identity systems and voice — built to make executive businesses instantly recognizable and instantly trusted." },
  { title: "Content Systems", desc: "Websites, content and campaigns engineered as one connected system — not one-off deliverables." },
  { title: "Funnels & Lead Systems", desc: "Growth systems that turn traffic into pipeline — SEO, paid, funnels and lifecycle built to compound." },
  { title: "Cinematic Campaigns", desc: "Brand films, documentary features and commercial spots — from concept and script to color grade, built to hold attention and close deals." },
  { title: "AI-Assisted Creative Systems", desc: "Custom AI systems — copilots, automation and memory layers — embedded into how your business actually runs." },
];

const CASE_STUDIES = [
  { before: "Outdated Website", after: "Premium Redesign", result: "Modern architecture, credible first impression." },
  { before: "Weak Branding", after: "Elevated Identity", result: "A visual system built for authority." },
  { before: "Low Engagement", after: "Organized Content System", result: "A content engine that compounds." },
  { before: "No Funnel", after: "Lead Generation Infrastructure", result: "A pipeline that runs on its own." },
];

const FEATURED_WORK = [
  { category: "Websites", title: "Meridian Capital" },
  { category: "Brand Film", title: "Halcyon Group" },
  { category: "Photography", title: "Solstice Aesthetics" },
  { category: "AI Systems", title: "Ionic Ventures" },
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
      <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-earth-poster.jpg"
            className="h-full w-full object-cover opacity-80"
          >
            <source src="/video/hero-earth.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
        </div>

        <div className="container-edit py-24 text-center">
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

          <Reveal delay={0.2}>
            <div className="mx-auto mt-16 flex max-w-xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted">
              <span><span className="font-display text-paper">250+</span> Projects Delivered</span>
              <span><span className="font-display text-paper">100+</span> Brands Served</span>
              <span><span className="font-display text-paper">95%</span> Client Retention</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* What we build */}
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">What We Build</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            Systems. Story. Culture. Growth.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2 lg:grid-cols-3">
          {WHAT_WE_BUILD.map((s) => (
            <div key={s.title} className="group bg-ink p-7 transition-colors hover:bg-panel md:p-8">
              <h3 className="font-serif text-lg text-paper">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Case studies */}
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">Case Studies</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            Real Transformation. Real Impact.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CASE_STUDIES.map((c) => (
            <div key={c.after} className="rounded-sm border border-line p-7">
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full border border-line px-3 py-1 text-muted">Before</span>
                <span className="text-muted">{c.before}</span>
              </div>
              <div className="my-3 h-px w-full bg-line" />
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-signal/15 px-3 py-1 text-signal">After</span>
                <span className="text-paper">{c.after}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{c.result}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Featured work */}
      <section className="container-edit py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="kicker">Featured Work</span>
          </Reveal>
          <Link
            href="/portfolio"
            className="focus-ring rounded-sm text-sm text-muted transition-colors hover:text-signal"
          >
            View full portfolio →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURED_WORK.map((w) => (
            <div
              key={w.title}
              className="group rounded-sm border border-line p-7 transition-colors hover:border-signal/40"
            >
              <div className="text-xs text-muted">{w.category}</div>
              <div className="mt-2 font-serif text-xl text-paper">{w.title}</div>
            </div>
          ))}
        </div>
      </section>

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
            <div key={w.name} className="rounded-sm border border-line p-7">
              <h3 className="font-serif text-lg text-paper">{w.name}</h3>
              <p className="mt-2 text-sm text-muted">{w.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Client experience */}
      <section className="container-edit py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
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
          <Reveal delay={0.08}>
            <blockquote className="rounded-sm border border-line bg-panel p-8">
              <p className="font-serif text-xl italic leading-snug text-paper">
                &ldquo;Linc Productions doesn&rsquo;t deliver assets. They deliver a system
                that keeps compounding.&rdquo;
              </p>
              <footer className="mt-5 text-xs uppercase tracking-wider text-muted">
                Managing Partner, Growth-Stage Firm
              </footer>
            </blockquote>
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
