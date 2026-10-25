import { DeskGround } from "@/components/landing/desk/ground";
import { InkUnderline, PenTick } from "@/components/landing/desk/hover-ink";
import { InkLayer } from "@/components/landing/desk/ink";
import { Card, Clip, Pen, Ruler } from "@/components/landing/desk/objects";
import { CELL, locate, printRows, Sheet } from "@/components/landing/desk/sheet";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { caret, marginNote, ringAround, underline } from "@/lib/landing/ink/marks";
import { isAdded, recordedLine } from "@/lib/landing/recorded";
import { cloudUrl, localePath } from "@/lib/shared";
import { ArrowGlyph, Section } from "../section";
import { HeroPlay } from "./hero-play";

// The hero: the brand line beside the desk, where the example run's page is
// read and marked, and its one comment lands (concept C, foundation.md).
// Painted composed and finished; with motion allowed, 10-hero.css holds the
// objects in their places before play and HeroPlay plays the review: the
// lamp warms, the sheet lands, the ruler reads with the eyes on its tab, the
// pen writes, the finding card is clipped at line 42.

const { finding, heroPage } = exampleRun;
const COLS = 54;

const rows = printRows(
  Array.from({ length: heroPage.to - heroPage.from + 1 }, (_, i) => {
    const n = heroPage.from + i;
    return { n, text: recordedLine(finding.path, n), added: isAdded(finding.path, n) };
  }),
  COLS,
);

// Line 42's operands and where the fix goes, in the code's px.
const [opA, opB] = heroPage.marked.map((t) => locate(rows, finding.line, t));
const row42 = opA?.row ?? 0;
const base = row42 * CELL.row + 19;
const x = (col: number) => col * CELL.ch;
const lineEnd = x((rows[row42]?.text.length ?? 0) + 2.4);
const marks =
  opA && opB
    ? [
        { name: "units", mark: underline(x(opA.col), x(opA.col + opA.len), base + 1, { seed: 3 }) },
        {
          name: "now",
          mark: ringAround(x(opB.col) - 1, row42 * CELL.row + 4, x(opB.len) + 2, 19, { seed: 7 }),
        },
        { name: "caret", mark: caret(x(opA.col + opA.len) + 4.8, base + 2.5, { size: 8 }) },
        { name: "fix", mark: marginNote("* 1000", lineEnd + 4, base + 1, { h: 17 }) },
      ]
    : [];

// Where things lie, in the sheet's px (the code starts at CODE).
const CODE = { x: 44 + 5 * CELL.ch, y: 78 };
const WIDTH = 690;
const RULER_ROW = row42 + 1;

export function Hero({ copy, locale }: { copy: Copy["hero"]; locale: Locale }) {
  const d = copy.desk;
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
      <div className="hero-scene" role="img" aria-label={d.label}>
        <div className="hero-world">
          <Sheet
            className="hero-sheet"
            path={finding.path}
            meta={d.meta}
            rows={rows}
            over={
              <>
                <Ruler row={RULER_ROW} width={WIDTH + 40} />
                <InkLayer
                  id="hero"
                  className="hero-ink"
                  width={x(COLS) + 120}
                  height={rows.length * CELL.row + 20}
                  marks={marks}
                />
              </>
            }
          >
            <Card
              className="hero-card"
              head={[`${finding.severity} · ${exampleRun.tasks[0].id}`, d.card.where]}
              title={finding.title}
              quote={finding.quote}
              foot={d.card.foot}
            />
            <Clip className="hero-clip" />
            <Pen
              className="hero-pen"
              rest={{
                x: CODE.x + x(opB ? opB.col + opB.len : 0) + 8,
                y: CODE.y + base + 12,
                r: 60,
              }}
              narrow={{ x: CODE.x + lineEnd - 10, y: CODE.y + base + 34, r: 68 }}
            />
          </Sheet>
        </div>
      </div>
      <p className="hero-caption">
        <span className="hero-caption-ring" aria-hidden="true" />
        {d.caption}
      </p>
      <HeroPlay replay={d.replay} replayLabel={d.replayLabel} />
    </Section>
  );
}
