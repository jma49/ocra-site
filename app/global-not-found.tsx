import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import { LandingTheme } from "@/components/landing-theme";
import { Logo } from "@/components/logo";
import { getCopy } from "@/lib/copy";
import { htmlLang, i18n, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo";
import { localePath } from "@/lib/shared";
import "./global.css";

// One title for both languages: the page is the same for every path.
export const metadata: Metadata = { metadataBase: new URL(siteUrl()), title: "404 · ocra" };

const prefixed = i18n.languages.filter((locale) => locale !== i18n.defaultLanguage);

// One static page answers every path the site does not have, so it holds
// both languages. Before anything paints, this reads the language from the
// path as localePath() writes it, sets <html lang> and marks <html> so that
// global.css shows only that language. Without scripts both show, each in
// its own lang.
const pickLanguage = `{const d=document.documentElement,s=location.pathname.split("/")[1],l=${JSON.stringify(prefixed)}.includes(s)?s:${JSON.stringify(i18n.defaultLanguage)};d.dataset.locale=l;d.lang=${JSON.stringify(htmlLang)}[l]}`;

export default function GlobalNotFound() {
  return (
    <html lang={htmlLang[i18n.defaultLanguage]} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a constant built above, no input */}
        <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
        <LandingTheme>
          <header className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-8">
            <Logo />
          </header>
          <main className="not-found mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-16 px-4 py-32 sm:px-8">
            {i18n.languages.map((locale) => (
              <NotFoundText key={locale} locale={locale} />
            ))}
          </main>
        </LandingTheme>
      </body>
    </html>
  );
}

function NotFoundText({ locale }: { locale: Locale }) {
  const { title, body, back, manual } = getCopy(locale).notFound;
  return (
    <section lang={htmlLang[locale]} data-locale={locale}>
      <p className="font-mono text-sm text-(--aqua-ink)">404</p>
      <h1 className="mt-4 text-[2.4rem] leading-[1.15] font-semibold tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-4 text-(--text-2)">{body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={localePath(locale, "/")} className="btn btn-dark">
          <ArrowLeft className="size-4" />
          {back}
        </a>
        <a href={localePath(locale, "/docs")} className="btn btn-soft">
          {manual}
        </a>
      </div>
    </section>
  );
}
