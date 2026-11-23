import { findNeighbour } from "fumadocs-core/page-tree";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { source } from "@/lib/source";

// The page's foot: the pages before and after it in the page tree, each
// named by its direction and its title (app/docs-prose.css, `.docs-pager`).
const LABELS: Record<Locale, { previous: string; next: string; label: string }> = {
  en: { previous: "Previous", next: "Next", label: "More pages" },
  zh: { previous: "上一页", next: "下一页", label: "更多页面" },
};

export function PageFoot({ locale, url }: { locale: Locale; url: string }) {
  const { previous, next } = findNeighbour(source.getPageTree(locale), url);
  if (!previous && !next) return null;
  const t = LABELS[locale];
  return (
    <nav className="docs-pager" aria-label={t.label}>
      {previous ? (
        <Link href={previous.url} className="docs-pager-link" data-dir="previous">
          <span className="docs-pager-dir">{t.previous}</span>
          <span className="docs-pager-title">{previous.name}</span>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.url} className="docs-pager-link" data-dir="next">
          <span className="docs-pager-dir">{t.next}</span>
          <span className="docs-pager-title">{next.name}</span>
        </Link>
      ) : null}
    </nav>
  );
}
