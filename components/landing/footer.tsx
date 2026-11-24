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

// The other language's link is set in that language, for screen readers
// and for the browser's choice of face.
function linkLang(id: FooterLinkId, locale: Locale): Locale | undefined {
  return id === "other-language" ? otherLocale(locale) : undefined;
}

// Four columns of links, then the wordmark edge to edge, cut by the page's
// foot (80-final.css).
export function Footer({ copy, locale }: { copy: Copy["footer"]; locale: Locale }) {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div className="foot-brand">
          <Link href={localePath(locale, "/")} prefetch={false} className="foot-logo">
            <Logo />
          </Link>
          <p className="small t3">{copy.tagline}</p>
          <p className="small t3">{copy.base.license}</p>
        </div>
        <nav className="foot-cols" aria-label={copy.label}>
          {copy.columns.map((col, i) => (
            <div key={col.title}>
              <h2 className="foot-h" id={`foot-${i}`}>
                {col.title}
              </h2>
              <ul aria-labelledby={`foot-${i}`}>
                {col.links.map((l) => (
                  <li key={l.id}>
                    <a
                      href={footerHref(l.id, locale)}
                      lang={linkLang(l.id, locale)}
                      hrefLang={linkLang(l.id, locale)}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap word" data-word="ocra" aria-hidden="true" />
    </footer>
  );
}
