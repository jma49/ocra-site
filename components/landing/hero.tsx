import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath } from "@/lib/shared";
import { cjk } from "./heading";
import { ProductWindow } from "./product-window";
import { Silk } from "./silk";

export function Hero({ copy, locale }: { copy: Copy; locale: Locale }) {
  const h = copy.hero;
  return (
    <section className="hero" id="hero">
      <div className="hero-night">
        <Silk variant="hero" />
        <div className="wrap hero-copy">
          {/* Chinese display lines break explicitly before the emphasis (AGENTS.md). */}
          <h1 className="display">
            {h.title}
            {cjk(h.title) ? <br /> : " "}
            <em>{h.emphasis}</em>
          </h1>
          <p className="lede">{h.lede}</p>
          <div className="cta">
            <a className="btn btn-brand" href={cloudUrl}>
              {h.cloud} <i>&rarr;</i>
            </a>
            <a className="btn btn-ghost" href={localePath(locale, "/docs/quickstart")}>
              {h.selfHost}
            </a>
          </div>
          <p className="note">{h.note}</p>
        </div>
      </div>
      <div className="wrap hero-stage">
        <ProductWindow copy={copy.window} />
      </div>
    </section>
  );
}
