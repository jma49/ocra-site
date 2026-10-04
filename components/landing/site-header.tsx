"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";

// Announcement bar and the floating dark-glass nav of the landing page.
export function SiteHeader({ copy, locale }: { copy: Copy; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // The menu closes on a tap outside it, on Escape (focus returns to its
  // button) and once the page scrolls.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const outside = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      menuButton.current?.focus();
    };
    const startY = scrollY;
    const scrolled = () => {
      if (Math.abs(scrollY - startY) > 40) close();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", onKey);
    addEventListener("scroll", scrolled, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", onKey);
      removeEventListener("scroll", scrolled);
    };
  }, [open]);
  const { resolvedTheme, setTheme } = useTheme();
  const n = copy.nav;
  const links = [
    { href: "#how", label: n.links.how },
    { href: "#product", label: n.links.product },
    { href: "#security", label: n.links.security },
    { href: "#plans", label: n.links.pricing },
    { href: localePath(locale, "/docs"), label: n.links.docs },
  ];
  return (
    <>
      <aside className="announce" aria-label={copy.announce.label}>
        {copy.announce.text} <a href="#plans">{copy.announce.link} &rarr;</a>
      </aside>
      <div className="nav-shell" data-open={open} ref={shell}>
        <header className="nav">
          <Link href={localePath(locale, "/")} aria-label={copy.nav.home}>
            <Logo dark />
          </Link>
          <nav className="links" aria-label={copy.nav.primary}>
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-r">
            <a className="t" href={repoUrl}>
              {n.github}
            </a>
            <a className="t" href={cloudUrl}>
              {n.signIn}
            </a>
            <button
              type="button"
              className="ib"
              aria-label={n.theme}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            </button>
            <a className="btn btn-brand btn-sm" href={cloudUrl}>
              {n.start}
            </a>
            <button
              type="button"
              ref={menuButton}
              className="ib menu"
              aria-label={n.menu}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </header>
        <div className="drawer" id="site-menu">
          {[
            ...links,
            { href: repoUrl, label: n.github },
            { href: cloudUrl, label: n.signIn },
          ].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
