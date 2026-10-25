"use client";

import { useEffect } from "react";
import {
  Cancelled,
  ease,
  finePointer,
  motionAllowed,
  sleep,
  tween,
} from "@/components/landing/desk/motion/core";
import { PenRig, type PenState } from "@/components/landing/desk/motion/pen";
import { typeOn } from "@/components/landing/desk/motion/text";
import { seenAt } from "./seen-ratio";

// Plans' choreography (motion.md, Plans): the head rises, the ledger's rules
// print, the prices type on in a cascade, and as soon as ocra Cloud's is
// typed the pen comes in from the page's edge, held up, touches down and
// rings it, then lies down by the footnote. Afterwards a hover (with a
// dwell) or a focus on the other available plan lifts the pen and rings that
// one; a plan asked for meanwhile is queued, never fought over. The server
// paints the final state; without motion nothing here runs.

type Ring = { svg: SVGSVGElement; run: SVGPathElement; group: SVGGElement; ms: number };

const REST: PenState = { x: 0, y: 0, r: 7, lift: 0, tilt: 0 };
const DWELL = 420;

function ringOf(row: HTMLElement): Ring | null {
  const svg = row.querySelector<SVGSVGElement>(".pl-ring");
  const run = svg?.querySelector<SVGPathElement>(".ink-run");
  const group = svg?.querySelector<SVGGElement>(".ink-s");
  if (!svg || !run || !group) return null;
  return { svg, run, group, ms: Number.parseFloat(group.style.getPropertyValue("--t")) || 900 };
}

function setRing(r: Ring, k: number) {
  r.run.style.strokeDashoffset = String(1 - k);
}

export function PlansPlay() {
  useEffect(() => {
    const sec = document.getElementById("plans");
    const head = sec?.querySelector<HTMLElement>(".pl-head");
    const spot = sec?.querySelector<HTMLElement>(".pl-pen-spot");
    const rigEl = spot?.querySelector<HTMLElement>(".pen-rig");
    const face = sec?.querySelector<HTMLElement>(".paper-band-face");
    if (!sec || !head || !spot || !rigEl || !face || !motionAllowed()) return;
    const rows = [...sec.querySelectorAll<HTMLElement>(".pl-row")];
    const start = rows.find((r) => r.dataset.plan === "cloud");
    if (!start) return;

    const ctl = new AbortController();
    const { signal } = ctl;
    const offs: (() => void)[] = [() => ctl.abort()];
    const rig = new PenRig(rigEl, REST);
    let current: HTMLElement = start;
    let busy = true;
    let pending: HTMLElement | null = null;

    // A point along a ring, in the pen spot's px (the ring's layer is
    // scaled to its figure, so go through the screen).
    const at = (r: Ring, k: number) => {
      const L = r.run.getTotalLength();
      const m = r.run.getScreenCTM();
      const p = r.run.getPointAtLength(L * k);
      const q = m ? p.matrixTransform(m) : p;
      const o = spot.getBoundingClientRect();
      return { x: q.x - o.left, y: q.y - o.top };
    };

    const draw = async (r: Ring, ms: number) => {
      const from = at(r, 0);
      const d = Math.hypot(from.x - rig.s.x, from.y - rig.s.y);
      await rig.to(
        { ...from, r: 38, lift: 0.32, tilt: 1 },
        Math.min(520, 180 + d * 0.45),
        ease.glide,
        signal,
      );
      await rig.to({ lift: 0 }, 70, ease.settle, signal);
      r.svg.classList.remove("off", "fade");
      r.group.classList.remove("dry", "wet");
      await tween(
        ms,
        (k) => {
          rig.set(at(r, k));
          setRing(r, k);
        },
        ease.pen,
        signal,
      );
      setRing(r, 1);
      r.group.classList.add("dry", "wet");
      await rig.to({ lift: 0.45 }, 130, ease.settle, signal);
    };

    const ringRow = async (row: HTMLElement): Promise<void> => {
      if (busy) {
        pending = row === current ? null : row;
        return;
      }
      if (row === current) return;
      const old = ringOf(current);
      const next = ringOf(row);
      if (!next) return;
      busy = true;
      current = row;
      try {
        if (old) {
          old.svg.classList.add("fade");
          setTimeout(() => {
            setRing(old, 0);
            old.svg.classList.add("off");
            old.svg.classList.remove("fade");
          }, 320);
        }
        await draw(next, 820);
        const queued = pending;
        pending = null;
        if (queued && queued !== current) {
          busy = false;
          return ringRow(queued);
        }
        await rig.to(REST, 650, ease.glide, signal);
      } catch (e) {
        if (!(e instanceof Cancelled)) throw e;
      }
      busy = false;
      const queued = pending;
      pending = null;
      if (queued && queued !== current) void ringRow(queued);
    };

    // Each row prints and types when it arrives, a beat after the row
    // before it; the pen waits until ocra Cloud's figure is typed and in
    // full view, so the eye is on it when the ink goes down.
    const seen = (el: Element, t: number) =>
      new Promise<void>((res) => {
        offs.push(seenAt(el, res, t));
      });
    // In full view and clear of the screen's lower quarter, where the eye is.
    const inReach = (el: Element) =>
      new Promise<void>((res) => {
        offs.push(seenAt(el, res, 0.97, "0px 0px -24% 0px"));
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
    let slot = 0;
    const beats = rows.map(async (row) => {
      await seen(row, 0.35);
      const now = performance.now();
      const go = Math.max(now, slot);
      slot = go + 260;
      await sleep(go - now, signal);
      row.classList.add("is-in");
      await sleep(220, signal);
      const word = row.querySelector<HTMLElement>(".pl-word");
      if (word) await typeOn(word, { cps: 15, signal });
    });

    const play = async () => {
      const cloud = ringOf(start);
      const fig = start.querySelector(".pl-fig");
      if (!cloud || !fig) return;
      const live = await Promise.race([
        Promise.all([beats[rows.indexOf(start)], inReach(fig)]).then(() => true),
        passed(fig).then(() => false),
      ]);
      if (live) {
        await sleep(160, signal);
        // The pen comes in from beyond the page's right edge, held up.
        const o = spot.getBoundingClientRect();
        const edge = face.getBoundingClientRect().right - o.left;
        const first = at(cloud, 0);
        rig.set({ x: edge + 80, y: first.y + 240, r: 46, lift: 1, tilt: 1 });
        sec.classList.add("pen-on");
        await draw(cloud, 1050);
        await rig.to(REST, 900, ease.glide, signal);
      } else {
        // Scrolled past before it could be watched: the ring is simply there.
        setRing(cloud, 1);
        cloud.group.classList.add("dry");
        rig.set(REST);
        sec.classList.add("pen-on");
      }
      sec.classList.add("played");
      busy = false;
      const queued = pending;
      pending = null;
      if (queued) void ringRow(queued);
    };

    // Before play the cloud ring is undrawn and the pen is off the page.
    const cloud = ringOf(start);
    if (cloud) setRing(cloud, 0);
    offs.push(seenAt(head, () => head.classList.add("in"), 0.4));
    void Promise.all([play(), ...beats]).catch((e) => {
      if (!(e instanceof Cancelled)) throw e;
    });

    for (const row of rows) {
      if (row.dataset.ring === undefined) continue;
      let t = 0;
      const enter = () => {
        t = window.setTimeout(() => void ringRow(row), DWELL);
      };
      const leave = () => clearTimeout(t);
      const focus = () => void ringRow(row);
      if (finePointer()) {
        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
      }
      row.addEventListener("focusin", focus);
      offs.push(() => {
        clearTimeout(t);
        row.removeEventListener("pointerenter", enter);
        row.removeEventListener("pointerleave", leave);
        row.removeEventListener("focusin", focus);
      });
    }
    return () => {
      for (const off of offs) off();
    };
  }, []);
  return null;
}
