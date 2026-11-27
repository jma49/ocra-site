import type { Copy } from "./copy";
import { docsPath } from "./doc-paths";
import { htmlLang, type Locale } from "./i18n";
import { siteUrl } from "./seo";
import { localePath, repoUrl } from "./shared";

// Serialize JSON-LD safely inside <script type="application/ld+json">: escape
// "<" so a string can never close the script tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

export function homeJsonLd(locale: Locale, copy: Copy) {
  const base = siteUrl();
  const pageUrl = new URL(localePath(locale, "/"), base).href;
  const orgUrl = new URL("/", base).href;
  const logoUrl = new URL("/icon.svg", base).href;
  const ogUrl = new URL("/opengraph-image", base).href;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${orgUrl}#organization`,
        name: "Ocra",
        url: orgUrl,
        logo: logoUrl,
        sameAs: [repoUrl, "https://github.com/ocrahq"],
      },
      {
        "@type": "WebSite",
        "@id": `${orgUrl}#website`,
        name: "Ocra",
        alternateName: ["ocra", "Open-CR-Agent"],
        url: orgUrl,
        inLanguage: ["en", "zh-CN"],
        publisher: { "@id": `${orgUrl}#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#software`,
        name: "Ocra",
        alternateName: "Open-CR-Agent",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Linux, Windows",
        url: pageUrl,
        image: ogUrl,
        description: copy.meta.description,
        inLanguage: htmlLang[locale],
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        isAccessibleForFree: true,
        codeRepository: repoUrl,
        publisher: { "@id": `${orgUrl}#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: htmlLang[locale],
        mainEntity: copy.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}

export function docJsonLd({
  locale,
  path,
  title,
  description,
  docsLabel,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  docsLabel: string;
}) {
  const base = siteUrl();
  const homeUrl = new URL(localePath(locale, "/"), base).href;
  const docsUrl = new URL(localePath(locale, docsPath()), base).href;
  const pageUrl = new URL(localePath(locale, path), base).href;
  const isIndex = path === docsPath();

  const breadcrumbs = [
    { "@type": "ListItem", position: 1, name: "Ocra", item: homeUrl },
    { "@type": "ListItem", position: 2, name: docsLabel, item: docsUrl },
    ...(isIndex ? [] : [{ "@type": "ListItem", position: 3, name: title, item: pageUrl }]),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        ...(description ? { description } : {}),
        url: pageUrl,
        inLanguage: htmlLang[locale],
        author: { "@type": "Organization", name: "Ocra", url: new URL("/", base).href },
        publisher: { "@type": "Organization", name: "Ocra", url: new URL("/", base).href },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs,
      },
    ],
  };
}
