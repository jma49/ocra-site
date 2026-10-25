"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, whenSeen } from "./desk/motion/core";
import { PenRig } from "./desk/motion/pen";
import { drawn, inkStrokes, pointOn, writeMapped } from "./how/follow";

// Quiet's pen: once the poster is 45 % in view it comes in from the right,
// strikes each out-of-scope word with a dele loop, lifting between words,
// and lies down beside the last. The poster is painted struck; the strikes
// wait undrawn only under motion (40-quiet.css), so Reduce motion, no script
// and the 4 s fail-safe all show them finished. The pen lies beside the
// last word in every case. Where the poster comes up on the story's paper
// (`.joined`), the head rises and the pen starts once it is up (`.q-in`).
export function QuietPlay() {
  useEffect(() => {
    const band = document.getElementById("quiet");
    const poster = band?.querySelector<HTMLElement>(".quiet-poster");
    const rigEl = poster?.querySelector<HTMLElement>(".quiet-pen");
    if (!band || !poster || !rigEl) return;
    const layers = [...poster.querySelectorAll<SVGSVGElement>(".quiet-ink")];
    const strokes = layers.flatMap((l) => inkStrokes(l, ["strike"]));
    const toLocal = (x: number, y: number) => {
      const r = poster.getBoundingClientRect();
      return { x: x - r.left, y: y - r.top };
    };
    // Lying under the last word, between the poster and the hairline.
    const rest = () => {
      const r = poster.getBoundingClientRect();
      const narrow = r.width < 600;
      return {
        x: narrow ? 12 : r.width * 0.5,
        y: r.height + (narrow ? 34 : 44),
        r: -4,
        lift: 0,
        tilt: 0,
      };
    };
    const rig = new PenRig(rigEl, rest());
    band.classList.add("pen-ready");
    const head = band.querySelector(".quiet-head");
    const offs: (() => void)[] = [];
    // Run `fn` once the poster is coming up (`q-up`) or up (`q-in`); at once
    // where it is not joined.
    const whenUp = (fn: () => void, state = "q-in") => {
      const shown = () => !band.classList.contains("joined") || band.classList.contains(state);
      if (shown()) return fn();
      const mo = new MutationObserver(() => {
        if (!shown()) return;
        mo.disconnect();
        fn();
      });
      mo.observe(band, { attributes: true, attributeFilter: ["class"] });
      offs.push(() => mo.disconnect());
    };
    const offHead = head
      ? whenSeen(head, () => whenUp(() => band.classList.add("head-in"), "q-up"), 0.01)
      : () => {};
    if (!motionAllowed()) {
      band.classList.add("played");
      return offHead;
    }
    const ctl = new AbortController();
    const off = whenSeen(
      poster,
      () =>
        whenUp(() => {
          const signal = ctl.signal;
          void (async () => {
            drawn(strokes, false);
            band.classList.add("playing");
            const r = poster.getBoundingClientRect();
            const first = strokes[0] ? pointOn(strokes[0], 0, toLocal) : { x: 0, y: 0 };
            rig.set({ x: r.width + 200, y: first.y - 120, r: -36, lift: 1, tilt: 1 });
            await rig.to({ x: first.x + 90, y: first.y - 40, lift: 0.6 }, 620, ease.settle, signal);
            for (const layer of layers) {
              await writeMapped(rig, inkStrokes(layer, ["strike"]), toLocal, {
                speed: 0.6,
                signal,
              });
              await sleep(140, signal);
            }
            await rig.to(rest(), 760, ease.glide, signal);
            band.classList.replace("playing", "played");
          })().catch(() => {
            drawn(strokes, true);
            rig.set(rest());
          });
        }),
      0.45,
    );
    let width = innerWidth;
    const onResize = () => {
      if (innerWidth === width || band.classList.contains("playing")) return;
      width = innerWidth;
      rig.set(rest());
    };
    addEventListener("resize", onResize, { passive: true });
    return () => {
      ctl.abort();
      off();
      offHead();
      for (const f of offs) f();
      removeEventListener("resize", onResize);
    };
  }, []);
  return null;
}
