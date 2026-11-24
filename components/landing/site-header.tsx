import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { MenuButton, NavShell, ThemeToggle } from "./header-controls";

// The skip link and the sticky nav; below 1024 px the links move into a
// drawer (header-controls.tsx).
export function SiteHeader({ copy, locale }: { copy: Copy["nav"]; locale: Locale }) {
  const links = [
    { href: "#how", label: copy.links.how },
    { href: "#product", label: copy.links.product },
    { href: "#security", label: copy.links.security },
    { href: "#plans", label: copy.links.pricing },
    { href: localePath(locale, "/docs"), label: copy.links.docs },
  ];
  return (
    <>
      <a className="skip" href="#main">
        {copy.skip}
      </a>
      <NavShell
        bar={
          <>
            {/* The page itself: nothing to prefetch. */}
            <Link
              className="nav-logo"
              href={localePath(locale, "/")}
              aria-label={copy.home}
              prefetch={false}
            >
              <Logo />
            </Link>
            <nav className="nav-links" aria-label={copy.primary}>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="nav-r">
              <a className="nav-a" href={repoUrl}>
                {copy.github}
              </a>
              <a className="nav-a" href={cloudUrl}>
                {copy.signIn}
              </a>
              <ThemeToggle label={copy.theme} className="nav-theme" />
              <a className="btn btn-ink btn-sm nav-cta" href={cloudUrl}>
                {copy.start}
              </a>
              <MenuButton labels={{ open: copy.menu, close: copy.close }} />
            </div>
          </>
        }
        drawer={
          <>
            <ul>
              {[
                ...links,
                { href: repoUrl, label: copy.github },
                { href: cloudUrl, label: copy.signIn },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="drawer-theme">
              <span aria-hidden="true">{copy.theme}</span>
              <ThemeToggle label={copy.theme} />
            </div>
            <a className="btn btn-ink drawer-cta" href={cloudUrl}>
              {copy.start}
            </a>
          </>
        }
      />
    </>
  );
}
