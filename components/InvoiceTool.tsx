"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type LineItem = {
  id: string;
  name: string;
  sub: string;
  qty: number;
  rate: number;
};

const SERVICES: Omit<LineItem, "id" | "qty">[] = [
  { name: "Brand Presence System", sub: "Identity, positioning, visual language", rate: 4500 },
  { name: "Content System", sub: "Photography and film library, built for reuse", rate: 3200 },
  { name: "Funnel & Lead System", sub: "Website and campaign built to convert", rate: 5000 },
  { name: "Cinematic Campaign", sub: "Brand film / commercial production", rate: 6500 },
  { name: "AI-Assisted Creative System", sub: "Production workflow build-out", rate: 3800 },
  { name: "Linc OS Setup", sub: "Client portal and operations layer", rate: 2500 },
  { name: "Website — Design & Build", sub: "Full site design and development", rate: 7500 },
  { name: "Photography Session", sub: "Half-day on-location or studio", rate: 1200 },
  { name: "Film Production Day", sub: "Full-day shoot, crew and gear included", rate: 3500 },
  { name: "Podcast Production", sub: "Per episode, recording through post", rate: 800 },
  { name: "Monthly Retainer", sub: "Ongoing creative production", rate: 4000 },
];

// NOTE: edit the rates above once — every invoice you create from this
// page will start from these numbers.

let idCounter = 0;
const nextId = () => `row-${++idCounter}`;

function currency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function InvoiceTool() {
  const params = useSearchParams();
  const paid = params.get("paid") === "1";
  const canceled = params.get("canceled") === "1";

  const [invoiceNumber, setInvoiceNumber] = useState("LP-1001");
  const [invoiceDate, setInvoiceDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(todayISO(15));

  const [bizLines, setBizLines] = useState([
    "123 Peachtree St, Suite 400",
    "Atlanta, GA 30303",
    "hello@lincproductions.com",
  ]);

  const [clientName, setClientName] = useState("Client / Company Name");
  const [clientContact, setClientContact] = useState("Contact Name");
  const [clientAddress, setClientAddress] = useState("Client Address");
  const [clientEmail, setClientEmail] = useState("client@email.com");

  const [items, setItems] = useState<LineItem[]>([
    { id: nextId(), ...SERVICES[0], qty: 1 },
    { id: nextId(), ...SERVICES[6], qty: 1 },
  ]);

  const [taxPct, setTaxPct] = useState(0);
  const [notes, setNotes] = useState(
    "Thank you for the opportunity to work together. Please reach out with any questions about this invoice."
  );
  const [terms, setTerms] = useState(
    "A 1.5% monthly late fee applies to balances unpaid after the due date."
  );

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");
  const [payLink, setPayLink] = useState("");
  const [copied, setCopied] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.qty * it.rate, 0),
    [items]
  );
  const taxAmt = subtotal * (taxPct / 100);
  const total = subtotal + taxAmt;

  function addService(idx: number) {
    if (idx < 0) return;
    const s = SERVICES[idx];
    setItems((prev) => [...prev, { id: nextId(), ...s, qty: 1 }]);
  }

  function addBlank() {
    setItems((prev) => [...prev, { id: nextId(), name: "New line item", sub: "", qty: 1, rate: 0 }]);
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function generatePayLink() {
    setPayError("");
    setPayLink("");
    setCopied(false);
    if (!items.length || total <= 0) {
      setPayError("Add at least one line item with an amount greater than $0.");
      return;
    }
    setPayLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          items: items.map((it) => ({
            name: it.name,
            description: it.sub,
            quantity: it.qty,
            unitAmount: it.rate,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong creating the payment session.");
      }
      setPayLink(data.url);
    } catch (err: any) {
      setPayError(err.message || "Payment link could not be created.");
    } finally {
      setPayLoading(false);
    }
  }

  function copyPayLink() {
    navigator.clipboard.writeText(payLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:py-0">
      {paid && (
        <div className="mb-6 rounded-sm border border-signal/40 bg-signal/10 p-4 text-sm text-paper print:hidden">
          Payment received for invoice {params.get("invoice") || invoiceNumber}. Thank you.
        </div>
      )}
      {canceled && (
        <div className="mb-6 rounded-sm border border-line bg-panel p-4 text-sm text-muted print:hidden">
          Payment was canceled — no charge was made.
        </div>
      )}

      <div className="flex items-center justify-between gap-3 print:hidden">
        <p className="text-xs text-muted">
          Click any text to edit it. Pick services below to add line items.
        </p>
        <div className="flex gap-3">
          <button
            onClick={addBlank}
            className="rounded-sm border border-line px-4 py-2 text-xs text-paper hover:border-paper/40"
          >
            + Blank line
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-sm border border-line px-4 py-2 text-xs text-paper hover:border-paper/40"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-sm border border-line bg-paper p-10 text-ink print:border-none print:p-0">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="" width={88} height={88} className="h-[88px] w-[88px] object-contain" />
              <div className="font-display text-base tracking-[0.08em] text-ink">
                LINC<span className="text-signal">·</span>PRODUCTIONS
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs leading-relaxed text-ink/60">
              {bizLines.map((line, i) => (
                <div
                  key={i}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...bizLines];
                    next[i] = e.currentTarget.textContent || "";
                    setBizLines(next);
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <h1 className="font-display text-2xl text-ink">Invoice</h1>
            <div className="mt-2 space-y-1.5 text-xs text-ink/60">
              <div>
                <span className="text-ink">Invoice #</span>{" "}
                <input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-28 border-b border-dashed border-ink/20 bg-transparent text-right text-ink outline-none focus:border-signal"
                />
              </div>
              <div>
                <span className="text-ink">Date</span>{" "}
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-32 border-b border-dashed border-ink/20 bg-transparent text-right text-ink outline-none focus:border-signal"
                />
              </div>
              <div>
                <span className="text-ink">Due</span>{" "}
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-32 border-b border-dashed border-ink/20 bg-transparent text-right text-ink outline-none focus:border-signal"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-ink/10" />

        <div className="flex justify-between gap-8">
          <div className="w-1/2 text-sm leading-relaxed">
            <div className="text-[11px] uppercase tracking-wider text-ink/50">Bill To</div>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-2 w-full bg-transparent font-medium text-ink outline-none"
            />
            <input
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              className="w-full bg-transparent text-ink outline-none"
            />
            <input
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full bg-transparent text-ink outline-none"
            />
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-transparent text-ink outline-none"
            />
          </div>

          <div className="w-1/2 text-right text-sm leading-relaxed">
            <div className="text-[11px] uppercase tracking-wider text-ink/50">Payment</div>
            <div className="mt-2 text-ink/70">
              Paid securely via Stripe Checkout — click{" "}
              <span className="text-ink">Pay Invoice</span> below.
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3 print:hidden">
          <select
            onChange={(e) => {
              addService(Number(e.target.value));
              e.target.value = "-1";
            }}
            defaultValue="-1"
            className="flex-1 min-w-[220px] rounded-sm border border-ink/15 bg-white px-3 py-2 text-sm text-ink"
          >
            <option value="-1">+ Add a service…</option>
            {SERVICES.map((s, i) => (
              <option key={s.name} value={i}>
                {s.name} — {currency(s.rate)}
              </option>
            ))}
          </select>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink text-[11px] uppercase tracking-wider text-ink/50">
              <th className="pb-2 text-left font-medium">Description</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Rate</th>
              <th className="pb-2 text-right font-medium">Amount</th>
              <th className="w-6 pb-2 print:hidden" />
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-ink/10">
                <td className="py-3 align-top">
                  <input
                    value={it.name}
                    onChange={(e) => updateItem(it.id, { name: e.target.value })}
                    className="w-full bg-transparent font-medium text-ink outline-none"
                  />
                  <input
                    value={it.sub}
                    onChange={(e) => updateItem(it.id, { sub: e.target.value })}
                    className="mt-0.5 w-full bg-transparent text-xs text-ink/50 outline-none"
                  />
                </td>
                <td className="py-3 text-right align-top">
                  <input
                    type="number"
                    min={0}
                    value={it.qty}
                    onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) || 0 })}
                    className="w-14 rounded-sm border border-ink/15 bg-white px-2 py-1 text-right text-sm text-ink"
                  />
                </td>
                <td className="py-3 text-right align-top">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.rate}
                    onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) || 0 })}
                    className="w-24 rounded-sm border border-ink/15 bg-white px-2 py-1 text-right text-sm text-ink"
                  />
                </td>
                <td className="py-3 text-right align-top tabular-nums text-ink">
                  {currency(it.qty * it.rate)}
                </td>
                <td className="py-3 text-right align-top print:hidden">
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-ink/30 hover:text-rust"
                    aria-label="Remove line"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-64 text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-ink/50">Subtotal</span>
              <span className="tabular-nums text-ink">{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-ink/50">
                Tax (
                <input
                  type="number"
                  min={0}
                  value={taxPct}
                  onChange={(e) => setTaxPct(Number(e.target.value) || 0)}
                  className="w-10 border-b border-dashed border-ink/20 bg-transparent text-right text-ink outline-none"
                />
                %)
              </span>
              <span className="tabular-nums text-ink">{currency(taxAmt)}</span>
            </div>
            <div className="flex justify-between border-t border-ink pt-2.5 text-base font-semibold">
              <span className="text-ink">Total Due</span>
              <span className="tabular-nums text-signal">{currency(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-end gap-2 print:hidden">
          <button
            onClick={generatePayLink}
            disabled={payLoading}
            className="rounded-sm bg-signal px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {payLoading ? "Creating link…" : "Generate Payment Link"}
          </button>
          {payError && <div className="text-xs text-rust">{payError}</div>}

          {payLink && (
            <div className="mt-2 w-full rounded-sm border border-line bg-panel p-4 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted">
                Send this link to your client — it opens Stripe Checkout directly, no site visit needed
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={payLink}
                  onFocus={(e) => e.target.select()}
                  className="flex-1 truncate rounded-sm border border-line bg-ink px-3 py-2 text-xs text-paper outline-none"
                />
                <button
                  onClick={copyPayLink}
                  className="shrink-0 rounded-sm bg-paper px-4 py-2 text-xs font-medium text-ink"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <div className="mt-2 text-[11px] text-muted">
                Note: Stripe Checkout links expire after 24 hours. Generate a fresh one right before you send it.
              </div>
            </div>
          )}

          {!payLink && (
            <div className="text-[11px] text-ink/40">
              Creates a Stripe-hosted payment link for this exact total — card or bank transfer (ACH), no card details touch your site.
            </div>
          )}
        </div>

        <div className="mt-12 flex gap-10 text-xs leading-relaxed text-ink/60">
          <div className="flex-1">
            <div className="mb-1.5 text-[11px] uppercase tracking-wider text-ink/50">Notes</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full resize-none bg-transparent outline-none"
            />
          </div>
          <div className="flex-1">
            <div className="mb-1.5 text-[11px] uppercase tracking-wider text-ink/50">Terms</div>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={3}
              className="w-full resize-none bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="mt-10 text-center text-[11px] text-ink/40">
          Linc Productions · lincproductions.com
        </div>
      </div>
    </div>
  );
}
