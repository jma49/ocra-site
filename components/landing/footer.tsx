import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import type { FooterLinkId } from "@/lib/copy/sections/footer";
import { type Locale, otherLocale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";

function footerHref(id: FooterLinkId, locale: Locale): string {
  const docs = (page: string) => localePath(locale, `/docs/${page}`);
  const hrefs: Record<FooterLinkId, string> = {
    how: "#how",
    product: "#product",
    plans: "#plans",
    changelog: `${repoUrl}/blob/main/CHANGELOG.md`,
    quickstart: docs("quickstart"),
    "github-action": docs("github"),
    gitlab: docs("gitlab"),
    providers: docs("providers"),
    "threat-model": docs("threat-model"),
    privacy: `${cloudUrl}/privacy`,
    "security-policy": `${repoUrl}/security/policy`,
    quality: docs("quality"),
    repo: repoUrl,
    roadmap: `${repoUrl}/blob/main/docs/roadmap.md`,
    license: `${repoUrl}/blob/main/LICENSE`,
    "other-language": localePath(otherLocale(locale), "/"),
  };
  return hrefs[id];
}

// The footer continues the final band: one night sheet, two landmarks
// (sections.md §12). Stub from package F; C builds it out.
export function Footer({ copy, locale }: { copy: Copy["footer"]; locale: Locale }) {
  return (
    <footer className="foot band" data-ground="night">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <Link href={localePath(locale, "/")} prefetch={false} className="foot-logo">
            <Logo />
          </Link>
          <p className="t-small">{copy.tagline}</p>
        </div>
        <div className="foot-cols">
          {copy.columns.map((col) => (
            <div key={col.title}>
              <h2 className="t-kicker">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.id}>
                    <a href={footerHref(l.id, locale)}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
