import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const SYSTEMS = [
  {
    title: "Brand Presence Systems",
    desc: "Identity, positioning and the visual language a business runs on.",
  },
  {
    title: "Content Systems",
    desc: "Photography, film and editorial content built to be reused, not one-off.",
  },
  {
    title: "Funnels & Lead Systems",
    desc: "Websites and campaigns engineered to turn attention into pipeline.",
  },
  {
    title: "Cinematic Campaigns",
    desc: "Brand film and commercial production with a directorial point of view.",
  },
  {
    title: "AI-Assisted Creative Systems",
    desc: "Production workflows that move at the speed modern brands need.",
  },
  {
    title: "Linc OS",
    desc: "The operations layer that keeps every engagement visible and on track.",
  },
];

const WORK = [
  { title: "Meridian Capital", tag: "Website System" },
  { title: "Halcyon Group", tag: "Brand Film" },
  { title: "Solstice Aesthetics", tag: "Campaign" },
  { title: "Ionic Ventures", tag: "AI Copilot" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container-edit pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="kicker">Linc Productions</span>
            <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-paper sm:text-6xl md:text-[4rem]">
              We build creative
              <br />
              operating systems.
            </h1>
            <p className="mt-6 max-w-copy text-base leading-relaxed text-muted md:text-lg">
              Brand systems, cinematic content, digital platforms and the
              operating infrastructure behind businesses that are ready to
              move with clarity.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/strategy"
                className="focus-ring rounded-sm bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              >
                Book Strategy Session
              </Link>
              <Link
                href="/portfolio"
                className="focus-ring rounded-sm px-6 py-3 text-sm text-paper transition-colors hover:text-signal"
              >
                View our work
              </Link>
            </div>
          </div>

          <div className="hero-mark-wrap flex justify-center md:justify-end">
            <Image
              src="/images/logo.png"
              alt="Linc Productions mark"
              width={220}
              height={220}
              priority
              className="hero-mark h-44 w-44 object-contain md:h-56 md:w-56"
            />
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* Philosophy */}
      <section className="container-edit py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="kicker">Philosophy</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-serif text-2xl leading-snug text-paper italic md:text-3xl">
              Most agencies deliver assets. We build the system that keeps
              producing results after the project ends — brand, content and
              the operational infrastructure, working as one.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* What we build */}
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">What we build</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            Systems. Story. Culture. Growth.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEMS.map((s) => (
            <div key={s.title} className="bg-ink p-7 md:p-8">
              <h3 className="font-serif text-lg text-paper">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Featured work */}
      <section className="container-edit py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="kicker">Featured work</span>
            <h2 className="mt-4 font-serif text-3xl text-paper md:text-4xl">
              Every frame is considered.
            </h2>
          </Reveal>
          <Link
            href="/portfolio"
            className="focus-ring rounded-sm text-sm text-muted transition-colors hover:text-signal"
          >
            View full portfolio
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {WORK.map((w) => (
            <div
              key={w.title}
              className="group rounded-sm border border-line p-7 transition-colors hover:border-signal/40"
            >
              <div className="text-xs text-muted">{w.tag}</div>
              <div className="mt-2 font-serif text-xl text-paper">{w.title}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Linc OS teaser */}
      <section className="container-edit py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <span className="kicker">Linc OS</span>
            <h2 className="mt-4 font-serif text-3xl text-paper md:text-4xl">
              Clear. Precise. Automated.
            </h2>
            <p className="mt-5 max-w-copy text-sm leading-relaxed text-muted md:text-base">
              Every project, file, approval and invoice lives in one place —
              tracked automatically as work moves, so you get visibility
              without having to ask for it.
            </p>
            <Link
              href="/linc-os"
              className="mt-7 inline-block focus-ring rounded-sm text-sm text-paper transition-colors hover:text-signal"
            >
              Enter Linc OS →
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-sm border border-line bg-panel p-8">
              <div className="text-xs text-muted">Command Center</div>
              <div className="mt-6 space-y-3">
                {["Discovery", "North Star", "Portal", "CRM", "Growth"].map((step, i) => (
                  <div key={step} className="flex items-center gap-4 text-sm text-paper">
                    <span className="w-5 text-muted">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* CTA */}
      <section className="container-edit py-24 text-center md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl text-paper md:text-5xl">
            Let&rsquo;s build your system.
          </h2>
          <Link
            href="/strategy"
            className="mt-8 inline-block focus-ring rounded-sm bg-paper px-7 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Book a Strategy Session
          </Link>
        </Reveal>
      </section>
    </>
  );
}
