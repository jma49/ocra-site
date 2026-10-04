import type { Metadata } from "next";
import { htmlLang, i18n, type Locale } from "./i18n";
import { localePath } from "./shared";

// Every Vercel build, previews included, points canonical links at the
// custom domain; SITE_URL overrides it.
const PRODUCTION_URL = "https://ocracloud.com";

export function siteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  return process.env.VERCEL ? PRODUCTION_URL : "http://localhost:3000";
}

// Canonical and language alternates for a page that exists at `path` in
// `languages` (each page sets its own, so none is inherited from the root
// layout). x-default is the default language's version.
export function alternates(
  locale: Locale,
  path: string,
  languages: readonly Locale[] = i18n.languages,
): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(
        languages.map((l) => [htmlLang[l], localePath(l, path)]),
      ),
      ...(languages.includes(i18n.defaultLanguage) && {
        "x-default": localePath(i18n.defaultLanguage, path),
      }),
    },
  };
}

// Open Graph and Twitter tags for one page. Next replaces a parent's
// openGraph object rather than merging it, so every page sets all of them.
export function social({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { url: "/opengraph-image", width: 1200, height: 630 };
  return {
    openGraph: {
      type: "website",
      siteName: "ocra",
      url: localePath(locale, path),
      title,
      description,
      locale: htmlLang[locale],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
