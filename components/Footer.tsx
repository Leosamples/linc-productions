import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-edit grid gap-10 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <div className="font-display text-sm tracking-[0.08em] text-paper">
            Linc Productions
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Creative operating systems for executive businesses.
          </p>
        </div>

        <div>
          <div className="text-sm text-paper">Explore</div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/studio">Studio</Link></li>
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/services">Services</Link></li>
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/portfolio">Portfolio</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm text-paper">Systems</div>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/linc-os">Linc OS</Link></li>
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/portal">Client Portal</Link></li>
            <li><Link className="hover:text-paper focus-ring rounded-sm" href="/strategy">Strategy Session</Link></li>
          </ul>
        </div>
      </div>

      <div className="rule" />

      <div className="container-edit flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Linc Productions. All rights reserved.</span>
        <Link href="/about" className="hover:text-paper focus-ring rounded-sm">About</Link>
      </div>
    </footer>
  );
}
