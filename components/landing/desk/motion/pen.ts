import { ease, lerp, sleep, tween } from "./core";

// The pen at work: a rig (Pen, objects.tsx) moved through --pen-x, --pen-y, --pr
// (deg), --lift (its shadow separates as it rises, rejoins on touchdown) and
// --tilt (held to write), and an ink layer's strokes (InkLayer) drawn as its
// tip travels each one. Everything is in the px of the element the rig and
// the layer both lie on (a sheet).

export type PenState = { x: number; y: number; r: number; lift: number; tilt: number };

export class PenRig {
  readonly el: HTMLElement;
  s: PenState;

  constructor(el: HTMLElement, s: PenState) {
    this.el = el;
    this.s = { ...s };
    this.render();
  }

  render() {
    const { x, y, r, lift, tilt } = this.s;
    const st = this.el.style;
    st.setProperty("--pen-x", `${x.toFixed(2)}px`);
    st.setProperty("--pen-y", `${y.toFixed(2)}px`);
    st.setProperty("--pen-r", `${r.toFixed(2)}deg`);
    st.setProperty("--lift", lift.toFixed(3));
    st.setProperty("--tilt", tilt.toFixed(3));
  }

  set(p: Partial<PenState>) {
    Object.assign(this.s, p);
    this.render();
  }

  to(p: Partial<PenState>, ms: number, e = ease.glide, signal?: AbortSignal) {
    const from = { ...this.s };
    const keys = Object.keys(p) as (keyof PenState)[];
    return tween(
      ms,
      (k) => {
        for (const key of keys) this.s[key] = lerp(from[key], p[key] ?? from[key], k);
        this.render();
      },
      e,
      signal,
    );
  }
}

// An ink layer's strokes in drawing order, with where the layer lies.
export type InkStrokes = {
  runs: SVGPathElement[];
  groups: SVGGElement[];
  ms: number[];
  dx: number;
  dy: number;
};

// The strokes of the named marks of an ink layer (`.ink-m[data-mark]`), in
// order, offset by where the layer lies within `frame` (the rig's parent).
export function strokesOf(
  layer: SVGSVGElement,
  frame: HTMLElement,
  names: readonly string[],
): InkStrokes {
  let dx = 0;
  let dy = 0;
  for (
    let el: HTMLElement | null = layer.parentElement;
    el && el !== frame;
    el = el.offsetParent as HTMLElement | null
  ) {
    dx += el.offsetLeft;
    dy += el.offsetTop;
  }
  const runs: SVGPathElement[] = [];
  const groups: SVGGElement[] = [];
  const ms: number[] = [];
  for (const name of names) {
    for (const g of layer.querySelectorAll<SVGGElement>(`.ink-m[data-mark="${name}"] .ink-s`)) {
      const run = g.querySelector<SVGPathElement>(".ink-run");
      if (!run) continue;
      runs.push(run);
      groups.push(g);
      ms.push(Number.parseFloat(g.style.getPropertyValue("--t")) || 200);
    }
  }
  return { runs, groups, ms, dx, dy };
}

// Undraw strokes (before a replay) or draw them at once (the final state).
export function setDrawn(ink: InkStrokes, drawn: boolean) {
  for (const run of ink.runs) run.style.strokeDashoffset = drawn ? "0" : "1";
  for (const g of ink.groups) g.classList.toggle("dry", drawn);
}

// Write the strokes: travel lifted to each start, touch down, draw with the
// tip on the line (the pen's velocity curve), lift at the end. `speed`
// scales every stroke's time.
export async function write(
  pen: PenRig,
  ink: InkStrokes,
  { speed = 1, signal }: { speed?: number; signal?: AbortSignal } = {},
) {
  for (let i = 0; i < ink.runs.length; i++) {
    const run = ink.runs[i] as SVGPathElement;
    const group = ink.groups[i] as SVGGElement;
    const L = run.getTotalLength();
    const at = (k: number) => {
      const p = run.getPointAtLength(L * k);
      return { x: p.x + ink.dx, y: p.y + ink.dy };
    };
    const start = at(0);
    const d = Math.hypot(start.x - pen.s.x, start.y - pen.s.y);
    if (d > 16) {
      await pen.to(
        { ...start, lift: 0.38 },
        Math.min(240, 70 + d * 0.7) * speed,
        ease.glide,
        signal,
      );
      await pen.to({ lift: 0 }, 50 * speed, ease.settle, signal);
    } else if (d > 0.5) {
      await pen.to({ ...start, lift: 0.1 }, (30 + d * 3) * speed, ease.glide, signal);
      pen.set({ lift: 0 });
    }
    await tween(
      (ink.ms[i] ?? 200) * speed,
      (k) => {
        pen.set(at(k));
        run.style.strokeDashoffset = `${1 - k}`;
      },
      ease.pen,
      signal,
    );
    run.style.strokeDashoffset = "0";
    group.classList.add("dry");
  }
  await pen.to({ lift: 0.45 }, 110 * speed, ease.settle, signal);
  await sleep(0, signal);
}
