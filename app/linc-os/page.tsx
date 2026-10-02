import Link from "next/link";
import Reveal from "@/components/Reveal";

const LOOP = [
  { name: "Discovery", desc: "Where we meet your business." },
  { name: "Mirror", desc: "Reflecting your brand back with clarity." },
  { name: "North Star", desc: "Defining the one metric that matters." },
  { name: "Portal", desc: "Your command center for the engagement." },
  { name: "CRM", desc: "Every lead and client, in one system." },
  { name: "Analytics", desc: "Signal, not vanity metrics." },
  { name: "AI", desc: "Embedded intelligence across the system." },
  { name: "Memory", desc: "Institutional knowledge that compounds." },
  { name: "Growth", desc: "The output of a system working." },
];

const ORGANIZES = [
  { title: "Command Center", desc: "Every project, file and approval in one calm workspace — no more scattered threads." },
  { title: "Live Workspace", desc: "Status, timelines and next steps update in real time as the work moves forward." },
  { title: "Adaptive Systems", desc: "The infrastructure learns your engagement and tightens with every cycle." },
];

export default function LincOsPage() {
  return (
    <>
      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
            <span>/ Client Portal</span>
            <span>/ Project Tracking</span>
            <span className="border-l border-signal pl-3 text-signal">/ Asset Vault</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold uppercase leading-[1.05] tracking-tight text-paper md:text-6xl">
            See Your Business.
            <br />
            Clearly.
          </h1>
          <p className="mt-6 max-w-copy text-base leading-relaxed text-muted md:text-lg">
            Linc OS is the system running underneath every engagement — projects, files,
            approvals, invoices and strategy, organized into one calm workspace instead of a
            scattered inbox.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/portal"
              className="focus-ring rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Enter the Portal
            </Link>
            <Link
              href="/strategy"
              className="focus-ring rounded-full border border-white/15 px-6 py-3 text-sm text-paper transition-colors hover:border-signal hover:text-signal"
            >
              Free Consultation
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="rule" />

      <section className="container-edit py-20 md:py-28">
        <Reveal>
          <span className="kicker">What It Organizes</span>
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
          <span className="kicker">The Nine-Stage Loop</span>
          <h2 className="mt-4 max-w-xl font-serif text-3xl text-paper md:text-4xl">
            From first discovery to compounding growth.
          </h2>
          <p className="mt-5 max-w-copy text-sm leading-relaxed text-muted md:text-base">
            Every engagement runs on the same operating system — one continuous loop from
            discovery to compounding growth.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-3">
          {LOOP.map((step, i) => (
            <li key={step.name} className="bg-ink p-6">
              <span className="font-serif text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
              <div className="mt-1 text-sm text-paper">{step.name}</div>
              <div className="mt-1 text-xs text-muted">{step.desc}</div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link
            href="/strategy"
            className="focus-ring rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Book Strategy Session
          </Link>
        </div>
      </section>
    </>
  );
}
