import type { MetadataRoute } from "next";
import { htmlLang, i18n, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/shared";
import { source } from "@/lib/source";

// The sitemap is prerendered, so this is when the build ran: each deploy
// rebuilds every page, the manual included (scripts/sync-manual.mjs).
const lastModified = new Date();

function entry(
  path: string,
  languages: readonly Locale[],
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap {
  const url = (locale: Locale) => new URL(localePath(locale, path), siteUrl()).href;
  const alternates = {
    languages: {
      ...Object.fromEntries(languages.map((l) => [htmlLang[l], url(l)])),
      ...(languages.includes(i18n.defaultLanguage) && {
        "x-default": url(i18n.defaultLanguage),
      }),
    },
  };
  return languages.map((locale) => ({
    url: url(locale),
    lastModified,
    changeFrequency,
    priority,
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = new Map<string, Locale[]>();
  for (const locale of i18n.languages) {
    for (const page of source.getPages(locale)) {
      const path = page.slugs.length ? `/docs/${page.slugs.join("/")}` : "/docs";
      docs.set(path, [...(docs.get(path) ?? []), locale]);
    }
  }
  return [
    ...entry("/", i18n.languages, 1.0, "weekly"),
    ...[...docs].flatMap(([path, languages]) =>
      entry(path, languages, path === "/docs" ? 0.9 : 0.8, "weekly"),
    ),
  ];
}
