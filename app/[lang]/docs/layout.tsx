import { i18nProvider } from "@fumadocs/base-ui/i18n";
import { DocsLayout } from "@fumadocs/base-ui/layouts/notebook";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { getCopy } from "@/lib/copy";
import { baseOptions, translations } from "@/lib/layout.shared";
import { localeParam } from "@/lib/locale-param";
import { source } from "@/lib/source";
import "../../manual.css";

// The manual lies on the landing page's desk: the nav runs across the top and
// the page tree down the left on the ink-teal, and each page is a printed
// sheet between them (app/docs.css).
export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const lang = await localeParam(params);
  const options = baseOptions(lang, getCopy(lang).nav);
  return (
    <Providers i18n={i18nProvider(translations, lang)}>
      <DocsLayout
        tree={source.getPageTree(lang)}
        {...options}
        nav={{ ...options.nav, mode: "top" }}
        sidebar={{ collapsible: false }}
        containerProps={{ className: "docs-desk" }}
      >
        {children}
      </DocsLayout>
    </Providers>
  );
}
