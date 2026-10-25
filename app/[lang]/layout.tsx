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

// Before the first paint, on every document load (the manual included, so a
// visitor who follows the logo to the landing page arrives with it): the
// viewport height for the pinned story, and `html.mo` when motion is allowed,
// which is what every pre-play state of the landing page waits for. If the
// landing page never hydrates (components/landing/motion.tsx adds `hy`), `mo`
// goes after 4 s and the page shows finished.
// A repeat visit in the session (hero/hero-play.tsx) adds `seen`, so the
// hero paints its final state at once.
const gate = `(function(){var d=document.documentElement;d.style.setProperty("--vh",innerHeight+"px");if(matchMedia("(prefers-reduced-motion: no-preference)").matches){d.classList.add("mo");setTimeout(function(){if(document.querySelector(".home")&&!d.classList.contains("hy"))d.classList.remove("mo")},4000)}})()`;

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
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a constant script that must run before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: gate }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
