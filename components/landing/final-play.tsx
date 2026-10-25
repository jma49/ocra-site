"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, whenSeen } from "./desk/motion/core";
import { PenRig, setDrawn, strokesOf, write } from "./desk/motion/pen";
import { typeOn } from "./desk/motion/text";

// The close, played once the desk is a third in view: the lamp clicks on (a
// stepped flicker, then it warms) and the sheet comes up out of the dusk;
// the fix is typed into line 42, the rest of the line moving over for it as
// in an editor; the pen rises, ticks it and lies down off the print while
// the install command is typed with a caret. Each typing is done in well
// under a second. The room light falling is a scroll timeline
// (62-final.css). Painted finished; Reduce motion keeps it so.

// Typed into the line: the text after it moves over as each character lands.
async function insert(el: HTMLElement, cps: number, signal: AbortSignal) {
  const full = el.textContent ?? "";
  const on = document.createElement("span");
  const caret = document.createElement("span");
  caret.className = "ty-caret";
  el.replaceChildren(on, caret);
  el.classList.add("typing");
  try {
    for (let i = 1; i <= full.length; i++) {
      on.textContent = full.slice(0, i);
      await sleep(1000 / cps, signal);
    }
  } finally {
    el.textContent = full;
    el.classList.replace("typing", "typed");
  }
}

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
          await sleep(620, signal);
          band.classList.add("lit");
          await sleep(260, signal);
          await insert(fix, 22, signal);
          const rig = new PenRig(rigEl, rest);
          const tip = ink.runs[0]?.getPointAtLength(0);
          const at = { x: (tip?.x ?? 0) + ink.dx, y: (tip?.y ?? 0) + ink.dy };
          await rig.to(
            { x: at.x + 50, y: at.y + 60, r: -30, lift: 0.7, tilt: 1 },
            520,
            ease.settle,
            signal,
          );
          await write(rig, ink, { speed: 0.8, signal });
          const down = rig.to(rest, 680, ease.glide, signal);
          for (const w of words) await typeOn(w, { cps: 72, signal });
          await down;
          band.classList.add("played");
        })().catch(() => {
          setDrawn(strokesOf(layer, sheet, ["tick"]), true);
          band.classList.add("lit", "played");
        }),
      0.35,
    );
    return () => {
      ctl.abort();
      off();
      offHead();
    };
  }, []);
  return null;
}
