import type { Locale } from "./i18n";

export function docsPath(slugs: readonly string[] = []): string {
  return ["/docs", ...slugs].join("/");
}

export function indexDocLanguages(
  languages: readonly Locale[],
  pagesFor: (locale: Locale) => readonly { path: string; slugs: readonly string[] }[],
): ReadonlyMap<string, readonly Locale[]> {
  const docs = new Map<string, Locale[]>();
  for (const locale of languages) {
    for (const page of pagesFor(locale)) {
      // Fumadocs serves an English fallback under /zh; it isn't a translation.
      if (!page.path.startsWith(`${locale}/`)) continue;
      const path = docsPath(page.slugs);
      docs.set(path, [...(docs.get(path) ?? []), locale]);
    }
  }
  return docs;
}
