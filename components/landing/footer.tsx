import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Copy } from "@/lib/copy";
import { localePath, repoUrl } from "@/lib/shared";

export function Footer({
  copy,
  locale,
}: {
  copy: Copy["footer"];
  locale: string;
}) {
  return (
    <footer className="groove">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 text-sm text-[var(--aqua-dim)] sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <Logo />
          <span>{copy.tagline}</span>
        </div>
        <nav className="flex gap-6">
          <Link
            href={localePath(locale, "/docs")}
            className="hover:text-[var(--aqua-ink)]"
          >
            {copy.manual}
          </Link>
          <a href={repoUrl} className="hover:text-[var(--aqua-ink)]">
            {copy.github}
          </a>
          <a
            href={`${repoUrl}/blob/main/LICENSE`}
            className="hover:text-[var(--aqua-ink)]"
          >
            {copy.license}
          </a>
        </nav>
      </div>
    </footer>
  );
}
