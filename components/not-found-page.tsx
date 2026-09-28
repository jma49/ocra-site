"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FrogStage } from "@/components/landing/frog-stage";
import { Shell } from "@/components/landing/shell";
import { cn } from "@/lib/cn";
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
// client; the header and the home link follow it. The 3D frog lives here:
// lost, but still reading.
export function NotFoundPage() {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang === "zh" ? "zh" : "en";
  const t = text[lang];
  return (
    <Shell locale={lang}>
      <title>{`404 · ${t.title} · ocra`}</title>
      <div className="mx-auto grid w-full max-w-[90rem] flex-1 items-center gap-6 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 lg:py-24">
        <div data-frog-stage className="lg:order-last">
          <FrogStage />
        </div>
        <div>
          <p className="font-mono text-sm text-accent">[404]</p>
          <h1
            className={cn(
              "mt-5 font-semibold",
              lang === "zh"
                ? "text-headline-zh-sm md:text-headline-zh"
                : "text-headline-sm md:text-headline",
            )}
          >
            {t.title}
          </h1>
          <p className="mt-5 text-lead text-fg-muted">{t.body}</p>
          <div className="mt-10">
            <Link href={localePath(lang, "/")} className="btn btn-lg">
              <ArrowLeft className="size-[18px]" />
              {t.back}
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
