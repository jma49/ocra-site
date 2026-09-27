import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";
import { Terminal } from "./terminal";

export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: string }) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--border)]">
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[640px] opacity-70"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pt-20 pb-24 sm:px-8 md:pt-28 lg:grid-cols-[1fr_1.05fr]">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
            <span className="size-1.5 rounded-full bg-[var(--accent)]" />
            {copy.status}
          </p>
          <h1
            className={cn(
              "mt-6 whitespace-pre-line text-balance font-semibold tracking-[-0.045em]",
              locale === "zh"
                ? "text-[2.3rem]/[1.15] sm:text-[3.3rem]/[1.15]"
                : "text-[2.6rem]/[1.05] sm:text-[4rem]/[1.02]",
            )}
          >
            {copy.title}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[1.08rem] leading-relaxed text-[var(--fg-muted)]">
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
          <p className="mt-5 text-xs text-[var(--fg-subtle)]">{copy.note}</p>
        </div>
        <Terminal label={locale === "zh" ? "示例输出" : "example output"} />
      </div>
    </div>
  );
}
