import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { getCopy } from "@/lib/copy";
import { baseOptions } from "@/lib/layout.shared";
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
    <DocsLayout
      tree={source.getPageTree(lang)}
      {...baseOptions(lang, {
        docs: getCopy(lang).nav.links.docs,
        dark: true,
      })}
    >
      {children}
    </DocsLayout>
  );
}
