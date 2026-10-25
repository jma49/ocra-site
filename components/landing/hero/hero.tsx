import { DeskGround } from "@/components/landing/desk/ground";
import { InkUnderline, PenTick } from "@/components/landing/desk/hover-ink";
import { InkLayer } from "@/components/landing/desk/ink";
import { Card, Clip, Pen, Ruler } from "@/components/landing/desk/objects";
import { Sheet } from "@/components/landing/desk/sheet";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { cloudUrl, localePath } from "@/lib/shared";
import { ArrowGlyph, Section } from "../section";
import { heroPrint } from "./hero-page";
import { HeroPlay } from "./hero-play";

// The hero: the brand line beside the desk, where the example run's page is
// read and marked, and its one comment lands (concept C, foundation.md).
// Painted composed and finished; with motion allowed, 10-hero.css holds the
// objects in their places before play and HeroPlay plays the review: the
// lamp warms, the sheet lands, the ruler reads with the eyes on its tab, the
// pen writes, the finding card is clipped at line 42. Two printouts of the
// same page: the desk's wide one, and below 1024 px a narrow one of the last
// lines, whose card lies at the screen's scale so its type stays at 16 px.

const { finding } = exampleRun;
const wide = heroPrint(54);
const narrow = heroPrint(33, 40);
const WIDTH = 690;

export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: Locale }) {
  const d = copy.desk;
  const task = exampleRun.tasks[0].id;
  const card = { title: finding.title, quote: finding.quote, foot: d.card.foot };
  return (
    <Section id="hero" ground="desk" className="hero">
      <DeskGround reach />
      <span className="hero-top" data-top-sentinel="" aria-hidden="true" />
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1 className="hero-h">
            {copy.lines.map((line, i) => (
              <span key={line} className="hl">
                <span className="hli">
                  {line}
                  {i < copy.lines.length - 1 && locale === "en" ? " " : null}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-lede">{copy.lede}</p>
          <div className="hero-cta">
            <a className="btn btn-desk" href={cloudUrl}>
              {copy.cloud}
              <span className="cta-arrow">
                <ArrowGlyph />
                <PenTick />
              </span>
            </a>
            <a className="ink-link" href={localePath(locale, "/docs/quickstart")}>
              {copy.selfHost}
              <InkUnderline />
            </a>
          </div>
          <p className="hero-note">{copy.note}</p>
          <span data-promote-sentinel="" />
        </div>
      </div>
      <div className="hero-scene is-wide" role="img" aria-label={d.label}>
        <div className="hero-world">
          <Sheet
            className="hero-sheet"
            path={finding.path}
            meta={d.meta}
            rows={wide.rows}
            over={
              <>
                <Ruler row={wide.rulerRow} width={WIDTH + 40} />
                <InkLayer
                  id="hero"
                  className="hero-ink"
                  width={wide.inkWidth}
                  height={wide.inkHeight}
                  marks={wide.marks}
                />
              </>
            }
          >
            <Card
              className="hero-card"
              head={[`${finding.severity} · ${task}`, d.card.where]}
              {...card}
            />
            <Clip className="hero-clip" />
            <Pen className="hero-pen" rest={{ ...wide.rest, r: 42 }} />
          </Sheet>
        </div>
      </div>
      <div className="hero-scene is-narrow" role="img" aria-label={d.label}>
        <div className="hero-world">
          <Sheet
            className="hero-sheet"
            path={finding.path}
            meta={d.meta}
            rows={narrow.rows}
            over={
              <>
                <Ruler row={narrow.rulerRow} width={520} />
                <InkLayer
                  id="hero-n"
                  className="hero-ink"
                  width={narrow.inkWidth}
                  height={narrow.inkHeight}
                  marks={narrow.marks}
                />
              </>
            }
          >
            <Pen className="hero-pen" rest={{ ...narrow.noteEnd, r: 58 }} />
          </Sheet>
        </div>
        <Card className="hero-card" head={[finding.severity, d.card.where]} {...card} />
        <Clip className="hero-clip" />
      </div>
      <p className="hero-caption">
        <span className="hero-caption-ring" aria-hidden="true" />
        {d.caption}
      </p>
      <HeroPlay replay={d.replay} replayLabel={d.replayLabel} />
    </Section>
  );
}
