"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/linc-os", label: "Linc OS" },
  { href: "/portal", label: "Portal" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="container-edit">
        <div className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-black/60 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3 focus-ring rounded-sm">
            <Image src="/images/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="font-display text-sm tracking-[0.08em] text-paper">
              Linc Productions
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="focus-ring rounded-full border border-white/10 px-4 py-2 text-xs font-medium tracking-wide text-paper/90 transition-colors hover:border-signal/40 hover:text-signal"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/strategy"
              className="focus-ring rounded-full bg-paper px-5 py-2.5 text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Strategy Session
            </Link>
          </div>

          <button
            className="flex flex-col gap-1.5 md:hidden focus-ring rounded-sm p-2 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-px w-5 bg-paper transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span className={`h-px w-5 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-5 bg-paper transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {open && (
          <div className="mt-2 rounded-[20px] border border-white/10 bg-black/90 p-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-sm px-2 py-3 text-base text-paper focus-ring"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/strategy"
                className="mt-2 rounded-full bg-paper px-4 py-3 text-center text-sm font-semibold text-ink focus-ring"
              >
                Strategy Session
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
