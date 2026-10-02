import Link from "next/link";
import Reveal from "@/components/Reveal";

const LOOP = [
  "Discovery",
  "Mirror",
  "North Star",
  "Portal",
  "CRM",
  "Analytics",
  "AI",
  "Memory",
  "Growth",
];

const ORGANIZES = [
  { title: "Command Center", desc: "One view across every active engagement." },
  { title: "Live Workspace", desc: "Projects, files and approvals update as work happens." },
  { title: "Adaptive Systems", desc: "Structure that adjusts to how each engagement actually runs." },
];

export default function LincOsPage() {
  return (
    <>
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">Linc OS</span>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
            Clear. Precise. Automated.
          </h1>
          <p className="mt-5 max-w-copy text-base leading-relaxed text-muted md:text-lg">
            We built the infrastructure layer that brings clarity, precision
            and structure to how every engagement runs. Linc OS is the
            system behind your engagement — not another login to manage.
          </p>
          <Link
            href="/portal"
            className="mt-7 inline-block focus-ring rounded-sm bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Enter the Portal
          </Link>
        </Reveal>
      </section>

      <div className="rule" />

      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">What it organizes</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            The system doesn&rsquo;t just track work — it structures it.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ORGANIZES.map((o) => (
            <div key={o.title} className="rounded-sm border border-line p-7">
              <h3 className="font-serif text-lg text-paper">{o.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">The nine-stage loop</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            From first discovery to compounding growth.
          </h2>
          <p className="mt-5 max-w-copy text-sm leading-relaxed text-muted md:text-base">
            Every engagement runs through the same operating system —
            nothing falls through the cracks.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-3">
          {LOOP.map((step, i) => (
            <li key={step} className="flex items-baseline gap-3 bg-ink p-6">
              <span className="font-serif text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm text-paper">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/portal"
            className="focus-ring rounded-sm text-sm text-paper transition-colors hover:text-signal"
          >
            Enter the Portal →
          </Link>
        </div>
      </section>
    </>
  );
}
