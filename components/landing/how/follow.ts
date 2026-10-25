import { ease, sleep, tween } from "@/components/landing/desk/motion/core";
import type { PenRig } from "@/components/landing/desk/motion/pen";

// The pen's tip riding ink strokes that lie under a transform: the story's
// camera scales its world, the Quiet poster's marks scale with its type.
// motion/pen.ts's `write` maps a stroke through offsetLeft/offsetTop, which
// ignores transforms, so this maps each point through the screen instead
// (the rendered `.ink-shine` path carries the same centreline as the mask's
// `.ink-run`); the rhythm is the same: travel lifted, touch down, draw with
// the tip on the line, lift at the end.

type Stroke = { run: SVGPathElement; shine: SVGPathElement; group: SVGGElement; ms: number };
type ToLocal = (x: number, y: number) => { x: number; y: number };

// The named marks' strokes of an ink layer, in drawing order.
export function inkStrokes(layer: Element, names: readonly string[]): Stroke[] {
  const out: Stroke[] = [];
  for (const name of names) {
    for (const group of layer.querySelectorAll<SVGGElement>(`.ink-m[data-mark="${name}"] .ink-s`)) {
      const run = group.querySelector<SVGPathElement>(".ink-run");
      const shine = group.querySelector<SVGPathElement>(".ink-shine");
      if (!run || !shine) continue;
      const ms = Number.parseFloat(group.style.getPropertyValue("--t")) || 200;
      out.push({ run, shine, group, ms });
    }
  }
  return out;
}

// Undrawn (before a chapter plays) or drawn at once (its settled state).
export function drawn(strokes: readonly Stroke[], on: boolean) {
  for (const s of strokes) {
    s.run.style.strokeDashoffset = on ? "0" : "1";
    s.group.classList.toggle("dry", on);
  }
}

// A point `k` (0 to 1) along a stroke, in the rig's frame.
export function pointOn(s: Stroke, k: number, toLocal: ToLocal) {
  const p = s.shine.getPointAtLength(s.shine.getTotalLength() * k);
  const m = s.shine.getScreenCTM();
  const q = m ? new DOMPoint(p.x, p.y).matrixTransform(m) : p;
  return toLocal(q.x, q.y);
}

export async function writeMapped(
  pen: PenRig,
  strokes: readonly Stroke[],
  toLocal: ToLocal,
  { speed = 1, signal }: { speed?: number; signal?: AbortSignal } = {},
) {
  for (const s of strokes) {
    const start = pointOn(s, 0, toLocal);
    const d = Math.hypot(start.x - pen.s.x, start.y - pen.s.y);
    if (d > 16) {
      await pen.to(
        { ...start, lift: 0.38 },
        Math.min(260, 80 + d * 0.6) * speed,
        ease.glide,
        signal,
      );
      await pen.to({ lift: 0 }, 50 * speed, ease.settle, signal);
    } else if (d > 0.5) {
      await pen.to({ ...start, lift: 0.1 }, (30 + d * 3) * speed, ease.glide, signal);
      pen.set({ lift: 0 });
    }
    await tween(
      s.ms * speed,
      (k) => {
        pen.set(pointOn(s, k, toLocal));
        s.run.style.strokeDashoffset = `${1 - k}`;
      },
      ease.pen,
      signal,
    );
    s.run.style.strokeDashoffset = "0";
    s.group.classList.add("dry");
  }
  await pen.to({ lift: 0.45 }, 110 * speed, ease.settle, signal);
  await sleep(0, signal);
}
