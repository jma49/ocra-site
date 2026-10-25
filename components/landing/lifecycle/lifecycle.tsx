import { DeskGround } from "@/components/landing/desk/ground";
import { InkLayer } from "@/components/landing/desk/ink";
import { Card, Pen, Ruler } from "@/components/landing/desk/objects";
import { CELL, locate, type PrintedLine, printRows, Sheet } from "@/components/landing/desk/sheet";
import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { exampleRun } from "@/lib/landing/example-run";
import { caret, marginNote, ringAround, tick, underline } from "@/lib/landing/ink/marks";
import { isAdded, recordedLine, recordedLines } from "@/lib/landing/recorded";
import { Section } from "../section";
import { LifecyclePlay } from "./lifecycle-play";

// One finding, after you push (D3, concept C): two printouts of the file
// the example run's finding is on, from endSession to the end of the file.
// Push 1 carries the hero's marks on line 42; push 2 prints the fix. The
// finding's card moves from the first to the second, the pen ticks the old
// note, and the card's thread reads resolved. The pushes are an
// illustration, captioned as one. Painted finished; LifecyclePlay scrubs
// the arrival with scroll and plays the reading and the tick once.

const { finding, diff, heroPage } = exampleRun;
const COLS = 50;
const FROM = 36;
const TO = recordedLines(finding.path).length;

const lines = (fixed: boolean): PrintedLine[] =>
  Array.from({ length: TO - FROM + 1 }, (_, i) => {
    const n = FROM + i;
    const text = recordedLine(finding.path, n);
    if (!fixed) return { n, text, added: isAdded(finding.path, n) };
    if (n !== finding.line) return { n, text };
    if (!text.includes(finding.quote)) throw new Error("lifecycle: line 42 does not quote");
    return { n, text: text.replace(finding.quote, finding.suggestion), added: true };
  });
const push1 = printRows(lines(false), COLS);
const push2 = printRows(lines(true), COLS);

// The hero's marks on line 42, in the code's px, and the tick after them.
const [opA, opB] = heroPage.marked.map((t) => locate(push1, finding.line, t));
if (!opA || !opB) throw new Error("lifecycle: line 42's operands are not printed");
const row42 = opA.row;
const base = row42 * CELL.row + 19;
const x = (col: number) => col * CELL.ch;
const lineEnd = x((push1[row42]?.text.length ?? 0) + 2.4);
const NOTE_H = 17;
const marks = [
  { name: "units", mark: underline(x(opA.col), x(opA.col + opA.len), base + 1, { seed: 3 }) },
  {
    name: "now",
    mark: ringAround(x(opB.col) - 1, row42 * CELL.row + 4, x(opB.len) + 2, 19, { seed: 7 }),
  },
  { name: "caret", mark: caret(x(opA.col + opA.len) + 4.8, base + 2.5, { size: 8 }) },
  { name: "fix", mark: marginNote("* 1000", lineEnd + 4, base + 1, { h: NOTE_H }) },
  { name: "tick", mark: tick(lineEnd + 4 + NOTE_H * 3.9, base - 9, { size: 17, seed: 12 }) },
];
const fixRow = locate(push2, finding.line, finding.suggestion).row;

// The pen at rest on push 1's frame (the pen lies in a frame laid exactly
// over push 1, so it writes in that sheet's px): lying at the desk's lower
// right; below 1024 px it is put away past the frame's right edge.
const REST = { x: 300, y: 700, r: -12 };
const REST_NARROW = { x: 690, y: 470, r: -24 };

export function Lifecycle({ copy }: { copy: Copy["lifecycle"]; onLine?: string }) {
  const head = (n: number, stat: string) => `${fill(copy.push, { n })} · ${stat}`;
  return (
    <Section id="lifecycle" ground="desk" className="life" labelledBy="life-h">
      <div className="life-pin" data-state="fixed">
        <DeskGround />
        <div className="wrap life-in">
          <div className="life-copy">
            <p className="life-kicker">{copy.label}</p>
            <h2 className="t-h2 life-h" id="life-h">
              {copy.lines.map((line, i) => (
                <span key={line} className="life-hl">
                  <span className="life-hli">
                    {line}
                    {i < copy.lines.length - 1 && !/[　-鿿]$/.test(line) ? " " : null}
                  </span>
                </span>
              ))}
            </h2>
            <ol className="life-states" aria-label={copy.statesLabel}>
              {(["open", "fixed", "dismissed"] as const).map((st) => (
                <li key={st} data-st={st}>
                  <span className="life-st-name">{copy.states[st].name}</span>
                  <span className="life-st-body">{copy.states[st].body}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="life-scene" role="img" aria-label={copy.scene}>
          <div className="life-world">
            <div className="life-r1">
              <Sheet
                className="life-sheet"
                path={finding.path}
                meta={head(1, `+${diff.additions} −${diff.deletions}`)}
                rows={push1}
                over={
                  <InkLayer
                    id="life"
                    className="life-ink"
                    width={x(COLS) + 160}
                    height={push1.length * CELL.row + 20}
                    marks={marks}
                  />
                }
              />
            </div>
            <div className="life-r2">
              <Sheet
                className="life-sheet"
                path={finding.path}
                meta={head(2, "+1 −1")}
                rows={push2}
                over={<Ruler row={fixRow} width={640} />}
              />
            </div>
            <Card
              className="life-card"
              head={[`#${finding.fingerprint}`, finding.severity]}
              title={finding.title}
              quote={`${finding.path}:${finding.line}`}
              foot={
                <>
                  <span className="life-thread-k">{copy.thread.key}</span>
                  <span
                    className="life-thread-v"
                    data-open={copy.thread.open}
                    data-done={copy.thread.resolved}
                  >
                    {copy.thread.resolved}
                  </span>
                </>
              }
            />
            <div className="life-penframe">
              <Pen className="life-pen" rest={REST} narrow={REST_NARROW} />
            </div>
          </div>
        </div>
        <p className="life-cap">
          <span className="life-chip">{copy.illustration}</span>
          <span>{copy.caption}</span>
        </p>
      </div>
      <LifecyclePlay />
    </Section>
  );
}
