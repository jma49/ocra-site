import { flattenTree } from "fumadocs-core/page-tree";
import type { Locale } from "@/lib/i18n";
import { source } from "@/lib/source";

// The printed head of the manual's sheet, like the listings on the landing
// page's desk: the page's source file in the main repository on the left,
// its place in the manual on the right.
export function SheetHead({ locale, path, url }: { locale: Locale; path: string; url: string }) {
  const pages = flattenTree(source.getPageTree(locale).children);
  const at = pages.findIndex((page) => page.url === url);
  return (
    <p className="docs-sheet-head" aria-hidden="true">
      <span>docs/manual/{path}</span>
      {at >= 0 ? (
        <span>
          {locale === "zh"
            ? `第 ${at + 1} 页，共 ${pages.length} 页`
            : `page ${at + 1} of ${pages.length}`}
        </span>
      ) : null}
    </p>
  );
}
