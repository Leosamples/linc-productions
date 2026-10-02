import Link from "next/link";
import Reveal from "@/components/Reveal";

const PROJECTS = [
  { name: "Brand System Refresh", stage: "In Production" },
  { name: "Website Redesign", stage: "Review" },
  { name: "Q1 Campaign Film", stage: "Discovery" },
];

const FILES = [
  { name: "Brand Guidelines v3.pdf", size: "4.2 MB" },
  { name: "Homepage — Final.fig", size: "18 MB" },
  { name: "Site Map.pdf", size: "220 KB" },
];

const APPROVALS = [
  { name: "Homepage design" },
  { name: "Hero film cut" },
];

const INVOICES = [
  { name: "Phase 1 — Deposit", amount: "$12,500" },
  { name: "Phase 2 — Production", amount: "$18,000" },
];

export default function PortalPage() {
  return (
    <section className="container-edit py-20 md:py-28">
      <Reveal>
        <span className="kicker">Client Portal</span>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl text-paper md:text-5xl">
          Everything about your engagement, in one place.
        </h1>
        <p className="mt-5 max-w-copy text-base leading-relaxed text-muted md:text-lg">
          This is a preview of the Portal experience. Your discovery answers
          from the Strategy Session feed directly in, shaping your North
          Star and setup.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-sm border border-line p-7">
          <h2 className="text-sm text-paper">Projects</h2>
          <ul className="mt-5 space-y-4">
            {PROJECTS.map((p) => (
              <li key={p.name} className="flex items-center justify-between text-sm">
                <span className="text-paper">{p.name}</span>
                <span className="text-xs text-muted">{p.stage}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="rounded-sm border border-line p-7">
          <h2 className="text-sm text-paper">Files</h2>
          <ul className="mt-5 space-y-4">
            {FILES.map((f) => (
              <li key={f.name} className="flex items-center justify-between text-sm">
                <span className="text-paper">{f.name}</span>
                <span className="text-xs text-muted">{f.size}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="rounded-sm border border-line p-7">
          <h2 className="text-sm text-paper">Approvals</h2>
          <ul className="mt-5 space-y-4">
            {APPROVALS.map((a) => (
              <li key={a.name} className="flex items-center justify-between text-sm">
                <span className="text-paper">{a.name}</span>
                <span className="text-xs text-signal">Approve</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="rounded-sm border border-line p-7">
          <h2 className="text-sm text-paper">Invoices</h2>
          <ul className="mt-5 space-y-4">
            {INVOICES.map((i) => (
              <li key={i.name} className="flex items-center justify-between text-sm">
                <span className="text-paper">{i.name}</span>
                <span className="text-xs text-muted">{i.amount}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/strategy"
          className="focus-ring rounded-sm text-sm text-paper transition-colors hover:text-signal"
        >
          Open Strategy Session →
        </Link>
      </div>
    </section>
  );
}
