import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./i18n";

// The [lang] segment as a Locale; anything else is a 404.
export async function localeParam(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
