import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/app/fonts";
import { getCopy } from "@/lib/copy";
import { htmlLang, i18n } from "@/lib/i18n";
import { localeParam } from "@/lib/locale-param";
import { siteUrl, social } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeParam(params);
  const { title, description } = getCopy(locale).meta;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: "%s · ocra" },
    description,
    ...social({ locale, path: "/", title, description }),
  };
}

// Only the languages exist; any other first segment is the static 404
// (app/global-not-found.tsx), never a page rendered and cached on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const lang = await localeParam(params);
  return (
    <html lang={htmlLang[lang]} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
