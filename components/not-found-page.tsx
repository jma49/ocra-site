"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { Providers } from "@/components/providers";
import type { Copy } from "@/lib/copy";
import { i18n, isLocale, type Locale } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";
import { localePath } from "@/lib/shared";

type Text = Copy["notFound"] & {
  docs: string;
  ui: ComponentProps<typeof Providers>["i18n"];
};

// The language comes from the URL on the client; the header and the home
// link follow it.
export function NotFoundPage({ text }: { text: Record<Locale, Text> }) {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang && isLocale(params.lang) ? params.lang : i18n.defaultLanguage;
  const t = text[lang];
  return (
    <Providers i18n={t.ui}>
      <HomeLayout {...baseOptions(lang, { docs: t.docs })} className="home home-layout">
        <title>{`404 · ${t.title} · ocra`}</title>
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-32 sm:px-8">
          <p className="font-mono text-sm text-(--aqua-ink)">404</p>
          <h1 className="mt-4 text-[2.4rem] leading-[1.15] font-semibold tracking-[-0.03em]">
            {t.title}
          </h1>
          <p className="mt-4 text-(--text-2)">{t.body}</p>
          <div className="mt-8">
            <Link href={localePath(lang, "/")} className="btn btn-dark">
              <ArrowLeft className="size-4" />
              {t.back}
            </Link>
          </div>
        </div>
      </HomeLayout>
    </Providers>
  );
}
