import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy, FooterLinkId } from "@/lib/copy";
import { type Locale, otherLocale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { BigSpider } from "./hanging-spider";
import { Heading } from "./heading";
import { Night } from "./night";
import { PlatedHeading } from "./plated-heading";

export function Faq({ copy }: { copy: Copy["faq"] }) {
  return (
    <section className="chapter tight-top">
      <div className="wrap faq-grid">
        <Heading title={copy.title} emphasis={copy.emphasis} />
        <div className="faq">
          {copy.items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Final({
  copy,
  locale,
}: {
  copy: Copy["final"];
  locale: Locale;
}) {
  return (
    <section className="final" id="final">
      <Night variant="final" />
      <div className="flash late" aria-hidden="true" />
      <div className="wrap">
        <BigSpider />
        <PlatedHeading as="h2" title={copy.title} emphasis={copy.emphasis} />
        <div className="cta">
          <a className="btn btn-dark" href={cloudUrl}>
            {copy.cloud} <i>&rarr;</i>
          </a>
          <a className="btn btn-soft" href={localePath(locale, "/docs")}>
            {copy.manual}
          </a>
        </div>
      </div>
    </section>
  );
}

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

export function Footer({
  copy,
  locale,
}: {
  copy: Copy["footer"];
  locale: Locale;
}) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href={localePath(locale, "/")}>
              <Logo />
            </Link>
            <p className="tagline">{copy.tagline}</p>
          </div>
          {copy.columns.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
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
        <div className="wordmark" aria-hidden="true">
          ocra
        </div>
      </div>
    </footer>
  );
}
