import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Reads the secret key from a server-side environment variable —
// this file only ever runs on the server, so the key is never sent
// to the browser. Set STRIPE_SECRET_KEY in Vercel's project settings
// (Settings → Environment Variables), never commit it to git.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

type LineItem = {
  name: string;
  description?: string;
  quantity: number;
  unitAmount: number; // dollars, e.g. 4500 for $4,500.00
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const items: LineItem[] = body.items ?? [];
    const invoiceNumber: string = body.invoiceNumber ?? "";

    if (!items.length) {
      return NextResponse.json({ error: "No line items provided." }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Card is always available. us_bank_account adds ACH direct debit —
      // cheaper (0.8%, capped at $5) than card's 2.9% + 30¢, worth it on
      // larger invoices. Requires ACH to be turned on once in the Stripe
      // Dashboard: Settings → Payment methods → enable "US bank account."
      payment_method_types: ["card", "us_bank_account"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || undefined,
          },
          // Stripe wants the smallest currency unit (cents)
          unit_amount: Math.round(item.unitAmount * 100),
        },
        quantity: item.quantity,
      })),
      metadata: invoiceNumber ? { invoice_number: invoiceNumber } : undefined,
      success_url: `${origin}/invoice?paid=1&invoice=${encodeURIComponent(invoiceNumber)}`,
      cancel_url: `${origin}/invoice?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
