import Link from "next/link";
import Reveal from "@/components/Reveal";

const DO = [
  "Cinematic photography, film, podcast and commercial production",
  "Brand identity, websites and content systems",
  "Growth infrastructure — funnels, SEO and lifecycle marketing",
  "Linc OS — the client portal and operations layer behind every engagement",
];

export default function AboutPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal>
        <span className="kicker">About</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
          The studio behind the system.
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1fr]">
        <Reveal delay={0.05}>
          <p className="max-w-copy text-base leading-relaxed text-muted md:text-lg">
            Linc Productions builds the creative and operational
            infrastructure behind serious brands — cinematic content, brand
            systems, websites, and the software layer that keeps client
            engagements organized and moving.
          </p>
          <p className="mt-5 max-w-copy text-base leading-relaxed text-muted md:text-lg">
            Rather than delivering one-off assets, we build systems:
            repeatable, connected, and built to compound as a business
            grows.
          </p>
          <Link
            href="/strategy"
            className="mt-8 inline-block focus-ring rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Book a Strategy Session
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-sm border border-line p-8">
            <div className="text-xs text-muted">What we do</div>
            <ul className="mt-5 space-y-4">
              {DO.map((d) => (
                <li key={d} className="flex gap-3 text-sm leading-relaxed text-paper">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
