import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { MenuButton, NavShell, ThemeToggle } from "./header-controls";
import { ArrowGlyph } from "./section";

// The skip link, the announce line and the sticky nav. The bar follows the
// ground under it and promotes its call to action once the hero has gone by
// (header-controls.tsx); below 1024 px the links move into a drawer.
export function SiteHeader({
  copy,
  locale,
}: {
  copy: { announce: Copy["announce"]; nav: Copy["nav"] };
  locale: Locale;
}) {
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
      <a className="skip" href="#main">
        {n.skip}
      </a>
      <aside className="announce" aria-label={copy.announce.label}>
        <p>
          {copy.announce.text}{" "}
          <a href="#plans-fine">
            {copy.announce.link}
            <ArrowGlyph />
          </a>
        </p>
      </aside>
      <NavShell
        top="desk"
        bar={
          <>
            {/* The page itself: nothing to prefetch. */}
            <Link
              className="nav-logo"
              href={localePath(locale, "/")}
              aria-label={n.home}
              prefetch={false}
            >
              <Logo />
            </Link>
            <nav className="nav-links" aria-label={n.primary}>
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
                {n.github}
              </a>
              <a className="nav-a" href={cloudUrl}>
                {n.signIn}
              </a>
              <ThemeToggle label={n.theme} className="nav-theme" />
              <a className="btn btn-sm nav-cta" href={cloudUrl}>
                {n.start}
              </a>
              <MenuButton labels={{ open: n.menu, close: n.close }} />
            </div>
          </>
        }
        drawer={
          <>
            <ul>
              {[
                ...links,
                { href: repoUrl, label: n.github },
                { href: cloudUrl, label: n.signIn },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="drawer-theme">
              <span aria-hidden="true">{n.theme}</span>
              <ThemeToggle label={n.theme} />
            </div>
            <a className="btn btn-primary drawer-cta" href={cloudUrl}>
              {n.start}
              <ArrowGlyph />
            </a>
          </>
        }
      />
    </>
  );
}
