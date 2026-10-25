import type { CSSProperties } from "react";
import { InkLayer, type NamedMark } from "@/components/landing/desk/ink";
import { Pen } from "@/components/landing/desk/objects";
import { CELL } from "@/components/landing/desk/sheet";
import type { Copy } from "@/lib/copy";
import { exampleRun, formatCount } from "@/lib/landing/example-run";
import { doubleUnderline, type InkStroke, underline } from "@/lib/landing/ink/marks";
import { handwrite, stroke, wobble } from "@/lib/landing/ink/stroke";

// The example run's bill, printed on one sheet on the desk: what each task
// cost, then the pen draws the sum rule, writes the total by hand and
// double-underlines it (A's ink totals the bill; no receipt). The printout
// is laid out in the sheet's px (41-features.css) so the ink, drawn here
// on the server, lands on its column at every width; phones scale the
// whole sheet.

const { calls, tasks, usage } = exampleRun;
const round4 = (n: number) => Math.round(n * 1e4) / 1e4;
const dollars = (n: number) => `$${n.toFixed(4)}`;

// The bill's rows: each review task's call, then the helper calls (grouping,
// verification, the judge) on one line, in the order the run made them.
type Line = { id: string; bundle?: string; input: number; dollars: number };
const helpers = calls.filter((c) => c.role !== "review");
const LINES: Line[] = [
  ...tasks.map((task) => {
    const call = calls.find((c) => c.id === task.id);
    if (!call) throw new Error(`bill: no call for ${task.id}`);
    return { id: task.id, bundle: task.bundle, input: call.input, dollars: call.dollars };
  }),
  {
    id: "helpers",
    input: helpers.reduce((s, c) => s + c.input, 0),
    dollars: round4(helpers.reduce((s, c) => s + c.dollars, 0)),
  },
];
// The rows add up to the run's totals, or the build stops.
if (
  LINES.reduce((s, l) => s + l.input, 0) !== usage.input ||
  round4(LINES.reduce((s, l) => s + l.dollars, 0)) !== usage.dollars
) {
  throw new Error("bill: the rows do not add up to the run's usage");
}

// The sheet, in its px: the table's rows, the cost column's right edge.
const BILL = { w: 560, h: 700, pad: 44, table: 162, th: 32, row: 37 } as const;
const tableEnd = BILL.table + BILL.th + LINES.length * BILL.row;
const costRight = BILL.w - BILL.pad;
const costLeft = costRight - 7 * CELL.ch;

// The total in the pen's hand, right-aligned under the cost column.
const H = 88;
const ruleY = tableEnd + 8;
const base = ruleY + 34 + H;
const written = (x: number) =>
  handwrite(dollars(usage.dollars), { x, y: base, h: H, seed: 9, slope: -0.035 });
const right = Math.max(...written(0).flatMap((g) => g.map((p) => p.x)));
const glyphs = written(costRight + 4 - right);
const left = Math.min(...glyphs.flatMap((g) => g.map((p) => p.x)));
const total: InkStroke[] = glyphs.map((pts, i) => ({
  ...stroke(wobble(pts, { amp: 0.5, wave: 90, seed: 20 + i }), {
    width: 6,
    land: 0.08,
    lift: 0.2,
    tail: 0.5,
    seed: 20 + i,
  }),
  speed: 1,
}));

const MARKS: NamedMark[] = [
  { name: "rule", mark: underline(costLeft - 22, costRight + 2, ruleY, { width: 2.8, seed: 5 }) },
  { name: "total", mark: { strokes: total } },
  {
    name: "double",
    mark: doubleUnderline(left - 12, costRight + 10, base + 16, { width: 4.2, gap: 9, seed: 31 }),
  },
];
const FOOT_TOP = base + 48;

export function BillSheet({ s }: { s: Copy["features"]["sheet"] }) {
  return (
    <figure className="desk-sheet feat-sheet" data-lift="" aria-labelledby="feat-cap">
      <div className="sh sh-a" />
      <div className="sh sh-c" />
      <div className="sheet-face feat-face">
        <p className="feat-top">
          <span>{s.head}</span>
          <span className="feat-tag">{s.tag}</span>
        </p>
        <p className="feat-cmd">$ {exampleRun.command}</p>
        <figcaption className="feat-cap" id="feat-cap">
          {s.caption}
        </figcaption>
        <table className="feat-table">
          <thead>
            <tr className="feat-row feat-th">
              <th scope="col">{s.cols.task}</th>
              <th scope="col">{s.cols.input}</th>
              <th scope="col">{s.cols.cost}</th>
            </tr>
          </thead>
          <tbody>
            {LINES.map((l) => (
              <tr key={l.id} className="feat-row">
                <th scope="row">
                  {l.bundle ? (
                    <>
                      {l.id} <i>· {l.bundle}</i>
                    </>
                  ) : (
                    s.helpers
                  )}
                </th>
                <td>
                  <span className="feat-fig">{formatCount(l.input)}</span>
                </td>
                <td>
                  <span className="feat-fig">{dollars(l.dollars)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sr-only">
          {s.total}: {dollars(usage.dollars)}
        </p>
        <div className="feat-foot" style={{ "--top": `${FOOT_TOP}px` } as CSSProperties}>
          {s.foot.map((line) => (
            <span key={line} className="feat-ty">
              {line}
            </span>
          ))}
          <span className="feat-note">{s.note}</span>
        </div>
        <div className="feat-sheen" />
      </div>
      <InkLayer id="bill" className="feat-ink" width={BILL.w} height={BILL.h} marks={MARKS} />
      <Pen className="feat-pen" rest={{ x: BILL.w - 34, y: BILL.h - 128, r: 34 }} />
    </figure>
  );
}
