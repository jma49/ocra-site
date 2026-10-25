import type { CSSProperties, ReactNode } from "react";

// A printed sheet on the desk: real text in Maple Mono on laser paper, its
// tooth, its cut edges catching the light, and two shadows under one light
// (07-objects.css). Sheets are placed in a world's px by the caller
// (`style`: left, top, width, height, --r rotation); everything printed on
// them is in the sheet's own px, so marks and objects laid on it share its
// frame.

// The printed code's cell: Maple Mono's advance is 0.6034 em, so at the sheet's
// 16 px a column is 9.6 px and a row 26 px. Ink layers over code use these.
export const CELL = { size: 16, ch: 9.655, row: 26 } as const;

export type PrintedLine = { n: number; text: string; added?: boolean };
export type PrintRow = { n: number; text: string; first: boolean; added: boolean };

// Lines broken the way a printer would at `cols`: at a space, after a comma
// or a parenthesis, the rest indented four past the line's own indent.
export function printRows(lines: readonly PrintedLine[], cols: number): PrintRow[] {
  const wrap = (text: string): string[] => {
    if (text.length <= cols) return [text];
    let k = -1;
    for (let i = cols - 1; i > cols * 0.45; i--) {
      if (" ,(".includes(text[i] ?? "")) {
        k = i;
        break;
      }
    }
    if (k < 0) k = cols - 1;
    const lead = /^\s*/.exec(text)?.[0] ?? "";
    return [text.slice(0, k + 1).trimEnd(), ...wrap(`${lead}    ${text.slice(k + 1).trimStart()}`)];
  };
  return lines.flatMap((l) =>
    wrap(l.text).map((text, i) => ({ n: l.n, text, first: i === 0, added: !!l.added && i === 0 })),
  );
}

// Where a token sits on a printed row: its row index, first column, length.
export function locate(rows: readonly PrintRow[], n: number, token: string) {
  const row = rows.findIndex((r) => r.n === n && r.text.includes(token));
  if (row < 0) throw new Error(`sheet: line ${n} does not print ${token}`);
  return { row, col: rows[row]?.text.indexOf(token) ?? 0, len: token.length };
}

// The sheet's head: the file and, right, what part of it this page is.
export function Sheet({
  path,
  meta,
  rows,
  className,
  style,
  over,
  children,
}: {
  path: string;
  meta?: string;
  rows: readonly PrintRow[];
  className?: string;
  style?: CSSProperties;
  // Laid over the printed code, in its px from the first row's top-left
  // character cell (ink layers, the ruler); outside the paper's clip, so a
  // ruler can hang over its edge.
  over?: ReactNode;
  // Objects laid on the sheet, in the sheet's px (a card, the pen).
  children?: ReactNode;
}) {
  return (
    <div className={["desk-sheet", className].filter(Boolean).join(" ")} style={style} data-lift="">
      <div className="sh sh-a" />
      <div className="sh sh-c" />
      <div className="sheet-face">
        <p className="sheet-head">
          <span>{path}</span>
          {meta ? <span className="sheet-meta">{meta}</span> : null}
        </p>
        <div className="sheet-code">
          <ol className="sheet-rows">
            {rows.map((r, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: printed rows are fixed
                key={i}
                data-n={r.first ? r.n : undefined}
              >
                <span className="sheet-ln" aria-hidden={!r.first || undefined}>
                  {r.first ? r.n : ""}
                </span>
                <span className="sheet-mk" aria-hidden="true">
                  {r.added ? "+" : ""}
                </span>
                <code className={/^\s*\/\//.test(r.text) ? "sheet-tx sheet-c" : "sheet-tx"}>
                  {r.text || " "}
                </code>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="sheet-over">{over}</div>
      {children}
    </div>
  );
}
