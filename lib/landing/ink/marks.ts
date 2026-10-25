// The pen's vocabulary, built on the hand in stroke.ts: every mark the page
// draws is one of these, in the units of the layer it is drawn on (InkLayer
// gives that layer the host's px). A mark is one or more strokes, drawn in
// order; a stroke's `speed` scales its drawing time (1 = the pen's pace).
import {
  handwrite,
  line,
  type Nib,
  type Pt,
  ring,
  rng,
  type StrokeShape,
  spline,
  stroke,
  wobble,
} from "./stroke";

export type InkStroke = StrokeShape & { speed: number };
export type InkMark = { strokes: InkStroke[] };

const one = (s: StrokeShape, speed = 1): InkStroke => ({ ...s, speed });

// Under a run of text from x0 to x1, `y` its baseline.
export function underline(
  x0: number,
  x1: number,
  y: number,
  { width = 3.2, seed = 3 } = {},
): InkMark {
  const pts = wobble(
    line({ x: x0 - 2, y: y + 3 }, { x: x1 + 3, y: y + 1.6 }, { seed, rise: 0.6 }),
    {
      amp: 0.5,
      seed,
    },
  );
  return { strokes: [one(stroke(pts, { width, tail: 0.45, seed }))] };
}

// The bottom line of a bill: two strokes, the second shorter and quicker.
export function doubleUnderline(
  x0: number,
  x1: number,
  y: number,
  { width = 3.4, gap = 6, seed = 5 } = {},
): InkMark {
  const a = underline(x0, x1, y, { width, seed });
  const b = wobble(
    line({ x: x0 + 4, y: y + 3 + gap }, { x: x1 - 2, y: y + 2 + gap }, { seed: seed + 1 }),
    {
      amp: 0.5,
      seed: seed + 1,
    },
  );
  return {
    strokes: [...a.strokes, one(stroke(b, { width: width * 0.9, tail: 0.4, seed: seed + 1 }), 1.3)],
  };
}

// Round a box (x, y, w, h): an ellipse that overshoots where it closes.
export function ringAround(
  x: number,
  y: number,
  w: number,
  h: number,
  { width = 2.8, seed = 7 } = {},
): InkMark {
  const pts = ring({ cx: x + w / 2, cy: y + h / 2, rx: w / 2 + 7, ry: h / 2 + 5, seed });
  return {
    strokes: [
      one(
        stroke(wobble(pts, { amp: 0.6, seed }), { width, land: 0.04, lift: 0.12, tail: 0.6, seed }),
      ),
    ],
  };
}

// An insertion caret under the baseline at x.
export function caret(x: number, y: number, { size = 9, width = 2.6, seed = 9 } = {}): InkMark {
  const pts = spline([
    { x: x - size * 0.55, y: y + size * 1.05 },
    { x: x - size * 0.1, y: y + size * 0.25 },
    { x: x + 0.4, y: y + 1 },
    { x: x + size * 0.15, y: y + size * 0.3 },
    { x: x + size * 0.6, y: y + size * 1.1 },
  ]);
  return { strokes: [one(stroke(pts, { width, land: 0.1, lift: 0.3, tail: 0.5, seed }), 0.7)] };
}

// A proofreader's strike: a fat stroke through the text (x0 to x1 at the
// x-height's middle, `y`) ending in a dele loop.
export function strike(
  x0: number,
  x1: number,
  y: number,
  { width = 8, loop = true, seed = 11 } = {},
): InkMark {
  const r = rng(seed);
  const tilt = (r() - 0.5) * 0.02 * (x1 - x0);
  const body = wobble(
    line({ x: x0 - 6, y: y + 2 }, { x: x1 + 4, y: y - 2 + tilt }, { seed, bow: 0.006 }),
    {
      amp: 0.8,
      seed,
    },
  );
  const strokes = [one(stroke(body, { width, land: 0.03, lift: 0.08, tail: 0.8, seed }))];
  if (loop) {
    const s = width * 1.6;
    const ex = x1 + 4;
    const ey = y - 2 + tilt;
    const tailPts = spline([
      { x: ex - s * 0.4, y: ey },
      { x: ex + s * 1.2, y: ey - s * 1.4 },
      { x: ex + s * 2.4, y: ey - s * 0.6 },
      { x: ex + s * 1.6, y: ey + s * 0.6 },
      { x: ex + s * 0.6, y: ey - s * 0.4 },
      { x: ex + s * 2.2, y: ey + s * 1.8 },
    ]);
    strokes.push(one(stroke(tailPts, { width: width * 0.55, tail: 0.35, seed: seed + 2 }), 0.8));
  }
  return { strokes };
}

// Words in the margin ("* 1000"): from (x, baseline y), `h` px tall.
export function marginNote(
  text: string,
  x: number,
  y: number,
  { h = 16, width = 2.4, seed = 13 } = {},
): InkMark {
  return {
    strokes: handwrite(text, { x, y, h, seed }).map((pts, i) =>
      one(stroke(pts, { width, land: 0.08, lift: 0.3, tail: 0.55, seed: seed + i }), 0.55),
    ),
  };
}

// A tick: what was read or verified.
export function tick(x: number, y: number, { size = 14, width = 3, seed = 17 } = {}): InkMark {
  const pts = spline([
    { x, y: y + size * 0.45 },
    { x: x + size * 0.32, y: y + size * 0.85 },
    { x: x + size * 1.1, y: y - size * 0.2 },
  ]);
  return { strokes: [one(stroke(pts, { width, land: 0.15, lift: 0.35, tail: 0.3, seed }), 0.6)] };
}

// Any centreline, for a mark the vocabulary lacks (an arrow, a bracket).
export function freehand(ctrl: readonly Pt[], nib: Nib = {}, speed = 1): InkMark {
  return {
    strokes: [one(stroke(wobble(spline(ctrl), { amp: 0.6, seed: nib.seed ?? 1 }), nib), speed)],
  };
}

// The time a stroke takes at the pen's pace, in ms.
export const strokeMs = (s: InkStroke, pace = 0.55) => Math.max(70, (s.length / pace) * s.speed);
