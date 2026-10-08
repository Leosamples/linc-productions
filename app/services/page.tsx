import type { Metadata } from "next";
import Link from "next/link";
import MarsStage from "@/components/MarsStage";
import { STOPS } from "@/components/servicesData";

export const metadata: Metadata = {
  title: "Services | Linc Productions",
  description:
    "Six systems for serious brands: brand presence, content, funnels and lead systems, cinematic campaigns, AI-assisted creative and executive systems.",
};

export default function ServicesPage() {
  return (
    <>
      <MarsStage stops={STOPS} />
      <section id="all-systems" className="container-edit py-20 md:py-28">
        <span className="kicker">All systems</span>
        <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
          Everything we build, in one place.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STOPS.map((s, n) => (
            <article key={s.id} className="rounded-sm border border-line p-7">
              <div className="text-xs text-muted">{String(n + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-serif text-lg text-paper">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-paper/80">
                {s.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/strategy"
            className="focus-ring inline-block rounded-full bg-paper px-7 py-3 text-sm font-semibold text-ink"
          >
            Book a Strategy Session
          </Link>
        </div>
      </section>
    </>
  );
}
