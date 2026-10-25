"use client";

import { useEffect } from "react";
import {
  Cancelled,
  ease,
  motionAllowed,
  sleep,
  tween,
} from "@/components/landing/desk/motion/core";
import { PenRig, type PenState } from "@/components/landing/desk/motion/pen";
import { typeOn } from "@/components/landing/desk/motion/text";
import { seenAt } from "./seen-ratio";

// Plans' choreography (motion.md, Plans): the head rises, each row's rule
// prints as it arrives and its price types on at once; when ocra Cloud's
// figure is in full view the pen comes in from the page's edge, held up,
// touches down and rings it, then is carried, lifted, to the blank paper
// beside the footnote and laid down. The ring stays on ocra Cloud. The
// server paints the final state; without motion nothing here runs.

// The pen's rest, in the px of its spot (60-plans.css places the spot).
const REST: PenState = { x: 0, y: 0, r: 4, lift: 0, tilt: 0 };

export function PlansPlay() {
  useEffect(() => {
    const sec = document.getElementById("plans");
    const head = sec?.querySelector<HTMLElement>(".pl-head");
    const spot = sec?.querySelector<HTMLElement>(".pl-pen-spot");
    const rigEl = spot?.querySelector<HTMLElement>(".pen-rig");
    const face = sec?.querySelector<HTMLElement>(".paper-band-face");
    const start = sec?.querySelector<HTMLElement>('.pl-row[data-plan="cloud"]');
    const fig = start?.querySelector<HTMLElement>(".pl-fig");
    const svg = fig?.querySelector<SVGSVGElement>(".pl-ring");
    const run = svg?.querySelector<SVGPathElement>(".ink-run");
    const group = svg?.querySelector<SVGGElement>(".ink-s");
    if (!sec || !head || !spot || !rigEl || !face || !start || !fig || !run || !group) return;
    if (!motionAllowed()) return;
    const rows = [...sec.querySelectorAll<HTMLElement>(".pl-row")];

    const ctl = new AbortController();
    const { signal } = ctl;
    const offs: (() => void)[] = [() => ctl.abort()];
    const rig = new PenRig(rigEl, REST);
    const setRing = (k: number) => {
      run.style.strokeDashoffset = String(1 - k);
    };
    const seen = (el: Element, t: number, margin?: string) =>
      new Promise<void>((res) => {
        offs.push(seenAt(el, res, t, margin));
      });
    // Gone above the screen without having been in reach.
    const passed = (el: Element) =>
      new Promise<void>((res) => {
        const io = new IntersectionObserver(([e]) => {
          if (!e || e.isIntersecting || e.boundingClientRect.bottom > 0) return;
          io.disconnect();
          res();
        });
        io.observe(el);
        offs.push(() => io.disconnect());
      });

    // A point along the ring, in the pen spot's px (the ring's layer is
    // scaled to its figure, so go through the screen).
    const at = (k: number) => {
      const L = run.getTotalLength();
      const m = run.getScreenCTM();
      const p = run.getPointAtLength(L * k);
      const q = m ? p.matrixTransform(m) : p;
      const o = spot.getBoundingClientRect();
      return { x: q.x - o.left, y: q.y - o.top };
    };

    // Each row prints as it arrives, a short beat after the row before it,
    // and its price types on straight away: four letters, well under a
    // second, so nobody meets half a word.
    let slot = 0;
    const beats = rows.map(async (row) => {
      await seen(row, 0.2);
      const now = performance.now();
      const go = Math.max(now, slot);
      slot = go + 140;
      await sleep(go - now, signal);
      row.classList.add("is-in");
      await sleep(80, signal);
      const word = row.querySelector<HTMLElement>(".pl-word");
      if (word) await typeOn(word, { cps: 24, signal });
    });

    const play = async () => {
      const live = await Promise.race([
        Promise.all([beats[rows.indexOf(start)], seen(fig, 0.95, "0px 0px -8% 0px")]).then(
          () => true,
        ),
        passed(fig).then(() => false),
      ]);
      if (live) {
        await sleep(60, signal);
        // In from beyond the page's right edge, held up.
        const o = spot.getBoundingClientRect();
        const edge = face.getBoundingClientRect().right - o.left;
        const first = at(0);
        rig.set({ x: edge + 80, y: first.y + 200, r: 42, lift: 1, tilt: 1 });
        sec.classList.add("pen-on");
        const d = Math.hypot(first.x - rig.s.x, first.y - rig.s.y);
        await rig.to(
          { ...first, r: 38, lift: 0.3, tilt: 1 },
          Math.min(460, 180 + d * 0.3),
          ease.glide,
          signal,
        );
        await rig.to({ lift: 0 }, 70, ease.settle, signal);
        group.classList.remove("dry");
        await tween(
          860,
          (k) => {
            rig.set(at(k));
            setRing(k);
          },
          ease.pen,
          signal,
        );
        setRing(1);
        group.classList.add("dry", "wet");
        // Carried clear of the ledger, then laid down on blank paper.
        await rig.to({ lift: 0.55, tilt: 0.4 }, 140, ease.settle, signal);
        await rig.to({ x: REST.x, y: REST.y, r: REST.r, tilt: 0 }, 640, ease.glide, signal);
        await rig.to({ lift: 0 }, 180, ease.settle, signal);
      } else {
        // Scrolled past before it could be watched: the ring is simply there.
        setRing(1);
        group.classList.add("dry");
        rig.set(REST);
        sec.classList.add("pen-on");
      }
      sec.classList.add("played");
    };

    // Before play the ring is undrawn and the pen is off the page.
    setRing(0);
    offs.push(seenAt(head, () => head.classList.add("in"), 0.15));
    void Promise.all([play(), ...beats]).catch((e) => {
      if (!(e instanceof Cancelled)) throw e;
    });
    return () => {
      for (const off of offs) off();
    };
  }, []);
  return null;
}
