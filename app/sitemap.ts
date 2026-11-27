import type { MetadataRoute } from "next";
import { docsPath } from "@/lib/doc-paths";
import { i18n, type Locale, languageAlternates } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/shared";
import { docLanguages } from "@/lib/source";

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
  const alternates = { languages: languageAlternates(languages, url) };
  return languages.map((locale) => ({
    url: url(locale),
    lastModified,
    changeFrequency,
    priority,
    alternates,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("/", i18n.languages, 1.0, "weekly"),
    ...[...docLanguages].flatMap(([path, languages]) =>
      entry(path, languages, path === docsPath() ? 0.9 : 0.8, "weekly"),
    ),
  ];
}
