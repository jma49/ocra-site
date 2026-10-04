import { i18nProvider } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { getCopy } from "@/lib/copy";
import { htmlLang, i18n } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import { localeParam } from "@/lib/locale-param";
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

// Every Vercel build, previews included, points canonical links at the
// custom domain; SITE_URL overrides it.
const PRODUCTION_URL = "https://ocracloud.com";

function siteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  return process.env.VERCEL ? PRODUCTION_URL : "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { title, description } = getCopy(await localeParam(params)).meta;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: "%s · ocra" },
    description,
    alternates: { languages: { [htmlLang.en]: "/", [htmlLang.zh]: "/zh" } },
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
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Providers
          i18n={i18nProvider(translations, lang)}
          theme={{ defaultTheme: "system", disableTransitionOnChange: true }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
