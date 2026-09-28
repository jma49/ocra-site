import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";
import { column } from "./section";
import { Wordmark } from "./wordmark";

export function Footer({
  copy,
  nav,
  locale,
}: {
  copy: Copy["footer"];
  nav: Copy["nav"];
  locale: string;
}) {
  const home = localePath(locale, "/");
  const groups = [
    {
      title: copy.project,
      links: [
        { href: localePath(locale, "/docs"), text: nav.manual },
        { href: `${home}#how-it-works`, text: nav.how },
        { href: `${home}#roadmap`, text: nav.roadmap },
      ],
    },
    {
      title: copy.source,
      links: [
        { href: repoUrl, text: nav.github },
        { href: localePath(locale, "/docs/plugins"), text: nav.plugins },
        { href: `${repoUrl}/blob/main/LICENSE`, text: copy.license },
      ],
    },
    {
      title: copy.language,
      links: [
        { href: localePath("en", "/"), text: "English", lang: "en" },
        { href: localePath("zh", "/"), text: "中文", lang: "zh-CN" },
      ],
    },
  ];
  return (
    <footer>
      <div className={column}>
        <div className="grid gap-12 border-t border-border pt-10 pb-9 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] md:gap-10">
          <Link href={home} aria-label={nav.home} className="focus-ring w-fit">
            <LogoMark className="size-8" />
          </Link>
          <div className="grid grid-cols-3 gap-6 md:contents">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3 text-sm">
                <p className="text-fg-subtle">{group.title}</p>
                <ul className="m-0 flex list-none flex-col gap-3 p-0 font-medium">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        lang={"lang" in link ? link.lang : undefined}
                        className="focus-ring transition-colors hover:text-accent"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10 text-[0.8125rem] text-fg-subtle">
          <p>{copy.tagline}</p>
          <a
            href="#top"
            className="focus-ring flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            {copy.backToTop}
            <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
      <Wordmark label={copy.wordmark} />
    </footer>
  );
}
