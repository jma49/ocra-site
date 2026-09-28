import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";

// The headline sits over a pixel field drawn as a code minimap, with one
// reviewed hunk (scripts/hero-field.mjs). On small screens the field is a
// band above the text instead of behind it.
export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: string }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="relative h-64 sm:h-96 lg:absolute lg:inset-0 lg:h-auto"
      >
        <Image
          src="/hero-field.svg"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[50%_20%] lg:object-top"
        />
      </div>
      <div className="relative mx-auto grid w-full max-w-[90rem] gap-10 px-4 pt-6 pb-20 sm:px-8 lg:min-h-[max(40rem,calc(100svh-4rem))] lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end wide:grid-cols-[minmax(0,1fr)_26.5rem] lg:gap-14 lg:pt-0 lg:pb-[4.5rem]">
        <h1
          id="hero-title"
          className={cn(
            "font-semibold",
            locale === "zh"
              ? "text-display-zh-sm sm:text-display-zh"
              : "text-display-sm sm:text-display-md lg:text-display-sm xl:text-display-md wide:text-display",
          )}
        >
          <span className="block text-balance text-fg-subtle">
            {copy.titleLead}
          </span>
          <span className="block text-balance">{copy.titleRest}</span>
        </h1>
        <div className="flex flex-col gap-6">
          <p className="text-pretty text-lead text-fg-muted">{copy.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={localePath(locale, "/docs/quickstart")}
              className="btn btn-lg grow justify-between"
            >
              {copy.start}
              <ArrowRight className="size-[18px]" />
            </Link>
            <a href={repoUrl} className="btn-outline btn-lg grow">
              <GithubIcon className="size-4" />
              {copy.github}
            </a>
          </div>
          <p className="font-mono text-xs text-fg-subtle">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}
