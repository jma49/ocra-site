import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";
import { Terminal } from "./terminal";

export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: string }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-8 md:pt-24 lg:grid-cols-[1fr_1.1fr]">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm text-[var(--aqua-dim)]">
          <span className="gel-dot size-2.5" />
          {copy.status}
        </p>
        <h1
          className={cn(
            "mt-6 whitespace-pre-line text-balance font-bold leading-[1.1] tracking-[-0.03em]",
            locale === "zh"
              ? "text-[2.1rem] sm:text-[3rem]"
              : "text-[2.4rem] sm:text-[3.4rem]",
          )}
        >
          {copy.title}
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-[1.05rem] leading-relaxed text-[var(--aqua-dim)]">
          {copy.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={localePath(locale, "/docs/quickstart")} className="gel">
            {copy.start}
            <ArrowRight className="size-4" />
          </Link>
          <a href={repoUrl} className="gel-plain">
            <GithubIcon className="size-4" />
            {copy.github}
          </a>
        </div>
        <p className="mt-5 text-xs text-[var(--aqua-dim)]">{copy.note}</p>
      </div>
      <Terminal label={locale === "zh" ? "示例输出" : "example output"} />
    </div>
  );
}
