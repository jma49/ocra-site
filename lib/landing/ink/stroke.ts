// The red pen's hand: a stroke is a filled outline grown along a wobbly
// centreline, with a pressure profile (landing, swell, lift) and round
// felt-tip ends. The ink filter (InkDefs) adds the fibre edge, the halo and
// the darker rim. Everything is seeded, so a mark lands the same way on the
// server, on every load and in every language. Pure geometry: no DOM.

export type Pt = { x: number; y: number };

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const f1 = (n: number) => n.toFixed(1);

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noise(seed: number): (x: number) => number {
  const r = rng(seed);
  const g = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = g[i & 255] ?? 0;
    return a + ((g[(i + 1) & 255] ?? 0) - a) * u;
  };
}

// Catmull-Rom through control points, sampled every `step` px.
export function spline(ctrl: readonly Pt[], step = 1.6): Pt[] {
  const first = ctrl[0];
  const last = ctrl[ctrl.length - 1];
  if (!first || !last) return [];
  const p = [first, ...ctrl, last];
  const out: Pt[] = [];
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1] as Pt;
    const p1 = p[i] as Pt;
    const p2 = p[i + 1] as Pt;
    const p3 = p[i + 2] as Pt;
    const n = Math.max(2, Math.ceil(dist(p1, p2) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) =>
        0.5 *
        (2 * b +
          (-a + cc) * t +
          (2 * a - 5 * b + 4 * cc - d) * t2 +
          (-a + 3 * b - 3 * cc + d) * t3);
      out.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(last);
  return out;
}

// A hand's straight line: bowed a little, never ruler-straight.
export function line(a: Pt, b: Pt, { bow = 0.012, rise = 0, seed = 1 } = {}): Pt[] {
  const r = rng(seed);
  const len = dist(a, b) || 1;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  const k = len * bow * (r() > 0.5 ? 1 : -1);
  const mid = (t: number, o: number) => ({
    x: lerp(a.x, b.x, t) + nx * o,
    y: lerp(a.y, b.y, t) + ny * o,
  });
  return spline([a, mid(0.33, k * 0.9), mid(0.66, k * 0.7 - rise), { x: b.x, y: b.y - rise }]);
}

// A hand-drawn ring: an ellipse that does not close on itself, it overshoots.
export function ring({
  cx,
  cy,
  rx,
  ry,
  rot = -0.04,
  start = -2.5,
  sweep = TAU + 0.55,
  drift = 0.07,
  square = 2,
  seed = 1,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot?: number;
  start?: number;
  sweep?: number;
  drift?: number;
  square?: number;
  seed?: number;
}): Pt[] {
  const n = noise(seed);
  const pts: Pt[] = [];
  const steps = Math.ceil(((rx + ry) * sweep) / 2.4);
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const a = start + sweep * u;
    const grow = 1 + drift * (u - 0.5) + 0.025 * n(u * 5);
    const c = Math.cos(a);
    const s = Math.sin(a);
    const e = 2 / square;
    const x = Math.sign(c) * Math.abs(c) ** e * rx * grow;
    const y = Math.sign(s) * Math.abs(s) ** e * ry * grow;
    pts.push({
      x: cx + x * Math.cos(rot) - y * Math.sin(rot),
      y: cy + x * Math.sin(rot) + y * Math.cos(rot),
    });
  }
  return pts;
}

// The hand's tremor and drift, along each point's normal.
export function wobble(
  pts: readonly Pt[],
  { amp = 1.1, wave = 110, tremor = 0.22, seed = 1 } = {},
): Pt[] {
  const n1 = noise(seed * 7 + 1);
  const n2 = noise(seed * 13 + 5);
  let s = 0;
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)] as Pt;
    const b = pts[Math.min(pts.length - 1, i + 1)] as Pt;
    if (i > 0) s += dist(a, p);
    const l = dist(a, b) || 1;
    const o = amp * n1(s / wave) + tremor * n2(s / 6);
    return { x: p.x + (-(b.y - a.y) / l) * o, y: p.y + ((b.x - a.x) / l) * o };
  });
}

const K = 0.5523;

export type Nib = {
  // The nib's width at full pressure.
  width?: number;
  // The share of the length spent landing and lifting.
  land?: number;
  lift?: number;
  // The width left at the lift (0.4 a flick, 0.85 a full stop).
  tail?: number;
  // The width at the touchdown, as a share of the full width.
  start?: number;
  seed?: number;
};

// One stroke: its outline (filled, the ink) and its centreline (what the
// pen's tip travels and what reveals the ink as it draws).
export type StrokeShape = { outline: string; centre: string; length: number; width: number };

export function stroke(pts: readonly Pt[], nib: Nib = {}): StrokeShape {
  const { width = 6, land = 0.06, lift = 0.22, tail = 0.5, start = 0.78, seed = 1 } = nib;
  const n = noise(seed * 31 + 3);
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push((cum[i - 1] ?? 0) + dist(pts[i - 1] as Pt, pts[i] as Pt));
  const len = cum[cum.length - 1] || 1;
  const w = pts.map((_, i) => {
    const u = (cum[i] ?? 0) / len;
    const inP = u < land ? lerp(start, 1, Math.sin((u / land) * (Math.PI / 2))) : 1;
    const outP = u > 1 - lift ? lerp(1, tail, ((u - (1 - lift)) / lift) ** 1.6) : 1;
    const grain = 1 + 0.1 * n((cum[i] ?? 0) / 38) + 0.04 * n((cum[i] ?? 0) / 7);
    return width * inP * outP * grain;
  });
  const tan = pts.map((_, i) => {
    const a = pts[Math.max(0, i - 2)] as Pt;
    const b = pts[Math.min(pts.length - 1, i + 2)] as Pt;
    const l = dist(a, b) || 1;
    return { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
  });
  const L: Pt[] = [];
  const R: Pt[] = [];
  pts.forEach((p, i) => {
    const t = tan[i] as Pt;
    const r = (w[i] ?? 0) / 2;
    L.push({ x: p.x - t.y * r, y: p.y + t.x * r });
    R.push({ x: p.x + t.y * r, y: p.y - t.x * r });
  });
  const f = (q: Pt) => `${f1(q.x)} ${f1(q.y)}`;
  const cap = (i: number, dir: number) => {
    const p = pts[i] as Pt;
    const t = tan[i] as Pt;
    const r = (w[i] ?? 0) / 2;
    const tx = t.x * dir;
    const ty = t.y * dir;
    const a = { x: p.x - t.y * r * dir, y: p.y + t.x * r * dir };
    const F = { x: p.x + tx * r, y: p.y + ty * r };
    const b = { x: p.x + t.y * r * dir, y: p.y - t.x * r * dir };
    const nx = -t.y * dir;
    const ny = t.x * dir;
    return (
      `C${f({ x: a.x + tx * r * K, y: a.y + ty * r * K })} ${f({ x: F.x + nx * r * K, y: F.y + ny * r * K })} ${f(F)}` +
      `C${f({ x: F.x - nx * r * K, y: F.y - ny * r * K })} ${f({ x: b.x + tx * r * K, y: b.y + ty * r * K })} ${f(b)}`
    );
  };
  let outline = `M${f(L[0] as Pt)}`;
  for (let i = 1; i < L.length; i++) outline += `L${f(L[i] as Pt)}`;
  outline += cap(pts.length - 1, 1);
  for (let i = R.length - 2; i >= 0; i--) outline += `L${f(R[i] as Pt)}`;
  outline += `${cap(0, -1)}Z`;
  const centre = pts.map((p, i) => `${i ? "L" : "M"}${f(p)}`).join("");
  return { outline, centre, length: len, width: Math.max(...w) };
}

// Handwritten "* 1000" and the like: single strokes per glyph, in a box `h`
// px tall, from (x, baseline y), writing slightly uphill.
export function handwrite(
  text: string,
  {
    x,
    y,
    h,
    seed = 1,
    slope = -0.05,
  }: { x: number; y: number; h: number; seed?: number; slope?: number },
): Pt[][] {
  const r = rng(seed);
  const out: Pt[][] = [];
  let pen = x;
  const glyph = (strokes: [number, number][][], adv: number) => {
    const rot = (r() - 0.5) * 0.12;
    const dy = (r() - 0.5) * h * 0.06 + (pen - x) * slope;
    const sc = h * (0.95 + r() * 0.1);
    for (const s of strokes) {
      out.push(
        s.map(([gx, gy]) => {
          const px = gx * sc;
          const py = (gy - 1) * sc;
          return {
            x: pen + px * Math.cos(rot) - py * Math.sin(rot),
            y: y + dy + px * Math.sin(rot) + py * Math.cos(rot),
          };
        }),
      );
    }
    pen += adv * h * (0.94 + r() * 0.12);
  };
  for (const ch of text) {
    if (ch === " ") pen += h * 0.28;
    else if (ch === "*")
      glyph(
        [
          [
            [0.25, 0.02],
            [0.27, 0.3],
            [0.28, 0.56],
          ],
          [
            [0.02, 0.15],
            [0.26, 0.29],
            [0.52, 0.43],
          ],
          [
            [0.5, 0.12],
            [0.27, 0.27],
            [0.03, 0.46],
          ],
        ],
        0.62,
      );
    else if (ch === "1")
      glyph(
        [
          [
            [0.04, 0.26],
            [0.2, 0.12],
            [0.33, 0.0],
            [0.32, 0.5],
            [0.3, 1.02],
          ],
        ],
        0.5,
      );
    else if (ch === "0") {
      const pts: [number, number][] = [];
      for (let i = 0; i <= 26; i++) {
        const a = -Math.PI / 2 - 0.35 - (TAU + 0.5) * (i / 26);
        const g = 1 + 0.06 * (i / 26);
        pts.push([
          0.26 + Math.cos(a) * 0.215 * g + 0.035 * Math.sin(a + 1),
          0.5 + Math.sin(a) * 0.5 * g,
        ]);
      }
      glyph([pts], 0.66);
    }
  }
  return out.map((ctrl) => spline(ctrl, 1.2));
}
