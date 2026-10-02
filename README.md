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
