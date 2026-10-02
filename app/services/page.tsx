import Link from "next/link";
import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    name: "Brand Presence Systems",
    tagline: "Identity, positioning and the visual language a business runs on.",
  },
  {
    name: "Content Systems",
    tagline: "Photography and film libraries built for reuse across every channel.",
  },
  {
    name: "Funnels & Lead Systems",
    tagline: "Websites and campaigns engineered to convert attention into pipeline.",
  },
  {
    name: "Cinematic Campaigns",
    tagline: "Commercial production with a directorial point of view.",
  },
  {
    name: "AI-Assisted Creative Systems",
    tagline: "Production workflows that move at the speed modern brands need.",
  },
];

export default function ServicesPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal>
        <span className="kicker">System</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
          Five systems. One studio.
        </h1>
        <p className="mt-5 max-w-copy text-base leading-relaxed text-muted md:text-lg">
          Every engagement draws from the same set of systems, scoped to
          what your business actually needs right now.
        </p>
      </Reveal>

      <div className="mt-14 divide-y divide-line border-y border-line">
        {SERVICES.map((s) => (
          <Reveal key={s.name}>
            <div className="flex flex-col gap-2 py-8 md:flex-row md:items-center md:justify-between md:gap-10">
              <div>
                <h2 className="font-serif text-2xl text-paper">{s.name}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                  {s.tagline}
                </p>
              </div>
              <Link
                href="/strategy"
                className="focus-ring shrink-0 rounded-sm text-sm text-muted transition-colors hover:text-signal"
              >
                Discuss this project →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
