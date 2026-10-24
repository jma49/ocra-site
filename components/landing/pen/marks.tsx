import type { CSSProperties, ReactNode } from "react";
import { arrow, type Point, penMs, ringEm, strokePx, TICK, textStroke } from "@/lib/landing/pen";

// The pen's marks on anything that is not a line of code (code: CodeMark).
// Every mark is server-rendered, aria-hidden and drawn in its finished
// state; `at` (ms) is when it draws on its root's clock, used only where the
// root plays (data-pen="clock" or "on", 04-pen.css). Marks appear only on
// recorded material or the security gate's real lists (DESIGN.md, The pen).

const clock = (at: number, dur: number) =>
  ({ "--t": `${at}ms`, "--d": `${dur}ms` }) as CSSProperties;

// A word of proportional text: 420 ms, or 560 ms from 10 characters.
const wordMs = (text: ReactNode) => (typeof text === "string" && text.length >= 10 ? 560 : 420);

// A hand stroke on a target that never wraps (a struck display word, the
// verdict, the bill's total, a chip, a claim title from 600 px): the text in
// an inline-block host and an SVG stroke stretched to its width. A double
// underline is two strokes, the second 120 ms after the first.
export function Marked({
  kind,
  at,
  dur,
  children,
}: {
  kind: "under" | "double" | "strike";
  at: number;
  dur?: number;
  children: ReactNode;
}) {
  const strokes = textStroke(kind);
  const ms = dur ?? (kind === "double" ? 380 : wordMs(children));
  return (
    <span className="mk-host">
      {children}
      {strokes.map((d, i) => (
        <svg
          key={d}
          className={`mk mk-${kind} mk-wipe mk-text${i ? " mk-text-2" : ""}`}
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          style={clock(at + i * 120, ms)}
          aria-hidden="true"
        >
          <path d={d} />
        </svg>
      ))}
    </span>
  );
}

// The wrap-safe band, for prose of 16 px or less that may wrap (today: the
// struck claim titles below 600 px). `lines` is the server's explicit split;
// each line draws after the one before it. A CSS band, not a hand stroke.
export function Band({
  kind,
  lines,
  at,
}: {
  kind: "strike" | "under";
  lines: readonly string[];
  at: number;
}) {
  let t = at;
  return (
    <span className="pw-host">
      {lines.map((line, i) => {
        const ms = wordMs(line);
        const style = clock(t, ms);
        t += ms;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed split of static text
          <span key={i}>
            {i > 0 && " "}
            <span className={`pw pw-${kind}`} style={style}>
              {line}
            </span>
          </span>
        );
      })}
    </span>
  );
}

// The pen's words ("seconds", "milliseconds", `* 1000`), centred on a column
// of the code (`col`, in ch, may be fractional) below or above the line.
// Lives in a code overlay, never inside <code>; revealed by a clip wipe.
export function Note({
  col,
  at,
  place,
  mono,
  children,
}: {
  col: number;
  at: number;
  place: "below" | "above";
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`pen-note ${place}${mono ? " pen-note-mono" : ""}`}
      style={{ "--col": col, "--t": `${at}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

// "Read / verified / allowed": a 16 × 14 px tick, drawn by dash. Carry a word
// next to it ("read", "confirmed", "task").
export function Tick({ at }: { at: number }) {
  return (
    <svg
      className="mk mk-tick mk-dash"
      viewBox="0 0 16 14"
      width="16"
      height="14"
      style={clock(at, penMs(TICK.len))}
      aria-hidden="true"
    >
      <path d={TICK.d} pathLength={1} />
    </svg>
  );
}

// The margin bar of the anchored line: grows from the parked reader's
// centre, in the rail of a code row (CodeRows puts it there for `anchor`).
export function Bar({ at }: { at: number }) {
  return <span className="pen-bar" style={clock(at, 180)} aria-hidden="true" />;
}

// A ring round a display figure (story 3's `L42`). `w` and `h` are the
// figure's box in em (its measured width, its line height), so the ring is
// drawn to scale; set `--sw` on the host for 1.7 px at its size.
export function Ringed({
  at,
  w,
  h,
  className,
  children,
}: {
  at: number;
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}) {
  const ring = ringEm(w, h);
  const { x, y, w: vw, h: vh } = ring.view;
  const style = {
    left: `${x / 100}em`,
    top: `${y / 100}em`,
    width: `${vw / 100}em`,
    height: `${vh / 100}em`,
    ...clock(at, penMs(strokePx(ring))),
  } as CSSProperties;
  return (
    <span className={className ? `mk-host ${className}` : "mk-host"}>
      {children}
      <svg
        className="mk mk-ring mk-dash"
        viewBox={`${x} ${y} ${vw} ${vh}`}
        style={style}
        aria-hidden="true"
      >
        <path d={ring.d} pathLength={1} />
      </svg>
    </span>
  );
}

// "Goes to": an arrow between two points of a positioned container, in em of
// its font (`from` and `to`, top-left origin). Set `--fs` (the container's
// font size in px) on the container so the stroke is 1.5 px.
export function Arrow({
  from,
  to,
  dir,
  at,
}: {
  from: Point;
  to: Point;
  dir?: "down" | "up" | "right";
  at: number;
}) {
  const stroke = arrow(from, to, dir);
  const { x, y, w, h } = stroke.view;
  const style = {
    left: `${x / 100}em`,
    top: `${y / 100}em`,
    width: `${w / 100}em`,
    height: `${h / 100}em`,
    ...clock(at, penMs(strokePx(stroke))),
  } as CSSProperties;
  return (
    <svg
      className="mk mk-arrow mk-dash"
      viewBox={`${x} ${y} ${w} ${h}`}
      style={style}
      aria-hidden="true"
    >
      <path d={stroke.d} pathLength={1} />
    </svg>
  );
}

const KEYS = {
  under: "M2 7.5Q11 10 20 6.8",
  caret: "M6.5 11L11 2.5L15.5 11",
  bar: "M11 1V11",
  tick: "M4.5 6.5L9 10.5L17.5 1.5",
} as const;

// A legend glyph (22 × 12 px), static: the hero caption's key, the
// lifecycle's anatomy. Not a mark: it never plays.
export function KeyGlyph({ kind }: { kind: keyof typeof KEYS }) {
  return (
    <svg
      className={`key-glyph key-${kind}`}
      viewBox="0 0 22 12"
      width="22"
      height="12"
      aria-hidden="true"
    >
      <path d={KEYS[kind]} />
    </svg>
  );
}
