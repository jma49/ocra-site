import { CELL, locate, printRows } from "@/components/landing/desk/sheet";
import { exampleRun } from "@/lib/landing/example-run";
import { caret, marginNote, ringAround, underline } from "@/lib/landing/ink/marks";
import { isAdded, recordedLine } from "@/lib/landing/recorded";

// The hero's printed page of the example run, laid out for a printout of
// `cols` columns from line `from`: the rows, the pen's four marks on line
// 42, where the ruler stops and where the pen lies down. The desk prints
// the whole page wide; the phone prints a narrow page of the last lines,
// so its code and its card stay large (line 42 wraps the way a printer
// wraps it, and the marks follow the operands onto their rows).

const { finding, heroPage } = exampleRun;
const x = (col: number) => col * CELL.ch;

// Where the printed code starts in the sheet's px (the sheet's margin and
// its line-number gutter, 07-desk-objects.css).
const CODE = { x: 44 + 5 * CELL.ch, y: 78 };

export function heroPrint(cols: number, from: number = heroPage.from) {
  const rows = printRows(
    Array.from({ length: heroPage.to - from + 1 }, (_, i) => {
      const n = from + i;
      return { n, text: recordedLine(finding.path, n), added: isAdded(finding.path, n) };
    }),
    cols,
  );
  const [a, b] = heroPage.marked.map((t) => locate(rows, finding.line, t));
  if (!a || !b) throw new Error("hero: line 42 does not print its operands");
  const base = (row: number) => row * CELL.row + 19;
  const end = x((rows[b.row]?.text.length ?? 0) + 2.4) + 4;
  const marks = [
    { name: "units", mark: underline(x(a.col), x(a.col + a.len), base(a.row) + 1, { seed: 3 }) },
    {
      name: "now",
      mark: ringAround(x(b.col) - 1, b.row * CELL.row + 4, x(b.len) + 2, 19, { seed: 7 }),
    },
    { name: "caret", mark: caret(x(a.col + a.len) + 4.8, base(a.row) + 2.5, { size: 8 }) },
    { name: "fix", mark: marginNote("* 1000", end, base(b.row) + 1, { h: 17 }) },
  ];
  return {
    rows,
    marks,
    // The ruler reads down to the operands' last row and rests under it.
    rulerRow: b.row + 1,
    inkWidth: x(cols) + 120,
    inkHeight: rows.length * CELL.row + 20,
    // The pen lies by the ring (wide) or past the margin note (narrow).
    rest: {
      x: CODE.x + x(b.col + b.len) + 8,
      y: CODE.y + base(b.row) + 12,
    },
    noteEnd: { x: CODE.x + end + 62, y: CODE.y + base(b.row) + 12 },
  };
}
