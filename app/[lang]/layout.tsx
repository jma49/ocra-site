import { i18nProvider } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { i18n, isLocale } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import "../global.css";

// Latin faces; Chinese falls through to the system fonts in global.css.
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const meta = {
  en: {
    title: "ocra — open-source multi-agent code review",
    description:
      "Open-CR-Agent (ocra) runs specialized review agents inside a deterministic pipeline: grounded findings, anchored to the right line, built to be measured.",
  },
  zh: {
    title: "ocra — 开源的多智能体代码审查",
    description:
      "Open-CR-Agent（ocra）在确定性的流水线里运行专项审查 agent：意见有据可查，落在正确的行上，为评测而生。",
  },
};

// Every Vercel build, previews included, points canonical links at the
// custom domain; SITE_URL overrides it.
const PRODUCTION_URL = "https://ocra.majincheng.com";

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
