"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, whenSeen } from "@/components/landing/desk/motion/core";
import { PenRig, strokesOf, write } from "@/components/landing/desk/motion/pen";
import { countUp, typeOn } from "@/components/landing/desk/motion/text";

// The bill's choreography (motion.md: Ink, Typed things, Pointer). Once in
// view: the headline rises, the list follows, and the rows print one by
// one while their figures count up; the pen comes in lifted, draws the sum
// rule, writes the total by hand, double-underlines it and lies down; the
// token footnote types. Hovering the lead item lifts the sheet it
// describes. The server paints all of it finished (Reduce motion).

export function FeaturesPlay() {
  useEffect(() => {
    const sec = document.getElementById("features");
    if (!sec || !motionAllowed()) return;
    const ctl = new AbortController();
    const { signal } = ctl;
    const offs: (() => void)[] = [];
    const head = sec.querySelector<HTMLElement>(".feat-h");
    const list = sec.querySelector<HTMLElement>(".feat-list");
    const scene = sec.querySelector<HTMLElement>(".feat-scene");
    const sheet = sec.querySelector<HTMLElement>(".feat-sheet");
    const layer = sec.querySelector<SVGSVGElement>(".feat-ink");
    const rigEl = sec.querySelector<HTMLElement>(".feat-pen");
    const lead = sec.querySelector<HTMLElement>(".feat-lead");
    if (!head || !list || !scene || !sheet || !layer || !rigEl) return;

    offs.push(whenSeen(head, () => head.classList.add("in"), 0.5));
    offs.push(whenSeen(list, () => list.classList.add("in"), 0.3));

    const play = async () => {
      sec.classList.add("live");
      const rows = [...sheet.querySelectorAll<HTMLElement>(".feat-row:not(.feat-th)")];
      for (const [i, row] of rows.entries()) {
        row.classList.add("on");
        for (const fig of row.querySelectorAll<HTMLElement>(".feat-fig"))
          void countUp(fig, { ms: 560, signal }).catch(() => {});
        await sleep(i === rows.length - 1 ? 360 : 120, signal);
      }
      const [rx = 0, ry = 0, rr = 0] = (rigEl.dataset.rest ?? "").split(" ").map(Number);
      const rest = { x: rx, y: ry, r: rr, lift: 0, tilt: 0 };
      const rig = new PenRig(rigEl, { x: rx + 360, y: ry + 420, r: 52, lift: 1, tilt: 1 });
      sec.classList.add("pen-in");
      await write(rig, strokesOf(layer, sheet, ["rule"]), { speed: 1.5, signal });
      await write(rig, strokesOf(layer, sheet, ["total"]), { speed: 0.5, signal });
      await write(rig, strokesOf(layer, sheet, ["double"]), { speed: 0.75, signal });
      await rig.to({ ...rest, lift: 0.4, tilt: 0.4 }, 640, ease.glide, signal);
      await rig.to({ lift: 0, tilt: 0 }, 240, ease.settle, signal);
      for (const ty of sec.querySelectorAll<HTMLElement>(".feat-ty"))
        await typeOn(ty, { cps: 70, signal });
      sec.classList.add("done");
    };
    offs.push(
      whenSeen(
        scene,
        () => void play().catch(() => {}),
        matchMedia("(max-width: 759px)").matches ? 0.35 : 0.5,
      ),
    );

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
