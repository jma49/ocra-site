"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { baseOptions } from "@/lib/layout.shared";
import { localePath } from "@/lib/shared";

const text = {
  en: {
    title: "Page not found",
    body: "The page you are looking for does not exist, or it moved.",
    back: "Back to the home page",
  },
  zh: {
    title: "页面不存在",
    body: "你要找的页面不存在，或者已经移动。",
    back: "返回首页",
  },
};

// not-found receives no params, so the language comes from the URL on the
// client; the header and the home link follow it.
export function NotFoundPage() {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang === "zh" ? "zh" : "en";
  const t = text[lang];
  return (
    <HomeLayout {...baseOptions(lang)} className="home home-layout">
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
  );
}
