import type { CSSProperties } from "react";
import {
  box,
  caret,
  codeMs,
  double,
  penMs,
  ring,
  type Stroke,
  span,
  strike,
  strokePx,
  under,
} from "@/lib/landing/pen";

type CodeMarkKind = "under" | "double" | "strike" | "ring" | "caret" | "box";

// Underlines and strikes draw by a left-to-right wipe; the rest by dash.
const WIPED: ReadonlySet<CodeMarkKind> = new Set(["under", "double", "strike"]);

// Where a caret goes: just after the token, in the middle of the space that
// follows it if there is one (between `session.expiresAt` and `<`).
function caretCol(text: string, col: number, n: number): number {
  return col + n + (text[col + n] === " " ? 0.5 : 0);
}

function strokeFor(kind: CodeMarkKind, text: string, col: number, n: number): Stroke {
  switch (kind) {
    case "under":
      return under(col, n);
    case "double":
      return double(col, n);
    case "strike":
      return strike(col, n);
    case "ring":
      return ring(col, n);
    case "box":
      return box(col, n);
    case "caret":
      return caret(caretCol(text, col, n));
  }
}

const em = (u: number) => `${Math.round(u * 10) / 1000}em`;

// One pen mark on a token of a line of code, drawn by the server: an
// `svg.mk.mk-<kind>` placed in ch and em, so it scales with the code at
// every size. `text` is the whole line as it is rendered (from
// recordedLine(), or the Maple text it sits on); the token's nth occurrence
// is found in it, and a missing token fails the build. `at` is when it
// draws, in ms on its root's clock (motion.md); its duration follows its
// length.
//
// It goes in a positioned overlay that is a sibling of the text, set in the
// code face at line-height 1.75 (CodeRows' `.ln-ink`, or InkCode), never
// inside the <code> itself. aria-hidden: every mark has a text equivalent
// nearby.
export function CodeMark({
  kind,
  text,
  token,
  nth,
  at,
}: {
  kind: CodeMarkKind;
  text: string;
  token: string;
  nth?: number;
  at: number;
}) {
  const { col, n } = span(text, token, nth);
  const stroke = strokeFor(kind, text, col, n);
  const { x, y, w, h } = stroke.view;
  // Columns in ch, everything else in em: a fallback face whose ch is not
  // 0.6 em still lines up.
  const from = kind === "caret" ? caretCol(text, col, n) : col;
  const cols = kind === "caret" ? 0 : n;
  const wiped = WIPED.has(kind);
  const style = {
    left: `calc(${from}ch + ${em(x - from * 60)})`,
    top: em(y),
    width: `calc(${cols}ch + ${em(w - cols * 60)})`,
    height: em(h),
    "--t": `${at}ms`,
    "--d": `${wiped ? codeMs(n) : penMs(strokePx(stroke))}ms`,
  } as CSSProperties;
  return (
    <svg
      className={`mk mk-${kind} ${wiped ? "mk-wipe" : "mk-dash"}`}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="none"
      style={style}
      aria-hidden="true"
    >
      <path d={stroke.d} pathLength={1} />
    </svg>
  );
}
