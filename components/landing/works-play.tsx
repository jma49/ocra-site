"use client";

import { useEffect } from "react";
import { ease, motionAllowed, sleep, tween, whenSeen } from "@/components/landing/desk/motion/core";
import { PenRig } from "@/components/landing/desk/motion/pen";
import { typeOn } from "@/components/landing/desk/motion/text";

// The works paper's choreography (motion.md: Typed things, Ink). Once in
// view, the headline rises by line; the spread's columns print together
// and the terminal runs (the command typed, its output flushed line by
// line), all inside a second, so nobody reads a half-printed column; then
// the pen comes in lifted, rings 42 in each column, one lead at a time,
// and lies down at the paper's foot, off the text. The provider count runs
// to 45 in under a second, darkening each id it counts. Phones swipe the
// columns: each ring inks itself as its column comes into view, no pen.
// The server paints all of it finished, which is what Reduce motion keeps.

const WIDE = "(min-width: 1200px)";
const PHONE = "(max-width: 759px)";

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

const parts = (layer: SVGSVGElement) => ({
  run: layer.querySelector<SVGPathElement>(".ink-run"),
  group: layer.querySelector<SVGGElement>(".ink-s"),
});

async function ring(rig: PenRig, layer: SVGSVGElement, anchor: HTMLElement, signal: AbortSignal) {
  const { run, group } = parts(layer);
  if (!run || !group) return;
  const at = along(run, anchor);
  const start = at(0);
  const d = Math.hypot(start.x - rig.s.x, start.y - rig.s.y);
  await rig.to(
    { ...start, lift: 0.42, tilt: 1 },
    Math.min(340, 140 + d * 0.25),
    ease.glide,
    signal,
  );
  await rig.to({ lift: 0 }, 40, ease.settle, signal);
  await tween(
    340,
    (k) => {
      rig.set(at(k));
      run.style.strokeDashoffset = `${1 - k}`;
    },
    ease.pen,
    signal,
  );
  run.style.strokeDashoffset = "0";
  group.classList.add("dry");
  await rig.to({ lift: 0.4 }, 60, ease.settle, signal);
}

// The phone's ring: the ink alone, along the same centreline.
async function inkRing(layer: SVGSVGElement, signal: AbortSignal) {
  const { run, group } = parts(layer);
  if (!run || !group) return;
  await tween(420, (k) => (run.style.strokeDashoffset = `${1 - k}`), ease.pen, signal);
  run.style.strokeDashoffset = "0";
  group.classList.add("dry");
}

// The terminal: the command typed, then its output flushed line by line.
async function runTerm(col: HTMLElement, signal: AbortSignal) {
  const [cmd, ...out] = col.querySelectorAll<HTMLElement>(".works-tl, .works-path, .works-loc");
  if (cmd) await typeOn(cmd, { cps: 90, signal });
  for (const line of out) {
    await sleep(36, signal);
    line.classList.add("typed");
  }
}

export function WorksPlay() {
  useEffect(() => {
    const sec = document.getElementById("product");
    if (!sec || !motionAllowed()) return;
    const ctl = new AbortController();
    const { signal } = ctl;
    const quiet = () => {};
    const offs: (() => void)[] = [];
    const head = sec.querySelector<HTMLElement>(".works-h");
    const spread = sec.querySelector<HTMLElement>(".works-spread");
    const cols = [...sec.querySelectorAll<HTMLElement>(".works-col")];
    const rings = [...sec.querySelectorAll<SVGSVGElement>(".works-ring")];
    const anchor = sec.querySelector<HTMLElement>(".works-pen-at");
    const rigEl = sec.querySelector<HTMLElement>(".works-pen");
    const prov = sec.querySelector<HTMLElement>(".works-prov");
    if (!head || !spread || !anchor || !rigEl || !prov) return;

    offs.push(whenSeen(head, () => head.classList.add("in"), 0.5));

    // Print every column at once (the CSS staggers them by a beat).
    const print = () => {
      sec.classList.add("live");
      for (const col of cols) {
        col.classList.add("on");
        if (col.classList.contains("works-term")) void runTerm(col, signal).catch(quiet);
      }
    };

    if (matchMedia(PHONE).matches) {
      offs.push(whenSeen(spread, print, 0.2));
      rings.forEach((layer, c) => {
        const col = cols[c];
        if (!col) return;
        offs.push(
          whenSeen(
            col,
            () =>
              void sleep(c === 0 ? 620 : 160, signal)
                .then(() => inkRing(layer, signal))
                .catch(quiet),
            0.6,
          ),
        );
      });
    } else {
      const rest = { x: 0, y: 0, r: -6, lift: 0, tilt: 0 };
      let rig: PenRig | undefined;
      // The pen comes in from beyond the paper's right edge, lifted.
      const pen = () => {
        if (!rig) {
          const a = anchor.getBoundingClientRect();
          const first = rings[0]?.querySelector<SVGPathElement>(".ink-run");
          const y = first ? along(first, anchor)(0).y : 0;
          rig = new PenRig(rigEl, {
            x: innerWidth - a.left + 80,
            y: y + 240,
            r: 38,
            lift: 1,
            tilt: 1,
          });
          sec.classList.add("pen-in");
        }
        return rig;
      };

      // The pen's queue: one ring at a time, in the order they were asked;
      // between asks it lies down at rest, and comes back for a late one.
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
            await sleep(80, signal);
            if (!queue.length) await pen().to(rest, 640, ease.glide, signal);
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

      if (matchMedia(WIDE).matches) {
        offs.push(
          whenSeen(
            spread,
            () => {
              print();
              void sleep(300, signal).then(() => ask(0, 1, 2), quiet);
            },
            0.2,
          ),
        );
      } else {
        // Two columns and the terminal under them: each prints and is
        // ringed as it comes into view.
        cols.forEach((col, c) => {
          offs.push(
            whenSeen(
              col,
              () => {
                sec.classList.add("live");
                col.style.setProperty("--c", "0");
                col.classList.add("on");
                const done = col.classList.contains("works-term")
                  ? runTerm(col, signal)
                  : sleep(520, signal);
                void done.then(() => ask(c), quiet);
              },
              0.35,
            ),
          );
        });
      }
    }

    // The count runs to 45 in under a second, from when the figure itself
    // is in view, and darkens each id it counts.
    const count = prov.querySelector<HTMLElement>(".works-count") ?? prov;
    const num = prov.querySelector<HTMLElement>(".works-num");
    const ids = [...prov.querySelectorAll<HTMLElement>(".works-id")];
    if (num) num.textContent = "0";
    offs.push(
      whenSeen(
        count,
        () => {
          sec.classList.add("counting");
          void tween(
            900,
            (k) => {
              const c = Math.round(k * ids.length);
              if (num) num.textContent = String(c);
              for (let i = 0; i < c; i++) ids[i]?.classList.add("on");
            },
            (u) => 1 - (1 - u) ** 2,
            signal,
          ).catch(quiet);
        },
        0.5,
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
