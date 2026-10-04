import { NotFoundPage } from "@/components/not-found-page";
import { getCopy } from "@/lib/copy";
import { i18n } from "@/lib/i18n";

// not-found receives no params, so the page picks its language on the
// client; it gets the few strings it needs in every language.
export default function NotFound() {
  const text = Object.fromEntries(
    i18n.languages.map((locale) => {
      const copy = getCopy(locale);
      return [locale, { ...copy.notFound, docs: copy.nav.links.docs }];
    }),
  ) as Parameters<typeof NotFoundPage>[0]["text"];
  return <NotFoundPage text={text} />;
}
