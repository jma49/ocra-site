import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "zh"],
  hideLocale: "default-locale",
  parser: "dir",
});

export type Locale = (typeof i18n.languages)[number];

export function isLocale(value: string): value is Locale {
  return (i18n.languages as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

// The value of <html lang> and hreflang for each language.
export const htmlLang: Record<Locale, string> = { en: "en", zh: "zh-CN" };

export function languageAlternates(languages: readonly Locale[], url: (locale: Locale) => string) {
  const links: Record<string, string> = {};
  for (const locale of languages) links[htmlLang[locale]] = url(locale);
  if (languages.includes(i18n.defaultLanguage)) links["x-default"] = url(i18n.defaultLanguage);
  return links;
}
