import type { CSSProperties, ReactNode } from "react";
import { DeskGround } from "@/components/landing/desk/ground";
import { InkLayer } from "@/components/landing/desk/ink";
import { Card, Clip, Pen, Ruler } from "@/components/landing/desk/objects";
import { CELL, locate, printRows, Sheet } from "@/components/landing/desk/sheet";
import type { Copy } from "@/lib/copy";
import type { ChapterId } from "@/lib/copy/sections/how";
import { exampleRun } from "@/lib/landing/example-run";
import {
  caret,
  doubleUnderline,
  marginNote,
  ringAround,
  strike,
  underline,
} from "@/lib/landing/ink/marks";
import { isAdded, recordedLine, recordedLines } from "@/lib/landing/recorded";
import { Section, withCode } from "../section";
import {
  BILL,
  CARDS,
  CODE,
  COLS,
  FIRST_LINE,
  type Layout,
  type ObjectId,
  pens,
  posed,
  poses,
  rowsOf,
  SESSION_H,
  SHEET_W,
  STACK_H,
  shots,
  TIMING,
  totalBox,
} from "./scene";
import { HowStory } from "./story";

// How it works: the example run replayed on one desk, in five chapters, one
// per scrubber stop (5 files · 4 tasks · line 42 · 1 reported · $0.5134).
// The server paints the last chapter, finished. With motion the stage is
// pinned under the head and the island (story.tsx) plays each chapter as
// scroll reaches it, scrubs the scrubber and the camera's push into the
// paper that Quiet by design is printed on; without it (30-how.css) the
// chapters are listed beside the finished desk.

const CHAPTERS: readonly ChapterId[] = ["select", "bundle", "review", "verify", "comment"];
const { finding, files, claims, tasks, skipped, diff, bundles } = exampleRun;
const path = (id: string) => files.find((f) => f.id === id)?.path ?? id;

const rows = printRows(
  Array.from({ length: finding.line + 2 - FIRST_LINE }, (_, i) => {
    const n = FIRST_LINE + i;
    return { n, text: recordedLine(finding.path, n), added: isAdded(finding.path, n) };
  }),
  COLS,
);
const firstLines = (p: string, k: number) =>
  printRows(
    recordedLines(p)
      .slice(0, k)
      .map((text, i) => ({ n: i + 1, text })),
    COLS,
  );

// The pen's marks on line 42 and under the bill, in the code's px (Sheet
// `over`); the delete on the lock file's head, in its sheet's px.
const x = (col: number) => col * CELL.ch;
const [opA, opB] = exampleRun.heroPage.marked.map((t) => locate(rows, finding.line, t));
const row42 = rowsOf(rows, finding.line).first;
const base = row42 * CELL.row + 19;
const lineEnd = x((rows[row42]?.text.length ?? 0) + 2.4);
const total = `$${exampleRun.usage.dollars.toFixed(4)}`;
const tb = totalBox(total);
const l42Marks =
  opA && opB
    ? [
        {
          name: "units",
          mark: underline(x(opA.col), x(opA.col + opA.len), base + 1, { seed: 13 }),
        },
        {
          name: "now",
          mark: ringAround(x(opB.col) - 1, row42 * CELL.row + 4, x(opB.len) + 2, 19, { seed: 17 }),
        },
        { name: "caret", mark: caret(x(opA.col + opA.len) + 4.8, base + 2.5, { size: 8 }) },
        { name: "fix", mark: marginNote("* 1000", lineEnd + 4, base + 1, { h: 17 }) },
      ]
    : [];
const billMarks = [
  {
    name: "bill",
    mark: doubleUnderline(tb.x - 8 - CODE.x, tb.x + tb.w + 6 - CODE.x, tb.y + tb.h - CODE.y, {
      seed: 19,
    }),
  },
];
const lockPath = path("lock");
const lockMarks = [
  { name: "dele", mark: strike(44, 44 + x(lockPath.length), 37, { width: 2.8, seed: 5 }) },
];
// A card's title struck through, in the card's px (19 px Maple, -0.01 em).
const titleStrike = (title: string, seed: number) => [
  { name: "x", mark: strike(22, 22 + title.length * 11.27, 75, { width: 2.6, seed }) },
];

const layout = (l: Layout) => ({
  poses: poses(l, rows).poses,
  shots: shots(l, rows),
  pens: pens(l),
  timing: TIMING[l],
});
const plan = { wide: layout("wide"), narrow: layout("narrow") };
export type Plan = typeof plan;
const rulerFrom = rowsOf(rows, FIRST_LINE).last;

// Every object lies in a holder posed in world px (scene.ts); the server
// paints the last chapter's poses, and marks what has left the desk by then
// (the still story never draws it).
function Obj({
  id,
  className,
  children,
}: {
  id: ObjectId;
  className: string;
  children: ReactNode;
}) {
  const p = plan.wide.poses[5][id];
  return (
    <div
      className={`how-obj ${className}`}
      data-obj={id}
      data-gone={p.o === 0 || undefined}
      style={posed(p)}
    >
      {children}
    </div>
  );
}

function Stages({ stages }: { stages: Copy["how"]["chapters"][ChapterId]["stages"] }) {
  return (
    <p className="how-stages">
      {stages.map((s) => (
        <code key={s.name} data-kind={s.kind}>
          {s.name}
        </code>
      ))}
    </p>
  );
}

// A claim's card: its number and task, its severity, the title (with the
// Chinese gloss), the quote where the run recorded one, and the outcome the
// verifier and the judge gave it, typed on in chapter 4. The two that do
// not hold carry the pen's strike through their title.
function ClaimCard({ copy, i }: { copy: Copy["how"]; i: number }) {
  const c = claims[i];
  const id = CARDS[i];
  if (!c || !id) return null;
  const gloss = copy.claimGloss[c.id];
  const struck = c.outcome === "remembered" || c.outcome === "disproved";
  return (
    <Obj id={id} className="how-o-card">
      <Card
        className="how-card"
        head={[`#${i + 1} · ${c.task}`, c.severity]}
        title={
          <>
            <span className="how-title">{c.title}</span>
            {gloss ? <span className="how-gloss">{gloss}</span> : null}
          </>
        }
        quote={c.id === "expired" ? finding.quote : undefined}
        foot={<span className="how-out">{`→ ${copy.desk.outcomes[c.outcome]}`}</span>}
      >
        {struck ? (
          <InkLayer
            id={`how-${id}`}
            className="how-ink-card"
            width={520}
            height={178}
            marks={titleStrike(c.title, 23 + i)}
          />
        ) : null}
      </Card>
    </Obj>
  );
}

const sheetSize = (h: number) => ({ "--w": `${SHEET_W}px`, "--h": `${h}px` }) as CSSProperties;

export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const d = copy.desk;
  // The review matrix of the example: auth code's three tasks beside docs'
  // one, and the reviewers that skip docs.
  const auth = tasks.filter((t) => t.bundle === bundles[0].label);
  const docsTask = tasks.find((t) => t.bundle === bundles[1].label)?.id ?? "";
  const row = (r: number) => (
    <>
      <span>{auth[r]?.id}</span>
      <span>{r === 0 ? docsTask : skipped[r - 1] ? d.skip : ""}</span>
    </>
  );
  const rest = plan.wide.pens.rest;
  return (
    <Section id="how" ground="desk" className="how" labelledBy="how-title">
      <DeskGround />
      <div className="how-pin">
        <header className="wrap how-head">
          <p className="t-kicker how-kicker">{copy.label}</p>
          <h2 className="t-h2 how-h" id="how-title">
            {copy.lines.map((line, i) => (
              <span key={line} className="how-hl">
                <span className="how-hli">
                  {line}
                  {i < copy.lines.length - 1 && /[a-z.]$/i.test(line) ? " " : null}
                </span>
              </span>
            ))}
          </h2>
          <p className="how-body">{copy.body}</p>
        </header>
        <div className="how-stage" data-ch="5">
          <div className="how-scene" aria-hidden="true">
            <div className="how-world">
              <span className="how-origin" />
              <span className="how-unit" />
              {(["lock", "docs", "login", "token"] as const).map((id) => (
                <Obj key={id} id={id} className="how-o-sheet">
                  <Sheet
                    className="how-sheet"
                    path={path(id)}
                    rows={id === "lock" ? [] : firstLines(path(id), 14)}
                    style={sheetSize(STACK_H)}
                  >
                    {id === "lock" ? (
                      <>
                        <InkLayer
                          id="how-lock"
                          className="how-ink-lock"
                          width={260}
                          height={60}
                          marks={lockMarks}
                        />
                        <p className="how-reason">
                          <span className="how-tl">{d.setAside}</span>
                        </p>
                      </>
                    ) : null}
                  </Sheet>
                </Obj>
              ))}
              <Obj id="session" className="how-o-sheet how-o-session">
                <Sheet
                  className="how-sheet how-session"
                  path={finding.path}
                  meta={`+${diff.additions} −${diff.deletions} · ${d.page}`}
                  rows={rows}
                  style={sheetSize(SESSION_H)}
                  over={
                    <>
                      <Ruler row={rulerFrom} width={SHEET_W + 60} className="how-ruler" />
                      <InkLayer
                        id="how-l42"
                        className="how-ink-l42"
                        width={x(COLS) + 120}
                        height={rows.length * CELL.row + 20}
                        marks={l42Marks}
                      />
                      <InkLayer
                        id="how-bill"
                        className="how-ink-bill"
                        width={SHEET_W}
                        height={BILL.y + 220}
                        marks={billMarks}
                      />
                    </>
                  }
                >
                  <div className="how-bill" style={{ left: BILL.x, top: BILL.y }}>
                    <p className="how-bill-foot">
                      <span className="how-tl">{d.calls}</span>
                      <span className="how-tl">{d.tokens}</span>
                      <span className="how-tl">{d.output}</span>
                    </p>
                    <p className="how-bill-label">{d.total}</p>
                  </div>
                  <p className="how-total" style={{ left: tb.x, top: tb.y, width: tb.w }}>
                    {total}
                  </p>
                </Sheet>
              </Obj>
              <Obj id="task" className="how-o-task">
                <Card
                  className="how-task"
                  head={[d.bundle, d.docs]}
                  title={row(0)}
                  quote={row(1)}
                  foot={row(2)}
                />
              </Obj>
              <Obj id="bite" className="how-o-clip">
                <Clip />
              </Obj>
              {claims.map((c, i) => (
                <ClaimCard key={c.id} copy={copy} i={i} />
              ))}
              <Obj id="pin" className="how-o-clip">
                <Clip />
              </Obj>
              <Pen className="how-pen" rest={rest} />
            </div>
          </div>
          <div className="wrap how-side">
            <div className="how-copy">
              <div className="how-chapters">
                {CHAPTERS.map((id, i) => {
                  const ch = copy.chapters[id];
                  return (
                    <article
                      key={id}
                      className={i === 4 ? "how-ch is-on" : "how-ch"}
                      data-ch={i + 1}
                    >
                      <Stages stages={ch.stages} />
                      <h3 className="how-h3">{ch.title}</h3>
                      <p className="how-text">{withCode(ch.text)}</p>
                    </article>
                  );
                })}
              </div>
              <p className="how-legend">
                <span>
                  <i data-kind="code" aria-hidden="true" />
                  {copy.legend.code}
                </span>
                <span>
                  <i data-kind="model" aria-hidden="true" />
                  {copy.legend.model}
                </span>
              </p>
              <div className="how-scrub" aria-hidden="true">
                <div className="how-ticks">
                  <div className="how-ticks-lit" />
                </div>
                <ol className="how-stops">
                  {CHAPTERS.map((id) => {
                    const stop = copy.stops[id];
                    return (
                      <li key={id} className="is-on">
                        {stop.before ? `${stop.before} ` : null}
                        <b>{stop.n}</b>
                        {stop.after ? ` ${stop.after}` : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
          <p className="how-run">
            <span className="how-run-dot" aria-hidden="true" />
            {copy.note.label} · <code>{copy.note.run}</code>
          </p>
          <div className="how-paper" aria-hidden="true" />
        </div>
        <div className="how-way" aria-hidden="true" />
      </div>
      <div className="sr-only">
        {copy.summary.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <HowStory plan={plan} />
    </Section>
  );
}
