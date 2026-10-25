"use client";

import { useEffect } from "react";
import {
  ease,
  lerp,
  motionAllowed,
  sleep,
  tween,
  whenSeen,
} from "@/components/landing/desk/motion/core";
import { type InkStrokes, PenRig, strokesOf } from "@/components/landing/desk/motion/pen";
import { countUp } from "@/components/landing/desk/motion/text";

// The bill's choreography (motion.md: Ink, Typed things, Pointer). Once the
// sheet starts coming into view: the headline rises, the list follows, and
// the printout prints, its rows one by one with their figures counting up
// and the token footnote under them, inside a second; then the pen comes
// in lifted, draws the sum rule, writes the total by hand in the blank
// under the cost column, double-underlines it and lies down off the text,
// where the total stays (on a phone, whose narrow sheet has no room for
// it, the pen leaves the frame instead). Hovering the lead item lifts the
// sheet it describes. The server paints all of it finished (Reduce motion).

// The sum in one movement of the hand: every stroke drawn in order with the
// tip on it and a short lifted hop to the next, all on one clock of `ms`,
// so the total lands on time however slow the frames are (write() spends
// a few frames between strokes; ten strokes of handwriting add them up).
async function scrawl(rig: PenRig, ink: InkStrokes, ms: number, signal: AbortSignal) {
  const { runs, groups } = ink;
  if (!runs.length) return;
  const len = runs.map((r) => r.getTotalLength());
  const at = (i: number, k: number) => {
    const p = (runs[i] as SVGPathElement).getPointAtLength((len[i] ?? 0) * k);
    return { x: p.x + ink.dx, y: p.y + ink.dy };
  };
  const first = at(0, 0);
  const d = Math.hypot(first.x - rig.s.x, first.y - rig.s.y);
  await rig.to({ ...first, lift: 0.3 }, Math.min(320, 80 + d * 0.5), ease.glide, signal);
  await rig.to({ lift: 0 }, 40, ease.settle, signal);
  type Part = { i: number; hop: boolean; w: number };
  const parts: Part[] = [];
  ink.ms.forEach((t, i) => {
    if (i) {
      const a = at(i - 1, 1);
      const b = at(i, 0);
      parts.push({ i, hop: true, w: 30 + Math.hypot(b.x - a.x, b.y - a.y) * 0.3 });
    }
    parts.push({ i, hop: false, w: t });
  });
  const sum = parts.reduce((n, p) => n + p.w, 0);
  const dry = (i: number) => {
    const run = runs[i];
    if (!run || groups[i]?.classList.contains("dry")) return;
    run.style.strokeDashoffset = "0";
    groups[i]?.classList.add("dry");
  };
  await tween(
    ms,
    (k) => {
      let x = k * sum;
      for (const [j, p] of parts.entries()) {
        if (x >= p.w && j < parts.length - 1) {
          x -= p.w;
          if (!p.hop) dry(p.i);
          continue;
        }
        const u = Math.min(1, x / p.w);
        if (p.hop) {
          const a = at(p.i - 1, 1);
          const b = at(p.i, 0);
          rig.set({
            x: lerp(a.x, b.x, u),
            y: lerp(a.y, b.y, u),
            lift: 0.24 * Math.sin(Math.PI * u),
          });
        } else {
          const v = ease.pen(u);
          rig.set({ ...at(p.i, v), lift: 0 });
          (runs[p.i] as SVGPathElement).style.strokeDashoffset = `${1 - v}`;
        }
        return;
      }
    },
    ease.linear,
    signal,
  );
  runs.forEach((_, i) => {
    dry(i);
  });
  await rig.to({ lift: 0.45 }, 100, ease.settle, signal);
}

export function FeaturesPlay() {
  useEffect(() => {
    const sec = document.getElementById("features");
    if (!sec || !motionAllowed()) return;
    const ctl = new AbortController();
    const { signal } = ctl;
    const quiet = () => {};
    const offs: (() => void)[] = [];
    const head = sec.querySelector<HTMLElement>(".feat-h");
    const list = sec.querySelector<HTMLElement>(".feat-list");
    const scene = sec.querySelector<HTMLElement>(".feat-scene");
    const sheet = sec.querySelector<HTMLElement>(".feat-sheet");
    const over = sec.querySelector<HTMLElement>(".feat-over");
    const layer = sec.querySelector<SVGSVGElement>(".feat-ink");
    const rigEl = sec.querySelector<HTMLElement>(".feat-pen");
    const foot = sec.querySelector<HTMLElement>(".feat-foot");
    const lead = sec.querySelector<HTMLElement>(".feat-lead");
    if (!head || !list || !scene || !sheet || !over || !layer || !rigEl || !foot) return;

    offs.push(whenSeen(head, () => head.classList.add("in"), 0.5));
    offs.push(whenSeen(list, () => list.classList.add("in"), 0.3));

    const play = async () => {
      sec.classList.add("live");
      const rows = [...sheet.querySelectorAll<HTMLElement>(".feat-row:not(.feat-th)")];
      const printed = (async () => {
        for (const row of rows) {
          row.classList.add("on");
          for (const fig of row.querySelectorAll<HTMLElement>(".feat-fig"))
            void countUp(fig, { ms: 420, signal }).catch(quiet);
          await sleep(70, signal);
        }
        foot.classList.add("on");
      })();
      // The pen is on its way while the rows print, and totals them after.
      await sleep(120, signal);
      const [rx = 0, ry = 0, rr = 0] = (rigEl.dataset.rest ?? "").split(" ").map(Number);
      const rest = { x: rx, y: ry, r: rr, lift: 0, tilt: 0 };
      const rig = new PenRig(rigEl, { x: rx + 300, y: ry + 340, r: 50, lift: 1, tilt: 1 });
      sec.classList.add("pen-in");
      const sum = strokesOf(layer, over, ["rule", "total", "double"]);
      const start = sum.runs[0]?.getPointAtLength(0);
      if (start) {
        const to = { x: start.x + sum.dx, y: start.y + sum.dy - 30, lift: 0.5, r: rr + 4 };
        await rig.to(to, 380, ease.glide, signal);
      }
      await printed;
      await scrawl(rig, sum, 1700, signal);
      if (matchMedia("(max-width: 759px)").matches) {
        await rig.to({ x: rx + 260, y: ry + 120, lift: 0.6 }, 560, ease.glide, signal);
        sec.classList.remove("pen-in");
      } else {
        await rig.to({ ...rest, lift: 0.4, tilt: 0.4 }, 520, ease.glide, signal);
        await rig.to({ lift: 0, tilt: 0 }, 220, ease.settle, signal);
      }
      sec.classList.add("done");
    };
    offs.push(whenSeen(scene, () => void play().catch(quiet), 0.25));

    // The lead item describes the sheet: pointing at it lifts the sheet.
    if (lead && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const on = () => sheet.classList.add("lifted", "pointed");
      const off = () => {
        sheet.classList.remove("pointed");
        if (!sheet.matches(":hover")) sheet.classList.remove("lifted");
      };
      lead.addEventListener("pointerenter", on);
      lead.addEventListener("pointerleave", off);
      offs.push(() => {
        lead.removeEventListener("pointerenter", on);
        lead.removeEventListener("pointerleave", off);
      });
    }

    return () => {
      ctl.abort();
      for (const off of offs) off();
    };
  }, []);

  return null;
}
