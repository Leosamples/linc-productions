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
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="container-edit flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3 focus-ring rounded-sm">
          <Image src="/images/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-sm tracking-[0.08em] text-paper">
            Linc Productions
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-paper focus-ring rounded-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/strategy"
            className="focus-ring rounded-sm border border-paper/20 px-4 py-2 text-sm text-paper transition-colors hover:border-signal hover:text-signal"
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
        <div className="border-t border-line bg-ink md:hidden">
          <div className="container-edit flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-sm px-1 py-3 text-base text-paper focus-ring"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/strategy"
              className="mt-2 rounded-sm border border-paper/20 px-4 py-3 text-center text-sm text-paper focus-ring"
            >
              Strategy Session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
