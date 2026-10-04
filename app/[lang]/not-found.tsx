import { i18nProvider } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { LazyNotFoundPage } from "@/components/not-found-lazy";
import type { NotFoundPage } from "@/components/not-found-page";
import { getCopy } from "@/lib/copy";
import { i18n } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";

// The server-rendered title, before the page sets the localised one.
export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
};

// not-found receives no params, so the page picks its language on the
// client; it gets the few strings it needs in every language.
export default function NotFound() {
  const text = Object.fromEntries(
    i18n.languages.map((locale) => {
      const copy = getCopy(locale);
      return [
        locale,
        {
          ...copy.notFound,
          docs: copy.nav.links.docs,
          ui: i18nProvider(translations, locale),
        },
      ];
    }),
  ) as Parameters<typeof NotFoundPage>[0]["text"];
  return <LazyNotFoundPage text={text} />;
}
