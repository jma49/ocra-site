import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";
import { FrogStage } from "./frog-stage";
import { Terminal } from "./terminal";

export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute top-0 left-1/2 h-[520px] w-[620px] -translate-x-1/2 opacity-60"
      />
      <div className="relative -mb-6 pt-6 md:-mb-16 md:pt-8">
        <FrogStage />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-24 sm:px-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="min-w-0">
          <h1
            className={cn(
              "whitespace-pre-line text-balance font-semibold",
              locale === "zh"
                ? "text-display-zh-sm sm:text-display-zh"
                : "text-display-sm sm:text-display",
            )}
          >
            {copy.title}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lead text-fg-muted">
            {copy.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={localePath(locale, "/docs/quickstart")} className="btn">
              {copy.start}
              <ArrowRight className="size-4" />
            </Link>
            <a href={repoUrl} className="btn-outline">
              <GithubIcon className="size-4" />
              {copy.github}
            </a>
          </div>
          <p className="mt-5 text-xs text-fg-subtle">{copy.note}</p>
        </div>
        <Terminal label={locale === "zh" ? "示例输出" : "example output"} />
      </div>
    </div>
  );
}
