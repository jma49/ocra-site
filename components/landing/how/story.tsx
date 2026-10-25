"use client";

import { type ReactNode, useEffect, useRef } from "react";

// The same query as 30-how.css's pinned block (which also needs html.mo).
const PIN =
  "(min-width: 1200px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
// When figure 4's beats move the meter on: filter, verify, judge, verdict.
const BEATS = [0, 800, 1600, 2100];
// The leaving figure's body fades for 350 ms; its marks reset after that.
const SWAP = 400;

// The scroll story's island (motion.md §6). Scroll picks the step, time plays
// it: pinned, an IntersectionObserver on a line at the viewport's middle sets
// the step, and the step's figure swaps in and gets `.on`, which draws its
// marks (04-pen.css, data-pen="on"). Unpinned with motion, each figure plays
// once when 40 % visible. Without motion nothing plays: the server rendered
// every figure finished. No scroll listener; the step buttons scroll to
// their step. The server renders step 1 as current, so nothing jumps.
export function Story({ pass, children }: { pass: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? run(ref.current, pass) : undefined), [pass]);
  return (
    <div ref={ref} className="how-run" data-step="1">
      {children}
    </div>
  );
}

function run(root: HTMLElement, pass: string): () => void {
  const all = (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)];
  const story = root.querySelector<HTMLElement>(".story");
  const steps = all(".step");
  const figs = all(".fig");
  const stages = all(".meter li");
  const passed = root.querySelector(".meter-pass");
  const motion = () => document.documentElement.classList.contains("mo");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const pin = matchMedia(PIN);
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const leaving = new Map<HTMLElement, number>();
  let beats: number[] = [];
  let pinned = false;
  let current = 1;
  let lockedUntil = 0;
  let io: IntersectionObserver | undefined;

  const meter = (n: number) => {
    for (const id of beats) clearTimeout(id);
    const at = (g: number, k: number) => {
      for (const li of stages) {
        const lg = Number(li.dataset.g);
        const i = lg === 4 ? stages.filter((s) => s.dataset.g === "4").indexOf(li) : -1;
        li.classList.toggle("is-past", lg < g || (lg === g && i >= 0 && i < k));
        li.classList.toggle("is-on", lg === g && (g < 4 || i === k));
      }
    };
    at(n, 0);
    beats = n === 4 ? BEATS.slice(1).map((ms, k) => later(() => at(4, k + 1), ms)) : [];
  };

  const play = (fig: HTMLElement) => {
    clearTimeout(leaving.get(fig));
    fig.classList.remove("on");
    void fig.offsetWidth;
    fig.classList.add("on");
  };
  // Step 1 reaches the middle before its figure has stuck in place: its
  // marks wait until the figure is nine-tenths in view.
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.intersectionRatio < 0.9) continue;
        seen.unobserve(e.target);
        if (e.target === figs[current - 1]) play(e.target as HTMLElement);
      }
    },
    { threshold: 0.9 },
  );
  const playInView = (fig: HTMLElement) => {
    const box = fig.getBoundingClientRect();
    if (box.top >= 0 && box.bottom <= innerHeight) play(fig);
    else seen.observe(fig);
  };

  const select = (n: number) => {
    const fig = figs[n - 1];
    if (!fig || (n === current && fig.classList.contains("on"))) return;
    current = n;
    for (const el of [root, story]) el?.setAttribute("data-step", String(n));
    root.style.setProperty("--step", String(n));
    if (passed) passed.textContent = pass.replace("{n}", String(n));
    steps.forEach((step, i) => {
      step.classList.toggle("is-on", i + 1 === n);
      const button = step.querySelector("button");
      if (i + 1 === n) button?.setAttribute("aria-current", "step");
      else button?.removeAttribute("aria-current");
    });
    figs.forEach((other, i) => {
      other.classList.toggle("is-on", i + 1 === n);
      other.classList.toggle("is-out", i + 1 < n);
      other.inert = i + 1 !== n;
      if (other !== fig && other.classList.contains("on")) {
        leaving.set(
          other,
          later(() => other.classList.remove("on"), SWAP),
        );
      }
    });
    playInView(fig);
    meter(n);
  };

  const setup = () => {
    io?.disconnect();
    pinned = motion() && pin.matches;
    if (pinned) {
      for (const [i, fig] of figs.entries()) fig.inert = i + 1 !== current;
      io = new IntersectionObserver(
        (entries) => {
          if (performance.now() < lockedUntil) return;
          for (const e of entries) {
            if (e.isIntersecting) select(Number((e.target as HTMLElement).dataset.i));
          }
        },
        { rootMargin: "-50% 0px -50% 0px" },
      );
      for (const step of steps) io.observe(step);
      return;
    }
    for (const fig of figs) fig.inert = false;
    for (const step of steps) step.querySelector("button")?.removeAttribute("aria-current");
    if (!motion()) return;
    // A figure plays when 40 % visible, or as soon as the reader is past
    // its top (a jump from the nav lands mid-figure or beyond it), so no
    // figure is ever seen waiting for marks it will not get.
    io = new IntersectionObserver(
      (entries, self) => {
        for (const e of entries) {
          const past = e.boundingClientRect.top < 0;
          if (e.intersectionRatio < 0.4 && !past) continue;
          e.target.classList.add("on");
          self.unobserve(e.target);
        }
      },
      { threshold: [0, 0.4] },
    );
    for (const fig of figs) if (!fig.classList.contains("on")) io.observe(fig);
  };

  const go = (e: MouseEvent) => {
    const button = (e.target as Element).closest<HTMLElement>("[data-go]");
    const n = Number(button?.dataset.go);
    const step = steps[n - 1];
    if (!step) return;
    const smooth = !reduce.matches;
    step.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
    if (!pinned) return;
    // The smooth scroll passes the steps in between: hold the observer.
    lockedUntil = performance.now() + (smooth ? 900 : 0);
    select(n);
  };

  setup();
  pin.addEventListener("change", setup);
  root.addEventListener("click", go);
  return () => {
    io?.disconnect();
    seen.disconnect();
    pin.removeEventListener("change", setup);
    root.removeEventListener("click", go);
    for (const id of timers) clearTimeout(id);
  };
}
