import { i18nProvider } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { i18n, isLocale } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
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

const meta = {
  en: {
    title: "ocra — code review that reads before it comments",
    description:
      "Open-CR-Agent (ocra) runs specialized review agents inside a deterministic pipeline: grounded findings, anchored to the right line, built to be measured.",
  },
  zh: {
    title: "ocra — 先读懂代码，再开口的代码审查",
    description:
      "Open-CR-Agent（ocra）在确定性的流水线里运行专项审查 agent：意见有据可查，落在正确的行上，为评测而生。",
  },
};

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
  const { lang } = await params;
  const { title, description } = lang === "zh" ? meta.zh : meta.en;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: "%s · ocra" },
    description,
    alternates: { languages: { en: "/", "zh-CN": "/zh" } },
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
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html
      lang={lang === "zh" ? "zh-CN" : "en"}
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
