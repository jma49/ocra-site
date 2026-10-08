import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { MenuButton, NavShell, ThemeToggle } from "./header-controls";

// Announcement bar and the nav of the landing page, ink glass over the night.
export function SiteHeader({ copy, locale }: { copy: Copy; locale: Locale }) {
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
      <NavShell>
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
            <ThemeToggle label={n.theme} />
            <a className="btn btn-brand btn-sm" href={cloudUrl}>
              {n.start}
            </a>
            <MenuButton label={n.menu} />
          </div>
        </header>
        <div className="drawer" id="site-menu">
          {[...links, { href: repoUrl, label: n.github }, { href: cloudUrl, label: n.signIn }].map(
            (l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ),
          )}
        </div>
      </NavShell>
    </>
  );
}
