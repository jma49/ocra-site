import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath } from "@/lib/shared";
import { ArrowGlyph, Lines, Section } from "../section";
import { PenKey, ProductWindow } from "./product-window";

// The hero (sections.md §2): the brand line across the container, one line
// from 1024 px, then the lede, the two ways in and the note beside the
// product window, which shows ocra doing what the line says. The empty
// sentinel after the note tells the nav when to promote its CTA. From
// 1200 px the column's foot carries the key to the pen's marks and what
// the example is, beside the desk and in the first screen; the desk's
// caption, which says the same below 1200 px, stays the one screen readers
// get, so this copy is hidden from them.
export function Hero({
  copy,
  window: win,
  locale,
}: {
  copy: Copy["hero"];
  window: Copy["window"];
  locale: Locale;
}) {
  return (
    <Section id="hero" ground="paper" className="hero">
      <div className="wrap">
        <div className="hero-head">
          <h1 className="t-display">
            <Lines lines={copy.lines} inline={1024} />
          </h1>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="t-lede">{copy.lede}</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={cloudUrl}>
                {copy.cloud}
                <ArrowGlyph />
              </a>
              <a className="btn btn-quiet" href={localePath(locale, "/docs/quickstart")}>
                {copy.selfHost}
              </a>
            </div>
            <p className="hero-note t-small">{copy.note}</p>
            <span data-promote-sentinel="" />
            <div className="hero-key t-small" aria-hidden="true">
              <PenKey keys={win.pr.key} className="hero-key-marks" />
              <p className="hero-key-what">{win.example}</p>
            </div>
          </div>
          <ProductWindow copy={win} />
        </div>
      </div>
    </Section>
  );
}
