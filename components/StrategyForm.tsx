"use client";

import { useState } from "react";

const REVENUE_OPTIONS = ["Pre-revenue", "$0–500K", "$500K–2M", "$2M–10M", "$10M+"];
const TEAM_OPTIONS = ["Solo", "2–10", "11–50", "50+"];

type FormData = {
  goals: string;
  challenges: string;
  revenue: string;
  teamSize: string;
};

const STEPS = ["Goals", "Challenges", "Revenue", "Team Size", "Review"] as const;

export default function StrategyForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [data, setData] = useState<FormData>({
    goals: "",
    challenges: "",
    revenue: "",
    teamSize: "",
  });

  const update = (patch: Partial<FormData>) => setData((d) => ({ ...d, ...patch }));

  const canAdvance = () => {
    if (step === 0) return data.goals.trim().length > 0;
    if (step === 1) return data.challenges.trim().length > 0;
    if (step === 2) return data.revenue !== "";
    if (step === 3) return data.teamSize !== "";
    return true;
  };

  const submit = () => {
    // NOTE: wire this up to your Linc OS lead-intake API / Gmail notification
    // before launch. This currently just simulates a created lead.
    const id = `LP-${Math.floor(1000 + Math.random() * 9000)}`;
    setLeadId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-line p-8 text-center md:p-12">
        <span className="kicker mx-auto justify-center">Lead created</span>
        <h2 className="mt-4 font-serif text-3xl text-paper">You&rsquo;re in the system.</h2>
        <p className="mt-4 text-sm text-muted">
          Lead <span className="text-paper">{leadId}</span> has been created
          inside Linc OS. A strategist will reach out within one business
          day.
        </p>
        <a
          href="/"
          className="mt-8 inline-block focus-ring rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line p-6 md:p-10">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
        {STEPS.map((s, i) => (
          <span key={s} className={i === step ? "text-paper" : ""}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="mt-8 min-h-[220px]">
        {step === 0 && (
          <Field label="What are your business goals for the next 12 months?">
            <textarea
              value={data.goals}
              onChange={(e) => update({ goals: e.target.value })}
              rows={5}
              className="w-full resize-none rounded-sm border border-line bg-transparent p-4 text-sm text-paper outline-none focus-ring placeholder:text-muted"
              placeholder="e.g. Launch our new brand and hit $1M in pipeline"
            />
          </Field>
        )}

        {step === 1 && (
          <Field label="What&rsquo;s broken, slow, or missing right now?">
            <textarea
              value={data.challenges}
              onChange={(e) => update({ challenges: e.target.value })}
              rows={5}
              className="w-full resize-none rounded-sm border border-line bg-transparent p-4 text-sm text-paper outline-none focus-ring placeholder:text-muted"
              placeholder="e.g. Our website doesn't reflect where we are now"
            />
          </Field>
        )}

        {step === 2 && (
          <Field label="Annual revenue">
            <div className="flex flex-wrap gap-3">
              {REVENUE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ revenue: opt })}
                  className={`focus-ring rounded-sm border px-4 py-2 text-sm transition-colors ${
                    data.revenue === opt
                      ? "border-signal text-signal"
                      : "border-line text-muted hover:text-paper"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
        )}

        {step === 3 && (
          <Field label="Team size">
            <div className="flex flex-wrap gap-3">
              {TEAM_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ teamSize: opt })}
                  className={`focus-ring rounded-sm border px-4 py-2 text-sm transition-colors ${
                    data.teamSize === opt
                      ? "border-signal text-signal"
                      : "border-line text-muted hover:text-paper"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
        )}

        {step === 4 && (
          <div>
            <p className="text-xs text-muted">
              Review before we create your lead in Linc OS
            </p>
            <dl className="mt-5 space-y-4 text-sm">
              <Row label="Goals" value={data.goals} />
              <Row label="Challenges" value={data.challenges} />
              <Row label="Revenue" value={data.revenue} />
              <Row label="Team Size" value={data.teamSize} />
            </dl>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`focus-ring rounded-sm text-sm text-muted transition-colors hover:text-paper ${
            step === 0 ? "invisible" : ""
          }`}
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance()}
            onClick={() => setStep((s) => s + 1)}
            className="focus-ring rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-opacity disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="focus-ring rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink"
          >
            Submit to Linc OS
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-paper">{label}</label>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line pb-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-paper">{value || "—"}</dd>
    </div>
  );
}
