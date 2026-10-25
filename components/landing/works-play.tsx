"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, tween, whenSeen } from "@/components/landing/desk/motion/core";
import { PenRig } from "@/components/landing/desk/motion/pen";
import { typeOn } from "@/components/landing/desk/motion/text";

// The works paper's choreography (motion.md: Typed things, Ink). Once in
// view, the headline rises by line; the spread's columns print left to
// right and the terminal types its lines; then the pen comes in lifted,
// rings 42 in each column (one lead at a time), and lies down above the
// provider index, whose count runs to 45 darkening each id it counts.
// Narrow screens stack the columns: each prints and is ringed as it comes
// into view. The server paints all of it finished, which is what Reduce
// motion keeps.

const WIDE = "(min-width: 1200px)";

type Pt = { x: number; y: number };

// A ring's centreline in the pen anchor's px: the ring layers are scaled
// with their type (em), so map through the screen.
function along(run: SVGPathElement, anchor: HTMLElement) {
  const L = run.getTotalLength();
  return (k: number): Pt => {
    const m = run.getScreenCTM();
    const f = anchor.getBoundingClientRect();
    const p = run.getPointAtLength(L * k);
    if (!m) return { x: 0, y: 0 };
    return { x: m.a * p.x + m.c * p.y + m.e - f.left, y: m.b * p.x + m.d * p.y + m.f - f.top };
  };
}

async function ring(rig: PenRig, layer: SVGSVGElement, anchor: HTMLElement, signal: AbortSignal) {
  const run = layer.querySelector<SVGPathElement>(".ink-run");
  const group = layer.querySelector<SVGGElement>(".ink-s");
  if (!run || !group) return;
  const at = along(run, anchor);
  const start = at(0);
  const d = Math.hypot(start.x - rig.s.x, start.y - rig.s.y);
  await rig.to({ ...start, lift: 0.42, tilt: 1 }, Math.min(620, 220 + d * 0.5), ease.glide, signal);
  await rig.to({ lift: 0 }, 70, ease.settle, signal);
  await tween(
    560,
    (k) => {
      rig.set(at(k));
      run.style.strokeDashoffset = `${1 - k}`;
    },
    ease.pen,
    signal,
  );
  run.style.strokeDashoffset = "0";
  group.classList.add("dry");
  await rig.to({ lift: 0.4 }, 120, ease.settle, signal);
}

export function WorksPlay() {
  useEffect(() => {
    const sec = document.getElementById("product");
    if (!sec || !motionAllowed()) return;
    const ctl = new AbortController();
    const { signal } = ctl;
    const offs: (() => void)[] = [];
    const head = sec.querySelector<HTMLElement>(".works-h");
    const spread = sec.querySelector<HTMLElement>(".works-spread");
    const cols = [...sec.querySelectorAll<HTMLElement>(".works-col")];
    const rings = [...sec.querySelectorAll<SVGSVGElement>(".works-ring")];
    const anchor = sec.querySelector<HTMLElement>(".works-pen-at");
    const rigEl = sec.querySelector<HTMLElement>(".works-pen");
    const prov = sec.querySelector<HTMLElement>(".works-prov");
    if (!head || !spread || !anchor || !rigEl || !prov) return;

    const rest = { x: 0, y: 0, r: -5, lift: 0, tilt: 0 };
    let rig: PenRig | undefined;
    const pen = () => {
      if (!rig) {
        const first = rings[0]?.querySelector<SVGPathElement>(".ink-run");
        const a = first ? along(first, anchor)(0) : { x: 0, y: 0 };
        rig = new PenRig(rigEl, { x: a.x + 460, y: a.y + 560, r: 52, lift: 1, tilt: 1 });
        sec.classList.add("pen-in");
      }
      return rig;
    };

    const typeCol = async (col: HTMLElement, delay: number) => {
      await sleep(delay, signal);
      for (const tl of col.querySelectorAll<HTMLElement>(".works-tl"))
        await typeOn(tl, { cps: 110, signal });
    };

    // The pen's queue: one ring at a time, in the order they were asked;
    // between asks it goes back to rest, and comes back for a late one.
    const queue: number[] = [];
    let draining = false;
    const drain = async () => {
      draining = true;
      try {
        while (queue.length) {
          while (queue.length) {
            const layer = rings[queue.shift() ?? 0];
            if (layer) await ring(pen(), layer, anchor, signal);
          }
          await sleep(140, signal);
          if (!queue.length) await pen().to(rest, 820, ease.glide, signal);
        }
      } catch {
        /* cancelled on unmount */
      } finally {
        draining = false;
      }
    };
    const ask = (...i: number[]) => {
      queue.push(...i);
      if (!draining) void drain();
    };

    offs.push(whenSeen(head, () => head.classList.add("in"), 0.5));
    if (matchMedia(WIDE).matches) {
      offs.push(
        whenSeen(
          spread,
          () => {
            sec.classList.add("live");
            cols.forEach((col, c) => {
              col.classList.add("on");
              if (col.classList.contains("works-term")) void typeCol(col, c * 260 + 160);
            });
            void sleep(1300, signal).then(
              () => ask(0, 1, 2),
              () => {},
            );
          },
          0.42,
        ),
      );
    } else {
      cols.forEach((col, c) => {
        offs.push(
          whenSeen(
            col,
            () => {
              sec.classList.add("live");
              col.style.setProperty("--c", "0");
              col.classList.add("on");
              const typed = col.classList.contains("works-term")
                ? typeCol(col, 160)
                : sleep(700, signal);
              void typed.then(
                () => ask(c),
                () => {},
              );
            },
            0.5,
          ),
        );
      });
    }

    // The count runs to 45 and darkens each id as it is counted.
    const num = prov.querySelector<HTMLElement>(".works-num");
    const ids = [...prov.querySelectorAll<HTMLElement>(".works-id")];
    if (num) num.textContent = "0";
    offs.push(
      whenSeen(
        prov,
        () => {
          sec.classList.add("counting");
          void tween(
            1500,
            (k) => {
              const c = Math.round(k * ids.length);
              if (num) num.textContent = String(c);
              for (let i = 0; i < c; i++) ids[i]?.classList.add("on");
            },
            (u) => 1 - (1 - u) ** 2,
            signal,
          ).catch(() => {});
        },
        0.45,
      ),
    );

    return () => {
      ctl.abort();
      for (const off of offs) off();
      if (num) num.textContent = String(ids.length);
    };
  }, []);

  return null;
}
