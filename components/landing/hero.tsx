import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, demoUrl, localePath } from "@/lib/shared";
import { CopyCommand } from "./copy-command";
import { HeroStage } from "./hero-stage";
import { Arrow, Themed } from "./parts";

// The claim, the two ways in, and the recorded run as Ocra Cloud shows it:
// the review runs, the finding lands, the fix is committed, on a 12 s loop
// over two rows of stippled shapes (10-hero.css). Under Reduce motion the
// loop shows its last state.
export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: Locale }) {
  return (
    <section id="top" className="hero" aria-labelledby="hero-h">
      <span data-top-sentinel="" aria-hidden="true" />
      <div className="wrap hero-text">
        <h1 className="hero-h" id="hero-h">
          {copy.lines.map((line) => (
            <span className="hli" key={line}>
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-lede">{copy.lede}</p>
        <div className="hero-cta">
          <a className="btn btn-ink" href={cloudUrl}>
            {copy.start}
          </a>
          <a className="btn btn-quiet" href={demoUrl}>
            {copy.demo}
            <Arrow />
          </a>
          <a className="btn btn-quiet" href={localePath(locale, "/docs/quickstart")}>
            {copy.selfHost}
            <Arrow />
          </a>
        </div>
        <div className="hero-cli">
          <span className="cmd cmd-hero">
            <span className="t3" aria-hidden="true">
              $
            </span>
            <code>{copy.cli.command}</code>
            <CopyCommand text={copy.cli.command} label={copy.cli.copy} done={copy.cli.copied} />
          </span>
        </div>
      </div>
      <HeroStage>
        <div className="hero-art hero-back" aria-hidden="true">
          <Themed name="hero-back" ext="svg" width={1376} height={560} eager />
        </div>
        <div className="hero-art hero-front" aria-hidden="true">
          <Themed name="hero-front" ext="svg" width={1376} height={560} eager />
        </div>
        <div className="deck deck-3" aria-hidden="true" />
        <div className="deck deck-2" aria-hidden="true" />
        <figure className="shot shot-hero">
          <div className="shot-bar">
            <span className="sb-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mono sb-path">{copy.bar}</span>
            <span className="sb-state" aria-hidden="true">
              <span className="sb-run">{copy.reviewing}</span>
              <span className="sb-done">{copy.reviewed}</span>
            </span>
          </div>
          <div className="demo-body">
            <Themed
              name="finding"
              ext="webp"
              width={772}
              height={377}
              alt={copy.alt}
              className="demo-img"
              eager
            />
            <span className="scan" aria-hidden="true" />
            <span className="click" aria-hidden="true" />
            <svg className="cursor" aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
              <path d="M4 2l15 10-7 1.4L9 21z" />
            </svg>
          </div>
        </figure>
        <p className="toast hero-toast" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {copy.committed}
        </p>
        <p className="chip-float cf-1" aria-hidden="true">
          {copy.chips.candidates}
        </p>
        <p className="chip-float cf-2" aria-hidden="true">
          <span className="dot dot-ok" />
          {copy.chips.verified}
        </p>
        <p className="chip-float cf-3 mono" aria-hidden="true">
          {copy.chips.calls}
        </p>
      </HeroStage>
      <p className="hero-note">{copy.note}</p>
    </section>
  );
}
