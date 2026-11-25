import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/app/fonts";
import { getCopy } from "@/lib/copy";
import { htmlLang, i18n } from "@/lib/i18n";
import { localeParam } from "@/lib/locale-param";
import { siteUrl, social } from "@/lib/seo";

const KEYWORDS: Record<"en" | "zh", string[]> = {
  en: [
    "Ocra",
    "AI code review",
    "open-source code review",
    "GitHub pull request review",
    "GitLab merge request review",
    "automated code review",
    "code review agent",
    "BYOK AI code review",
  ],
  zh: [
    "Ocra",
    "AI 代码审查",
    "开源代码审查",
    "GitHub PR 自动审查",
    "GitLab MR 代码审查",
    "代码审查 agent",
    "自动化代码评审",
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const locale = await localeParam(params);
  const { title, description } = getCopy(locale).meta;
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl()),
    applicationName: "Ocra",
    title: { default: title, template: "%s · Ocra" },
    description,
    keywords: KEYWORDS[locale],
    authors: [{ name: "Ocra", url: siteUrl() }],
    creator: "Ocra",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(google ? { verification: { google } } : {}),
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
