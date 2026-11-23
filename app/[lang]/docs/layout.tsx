import { i18nProvider } from "@fumadocs/base-ui/i18n";
import { DocsLayout } from "@fumadocs/base-ui/layouts/notebook";
import type { ReactNode } from "react";
import { DocsHeader, DrawerFoot, DrawerHead } from "@/components/docs/docs-header";
import { Providers } from "@/components/providers";
import { getCopy } from "@/lib/copy";
import { baseOptions, translations } from "@/lib/layout.shared";
import { localeParam } from "@/lib/locale-param";
import { source } from "@/lib/source";
import "../../manual.css";

// The manual on the ocra Cloud console's design: the bar and the page tree
// on the ground, each page on one panel beside them (app/docs.css).
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
        sidebar={{ collapsible: false, banner: DrawerHead, footer: DrawerFoot }}
        slots={{ header: DocsHeader }}
        containerProps={{ className: "docs-frame" }}
      >
        {children}
      </DocsLayout>
    </Providers>
  );
}
