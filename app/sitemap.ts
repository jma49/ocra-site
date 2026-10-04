import type { MetadataRoute } from "next";
import { htmlLang, i18n, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/shared";
import { source } from "@/lib/source";

function entry(path: string, languages: readonly Locale[]): MetadataRoute.Sitemap {
  const url = (locale: Locale) => new URL(localePath(locale, path), siteUrl()).href;
  const alternates = {
    languages: Object.fromEntries(languages.map((l) => [htmlLang[l], url(l)])),
  };
  return languages.map((locale) => ({ url: url(locale), alternates }));
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
    ...entry("/", i18n.languages),
    ...[...docs].flatMap(([path, languages]) => entry(path, languages)),
  ];
}
