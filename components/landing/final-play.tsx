"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, whenSeen } from "./desk/motion/core";
import { PenRig, setDrawn, strokesOf, write } from "./desk/motion/pen";
import { typeOn } from "./desk/motion/text";

// The close, played once the desk is 60 % in view: the lamp clicks on (a
// stepped flicker, then it warms) and the sheet comes up out of the dusk;
// the fix is typed into line 42; the pen rises, ticks it and lies down; the
// install command is typed with a caret. The room light falling is a scroll
// timeline (62-final.css). Painted finished; Reduce motion keeps it so.
export function FinalPlay() {
  useEffect(() => {
    const band = document.getElementById("final");
    const desk = band?.querySelector<HTMLElement>(".final-desk");
    const sheet = band?.querySelector<HTMLElement>(".final-sheet");
    const layer = band?.querySelector<SVGSVGElement>(".final-ink");
    const rigEl = band?.querySelector<HTMLElement>(".final-pen");
    const fix = band?.querySelector<HTMLElement>(".final-fix");
    const words = [...(band?.querySelectorAll<HTMLElement>(".final-word") ?? [])];
    if (!band || !desk || !sheet || !layer || !rigEl || !fix) return;
    if (!motionAllowed()) {
      band.classList.add("lit", "played");
      return;
    }
    const [x = 0, y = 0, r = 0] = (rigEl.dataset.rest ?? "").split(" ").map(Number);
    const rest = { x, y, r, lift: 0, tilt: 0 };
    const head = band.querySelector(".final-copy");
    const offHead = head ? whenSeen(head, () => band.classList.add("head-in"), 0.3) : () => {};
    const ctl = new AbortController();
    const signal = ctl.signal;
    const off = whenSeen(
      desk,
      () =>
        void (async () => {
          const ink = strokesOf(layer, sheet, ["tick"]);
          setDrawn(ink, false);
          band.classList.add("lamp");
          await sleep(900, signal);
          band.classList.add("lit");
          await sleep(420, signal);
          await typeOn(fix, { cps: 16, signal });
          const rig = new PenRig(rigEl, rest);
          const tip = ink.runs[0]?.getPointAtLength(0);
          const at = { x: (tip?.x ?? 0) + ink.dx, y: (tip?.y ?? 0) + ink.dy };
          await rig.to(
            { x: at.x + 60, y: at.y + 70, r: -30, lift: 0.7, tilt: 1 },
            700,
            ease.settle,
            signal,
          );
          await write(rig, ink, { speed: 0.9, signal });
          await rig.to(rest, 800, ease.glide, signal);
          for (const w of words) await typeOn(w, { cps: 34, signal });
          band.classList.add("played");
        })().catch(() => {
          setDrawn(strokesOf(layer, sheet, ["tick"]), true);
          band.classList.add("lit", "played");
        }),
      0.6,
    );
    return () => {
      ctl.abort();
      off();
      offHead();
    };
  }, []);
  return null;
}
