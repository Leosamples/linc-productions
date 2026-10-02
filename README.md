# Linc Productions — Website

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

Built from the original design export (`Linc_Productions_portal_website.zip`)
as a reference — content and structure carried over, layout and code
rebuilt from scratch as a real, deployable codebase.

## Pages

- `/` — Home
- `/about`
- `/services`
- `/studio`
- `/portfolio`
- `/linc-os`
- `/strategy` — multi-step Strategy Session form (client-side only for now)
- `/portal` — static preview of the client portal

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Next.js** (auto-detected). No environment variables
   are required for the site to build and deploy as-is.
4. Deploy. Every push to `main` will auto-deploy from then on.

## Stripe setup (for the /invoice page)

`/invoice` is an internal tool you use yourself to build an itemized
invoice and generate a Stripe payment link for it — it's not a page you
send clients to. The flow is: build the invoice → click **Generate
Payment Link** → copy the link it gives you → paste that into whatever
you actually send the client (email, text, or as the "Pay" link on a
PDF invoice). The link opens **checkout.stripe.com** directly — the
client never visits lincproductions.com. It shows your itemized line
items on Stripe's own payment page too.

Your secret key never touches the browser; a server route
(`app/api/create-checkout-session/route.ts`) creates the Stripe
Checkout Session and only the resulting URL comes back to the page.

1. Create a Stripe account (or use your existing one) at
   [dashboard.stripe.com](https://dashboard.stripe.com).
2. Go to **Developers → API keys** and copy your **Secret key**
   (starts with `sk_live_...` or `sk_test_...` — use the test key while
   you're trying this out).
3. In your Vercel project: **Settings → Environment Variables** → add
   `STRIPE_SECRET_KEY` with that value → save. Never put this key in
   the code or commit it to git — Vercel injects it at runtime.
4. Redeploy (Vercel does this automatically after you add an env var,
   or push any commit). Visit `/invoice`, add line items, click
   **Generate Payment Link**, and copy the URL it shows you.
5. Test cards (only work with a `sk_test_...` key): `4242 4242 4242 4242`,
   any future expiry, any CVC.

Note: Stripe Checkout links expire 24 hours after creation, so generate
a fresh one right before sending it — don't reuse an old one.

When you're ready to accept real payments, switch the Vercel env var to
your **live** secret key (`sk_live_...`).

**Simpler alternative — no code needed:** Stripe also has its own
built-in Invoicing product (Dashboard → Invoices). It builds an
itemized, branded invoice and emails it to the client directly (or
gives you a link) with a "Pay this invoice" button, entirely on
Stripe's side. If you don't need the invoice's exact look to match the
site, that's the faster path and requires none of the above.

### ACH bank transfer (cheaper than card)

Card payments cost 2.9% + 30¢. ACH direct debit costs 0.8% (capped at
$5) — worth turning on for larger invoices. One setting covers **both**
payment paths above, since they share the same Stripe account:

1. Dashboard → Settings → Payment methods → enable **US bank account**.
2. That's it. The `/invoice` tool's Checkout links now offer "US bank
   account" as an option alongside card automatically (already wired
   up in `create-checkout-session/route.ts`), and native Stripe
   Invoicing offers it too. The client picks card or bank transfer on
   Stripe's own payment page — you don't build anything extra.

Note: ACH takes a few business days to clear (unlike an instant card
charge), so the invoice shows as "processing" until it settles.

## Still to wire up before launch

- **Strategy Session → Linc OS**: `components/StrategyForm.tsx` currently
  simulates a created lead client-side. Replace the `submit()` function
  with a call to your real Linc OS lead-intake endpoint (or an API route
  under `app/api/`) so submissions actually land in Linc OS.
- **Portfolio case studies**: `app/portfolio/page.tsx` has placeholder
  client names (Meridian Capital, Halcyon Group, etc.) — swap in real work.
- **Portal**: `app/portal/page.tsx` is a static preview, not an
  authenticated dashboard. Real project/file/invoice data will need a
  backend and auth (e.g. NextAuth + your Linc OS database).
- **Metadata**: update the Open Graph image / favicon in `app/` once you
  have final brand assets, and set a custom domain in Vercel's project
  settings.

## Design tokens

Colors, fonts and spacing live in `tailwind.config.ts` and
`app/globals.css` — ink (#050505), paper (#F5F2EA), signal blue (#35B7FF).
Fonts: Cinzel (display/wordmark), Instrument Serif (headlines),
Space Grotesk (body/UI) — loaded via `next/font/google` in `app/layout.tsx`.
