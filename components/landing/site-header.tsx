import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";
import { column } from "./section";

export function SiteHeader({
  copy,
  locale,
}: {
  copy: Copy["nav"];
  locale: string;
}) {
  const home = localePath(locale, "/");
  const other = locale === "zh" ? "en" : "zh";
  const links = [
    { href: `${home}#how-it-works`, text: copy.how },
    { href: localePath(locale, "/docs"), text: copy.manual },
    { href: `${home}#plugins`, text: copy.plugins },
    { href: `${home}#roadmap`, text: copy.roadmap },
  ];
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <div className={`${column} flex h-16 items-center justify-between gap-4`}>
        <div className="flex items-center gap-12">
          <Link href={home} aria-label={copy.home} className="focus-ring">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring transition-colors hover:text-accent"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={localePath(other, "/")}
            lang={other === "zh" ? "zh-CN" : "en"}
            hrefLang={other === "zh" ? "zh-CN" : "en"}
            className="focus-ring flex h-10 items-center px-3 text-sm font-medium transition-colors hover:text-accent"
          >
            {copy.language}
          </Link>
          <a
            href={repoUrl}
            aria-label={copy.github}
            className="btn-ghost max-sm:w-10 max-sm:px-0"
          >
            <GithubIcon className="size-4" />
            <span className="max-sm:hidden">{copy.github}</span>
          </a>
          <Link href={localePath(locale, "/docs/quickstart")} className="btn">
            {copy.start}
            <ArrowRight className="size-4 max-sm:hidden" />
          </Link>
        </div>
      </div>
    </header>
  );
}
