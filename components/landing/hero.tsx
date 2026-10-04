import type { Copy } from "@/lib/copy";
import { cloudUrl, localePath } from "@/lib/shared";
import { HangingSpider } from "./hanging-spider";
import { Night } from "./night";
import { PlatedHeading } from "./plated-heading";
import { ProductWindow } from "./product-window";

export function Hero({ copy, locale }: { copy: Copy; locale: string }) {
  const h = copy.hero;
  return (
    <section className="hero" id="hero">
      <Night variant="hero" />
      <div className="flash" aria-hidden="true" />
      <div className="wrap">
        <div className="hero-copy">
          <PlatedHeading as="h1" title={h.title} emphasis={h.emphasis} />
          <p className="lede">{h.lede}</p>
          <div className="cta">
            <a className="btn btn-dark" href={cloudUrl}>
              {h.cloud} <i>&rarr;</i>
            </a>
            <a
              className="btn btn-soft"
              href={localePath(locale, "/docs/quickstart")}
            >
              {h.selfHost}
            </a>
          </div>
          <div className="note">{h.note}</div>
        </div>
        <div className="stage-anchor">
          <HangingSpider up={h.poke.up} down={h.poke.down} />
          <ProductWindow copy={copy.window} />
        </div>
      </div>
    </section>
  );
}
