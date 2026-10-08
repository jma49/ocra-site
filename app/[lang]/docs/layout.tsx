import { i18nProvider } from "@fumadocs/base-ui/i18n";
import { DocsLayout } from "@fumadocs/base-ui/layouts/docs";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { getCopy } from "@/lib/copy";
import { baseOptions, translations } from "@/lib/layout.shared";
import { localeParam } from "@/lib/locale-param";
import { source } from "@/lib/source";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const lang = await localeParam(params);
  return (
    <Providers i18n={i18nProvider(translations, lang)}>
      <DocsLayout
        tree={source.getPageTree(lang)}
        {...baseOptions(lang, {
          docs: getCopy(lang).nav.links.docs,
          dark: true,
        })}
      >
        {children}
      </DocsLayout>
    </Providers>
  );
}
