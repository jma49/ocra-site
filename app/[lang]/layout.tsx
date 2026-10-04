import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { getCopy } from "@/lib/copy";
import { htmlLang, i18n } from "@/lib/i18n";
import { localeParam } from "@/lib/locale-param";
import { siteUrl, social } from "@/lib/seo";
import "../global.css";

// Latin faces; Chinese falls through to the system fonts in global.css.
// Archivo's width axis carries the whole type scale: condensed black for
// posters, semi-condensed for headings, normal width for text.
const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});
// Every terminal and code sample is set in Maple Mono (maintainer's rule).
const mono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/maple-mono/files/maple-mono-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/maple-mono/files/maple-mono-latin-500-normal.woff2",
      weight: "500",
    },
  ],
  variable: "--font-maple",
});

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
    <html
      lang={htmlLang[lang]}
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
