// The pen's geometry: one hand, computed at build time, never measured in
// the browser. Coordinates are in u = 0.01 em of the host font.
//
// On a code row (Maple Mono at line-height 1.75): 1 ch = 60 u, the row box
// is 175 u tall, the font's content area runs from 21.5 to 153.5 u, the
// baseline sits at 123.5 u and the x-height middle at 96 u. A stroke's x is
// absolute in the row (col × 60 u); components place its box with `ch` for
// the columns and `em` for the rest, so it follows the text in any face.
//
// The hand (bend, sag, end lift, overshoot) is ported from the "Marks"
// prototype, whose strokes were drawn in px on 13.5 px code: PX converts.

export type Point = { x: number; y: number };
export type Stroke = {
  d: string;
  len: number;
  view: { x: number; y: number; w: number; h: number };
};

const PX = 100 / 13.5;
const CH = 60;
const TOP = 21.5;
const BOTTOM = 153.5;
const XMID = 96;
const UNDER = BOTTOM + 1.5 * PX;
// Room around a stroke's path for its width and round caps.
const MARGIN = 2.2 * PX;

const r1 = (n: number) => Math.round(n * 10) / 10;

// A path and its sampled length and bounds.
class Path {
  private parts: string[] = [];
  private at: Point = { x: 0, y: 0 };
  private pts: Point[] = [];
  len = 0;

  move(p: Point) {
    this.parts.push(`M${r1(p.x)} ${r1(p.y)}`);
    this.at = p;
    this.pts.push(p);
    return this;
  }

  line(p: Point) {
    this.parts.push(`L${r1(p.x)} ${r1(p.y)}`);
    this.walk((t) => ({
      x: this.at.x + (p.x - this.at.x) * t,
      y: this.at.y + (p.y - this.at.y) * t,
    }));
    return this;
  }

  quad(c: Point, p: Point) {
    const a = this.at;
    this.parts.push(`Q${r1(c.x)} ${r1(c.y)} ${r1(p.x)} ${r1(p.y)}`);
    this.walk((t) => {
      const s = 1 - t;
      return {
        x: s * s * a.x + 2 * s * t * c.x + t * t * p.x,
        y: s * s * a.y + 2 * s * t * c.y + t * t * p.y,
      };
    });
    return this;
  }

  cubic(c1: Point, c2: Point, p: Point) {
    const a = this.at;
    this.parts.push(`C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p.x)} ${r1(p.y)}`);
    this.walk((t) => {
      const s = 1 - t;
      const k = [s * s * s, 3 * s * s * t, 3 * s * t * t, t * t * t] as const;
      return {
        x: k[0] * a.x + k[1] * c1.x + k[2] * c2.x + k[3] * p.x,
        y: k[0] * a.y + k[1] * c1.y + k[2] * c2.y + k[3] * p.y,
      };
    });
    return this;
  }

  private walk(f: (t: number) => Point) {
    let prev = this.at;
    for (let i = 1; i <= 16; i++) {
      const p = f(i / 16);
      this.len += Math.hypot(p.x - prev.x, p.y - prev.y);
      this.pts.push(p);
      prev = p;
    }
    this.at = prev;
  }

  stroke(margin = MARGIN): Stroke {
    const xs = this.pts.map((p) => p.x);
    const ys = this.pts.map((p) => p.y);
    const x = Math.min(...xs) - margin;
    const y = Math.min(...ys) - margin;
    return {
      d: this.parts.join(""),
      len: r1(this.len),
      view: {
        x: r1(x),
        y: r1(y),
        w: r1(Math.max(...xs) + margin - x),
        h: r1(Math.max(...ys) + margin - y),
      },
    };
  }
}

// Where `token` sits in a recorded line: its column and length. The nth
// occurrence (1-based); a missing token throws, failing the build.
export function span(text: string, token: string, nth = 1): { col: number; n: number } {
  let col = -1;
  for (let i = 0; i < nth; i++) {
    col = text.indexOf(token, col + 1);
    if (col < 0) throw new Error(`pen: "${token}" (${nth}) is not in "${text}"`);
  }
  return { col, n: token.length };
}

// Under the token, 1 px past each end, sagging at the middle and lifting at
// the end (marks.js:56–59).
export function under(col: number, n: number): Stroke {
  const x0 = col * CH - PX;
  const x1 = (col + n) * CH + PX;
  return new Path()
    .move({ x: x0, y: UNDER })
    .quad({ x: (x0 + x1) / 2, y: UNDER + 2.4 * PX }, { x: x1, y: UNDER - 0.4 * PX })
    .stroke();
}

// Two strokes, the second 4.5 px lower and shorter at the start (:60–62).
export function double(col: number, n: number): Stroke {
  const x0 = col * CH - 2 * PX;
  const x1 = (col + n) * CH + 2 * PX;
  const mid = (x0 + x1) / 2;
  return new Path()
    .move({ x: x0, y: UNDER })
    .quad({ x: mid, y: UNDER + 1.2 * PX }, { x: x1, y: UNDER - 0.3 * PX })
    .move({ x: x0 + 4 * PX, y: UNDER + 4.5 * PX })
    .quad({ x: mid, y: UNDER + 5.6 * PX }, { x: x1 - PX, y: UNDER + 4.2 * PX })
    .stroke();
}

// Through the x-height middle, 5 px past each end, rising then settling
// (:63–66).
export function strike(col: number, n: number): Stroke {
  const x0 = col * CH - 5 * PX;
  const x1 = (col + n) * CH + 5 * PX;
  return new Path()
    .move({ x: x0, y: XMID + 1.2 * PX })
    .quad({ x: (x0 + x1) / 2, y: XMID - 1.4 * PX }, { x: x1, y: XMID - 0.6 * PX })
    .stroke();
}

// A 64-point ellipse that overshoots its start and tightens as it goes,
// slightly tilted, quadratic-smoothed (:21–30, :43–55).
function ellipse(cx: number, cy: number, rx: number, ry: number): Stroke {
  const tilt = -0.04;
  const pts: Point[] = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const a = -2.45 + t * (Math.PI * 2 + 0.5);
    const k = 1.035 - 0.07 * t;
    const ex = rx * k * Math.cos(a);
    const ey = ry * k * Math.sin(a);
    pts.push({
      x: cx + ex * Math.cos(tilt) - ey * Math.sin(tilt),
      y: cy + ex * Math.sin(tilt) + ey * Math.cos(tilt),
    });
  }
  const first = pts[0] as Point;
  const last = pts[pts.length - 1] as Point;
  const path = new Path().move(first);
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i] as Point;
    const next = pts[i + 1] as Point;
    path.quad(p, { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 });
  }
  return path.line(last).stroke();
}

// Round the token, on code.
export function ring(col: number, n: number): Stroke {
  const h = BOTTOM - TOP;
  const pad = Math.max(8 * PX, h * 0.42);
  return ellipse(
    (col + n / 2) * CH,
    (TOP + BOTTOM) / 2 + 0.5 * PX,
    (n * CH) / 2 + pad,
    h / 2 + Math.max(4 * PX, Math.min(pad, h * 0.34)),
  );
}

// Round a fixed em box at the origin (w × h em), for a display figure.
export function ringEm(w: number, h: number): Stroke {
  return ellipse((w * 100) / 2, (h * 100) / 2, (w * 100) / 2 + h * 30, (h * 100) / 2 + h * 20);
}

// "Insert here": a ^ with its apex just under the baseline at `col`, feet
// 5.5 px to each side and 9 px lower (:68–71).
export function caret(col: number): Stroke {
  const x = col * CH;
  const y = BOTTOM - 2 * PX;
  return new Path()
    .move({ x: x - 5.5 * PX, y: y + 7.5 * PX })
    .line({ x, y: y - 1.5 * PX })
    .line({ x: x + 5.5 * PX, y: y + 7.5 * PX })
    .stroke();
}

// A rounded box round the token that starts past its corner and overlaps
// its start (:77–81).
export function box(col: number, n: number): Stroke {
  const r = 7 * PX;
  const x0 = col * CH - 12 * PX;
  const x1 = (col + n) * CH + 12 * PX;
  const y0 = TOP - 8 * PX;
  const y1 = BOTTOM + 8 * PX;
  return new Path()
    .move({ x: x0 + r + 6 * PX, y: y0 + 0.6 * PX })
    .line({ x: x1 - r, y: y0 })
    .quad({ x: x1, y: y0 }, { x: x1, y: y0 + r })
    .line({ x: x1, y: y1 - r })
    .quad({ x: x1, y: y1 }, { x: x1 - r, y: y1 })
    .line({ x: x0 + r, y: y1 })
    .quad({ x: x0, y: y1 }, { x: x0, y: y1 - r })
    .line({ x: x0, y: y0 + r })
    .quad({ x: x0, y: y0 }, { x: x0 + r, y: y0 - 0.2 * PX })
    .line({ x: x0 + r + 22 * PX, y: y0 - 1.2 * PX })
    .stroke();
}

// "Goes to": a cubic from A to B with an 8 px head at ±0.5 rad from the end
// tangent (:85–110). A and B in em of the container; `dir` picks the bend:
// down and round (a quote to its line), up (a claim merged into an earlier
// one), or out to the right and back.
export function arrow(from: Point, to: Point, dir: "down" | "up" | "right" = "down"): Stroke {
  const a = { x: from.x * 100, y: from.y * 100 };
  const b = { x: to.x * 100, y: to.y * 100 };
  const e = 100 / 13.5;
  const [c1, c2] =
    dir === "up"
      ? [
          { x: a.x - 4 * e, y: a.y - 34 * e },
          { x: b.x + 10 * e, y: b.y + 40 * e },
        ]
      : dir === "right"
        ? [
            { x: Math.max(a.x, b.x) + 34 * e, y: a.y },
            { x: Math.max(a.x, b.x) + 34 * e, y: b.y },
          ]
        : [
            { x: a.x - 6 * e, y: a.y + 36 * e },
            { x: b.x + 44 * e, y: b.y - 34 * e },
          ];
  const angle = Math.atan2(b.y - c2.y, b.x - c2.x);
  const head = 8 * e;
  return new Path()
    .move(a)
    .cubic(c1, c2, b)
    .move({ x: b.x - head * Math.cos(angle - 0.5), y: b.y - head * Math.sin(angle - 0.5) })
    .line(b)
    .line({ x: b.x - head * Math.cos(angle + 0.5), y: b.y - head * Math.sin(angle + 0.5) })
    .stroke();
}

// Strokes on proportional text: paths in a 1000 × 24 strip that the host's
// width stretches (non-scaling stroke), its height 0.24 em centred on the
// line it marks (04-pen.css places the strip from Archivo's metrics).
export function textStroke(kind: "under" | "double" | "strike"): string[] {
  switch (kind) {
    case "under":
      return ["M0 11Q500 15.8 1000 10.6"];
    case "double":
      return ["M0 9.5Q500 12.2 1000 9", "M14 15.5Q500 18 994 15.2"];
    case "strike":
      return ["M0 13.6Q520 7.4 1000 11.2"];
  }
}

// A tick, fixed 16 × 14 px.
export const TICK: Stroke = {
  ...new Path().move({ x: 1.5, y: 7.5 }).line({ x: 6, y: 12 }).line({ x: 14.5, y: 1.5 }).stroke(0),
  view: { x: 0, y: 0, w: 16, h: 14 },
};

// One pen at one speed: 0.62 px per ms, between 170 and 720 ms.
export function penMs(lengthPx: number): number {
  return Math.min(720, Math.max(170, Math.round(lengthPx / 0.62)));
}

// A stroke along `chars` characters of 13.5 px code (8.1 px each).
export function codeMs(chars: number): number {
  return penMs(chars * 8.1);
}

// A stroke's length in px at the reference code size.
export const strokePx = (stroke: Stroke) => stroke.len / PX;
