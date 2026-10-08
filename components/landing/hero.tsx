import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath } from "@/lib/shared";
import { ProductWindow } from "./product-window";
import { Reading } from "./reading";

export function Hero({ copy, locale }: { copy: Copy; locale: Locale }) {
  const h = copy.hero;
  return (
    <section className="hero" id="hero">
      <div className="hero-night">
        <Reading title={copy.window.pr.findingTitle} />
        <div className="wrap hero-copy">
          {/* Two sentences, one line each, in every language. */}
          <h1 className="display">
            <span className="sr-only">{`${h.title} ${h.emphasis}`}</span>
            <Words text={h.title} from={0} />
            <br />
            <em>
              <Words text={h.emphasis} from={h.title.split(" ").length} />
            </em>
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

// The headline rises in word by word (09-motion.css); Chinese, without
// spaces, rises as one line. Screen readers read the hidden copy above,
// whole, instead of the pieces.
function Words({ text, from }: { text: string; from: number }) {
  const words = text.includes(" ") ? text.split(" ") : [text];
  return words.map((word, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered
    <span key={i} aria-hidden="true">
      {i > 0 && " "}
      <span className="wd" style={{ "--i": from + i } as CSSProperties}>
        {word}
      </span>
    </span>
  ));
}
