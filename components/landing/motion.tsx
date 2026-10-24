"use client";

import { useEffect } from "react";

// The landing page's shared motion, in one island so no section turns into a
// client component for it (motion.md §2, §6, §9, §12):
// - `html.hy` once hydrated. The gating script in the root layout's <head>
//   added `html.mo` before the first paint (with motion allowed) and drops
//   it after 4 s if this never runs, so every pre-play state is released.
//   This never adds `mo` itself: a pre-play state never flashes after paint.
// - `[data-pen-once]` roots get `.on` once 45 % visible, which draws their
//   marks once (04-pen.css). `data-pen-once="0.5"` sets another threshold;
//   `data-pen-once="timeline"` is skipped where scroll timelines draw it
//   instead (the quiet band's struck words).
// - `--vh`, the viewport height the pinned story sizes from, re-measured
//   only when the width changes (toolbars and full-page captures change the
//   height alone).
// - The final band's eyes follow the pointer while the band is within a
//   viewport of the screen, and blink only while it is in view (`.awake`).
//   Pointer-driven, so it runs under Reduce motion too; the blink does not.
export function LandingMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("hy");
    const cleanups: (() => void)[] = [];

    let width = innerWidth;
    const resized = () => {
      if (innerWidth === width) return;
      width = innerWidth;
      root.style.setProperty("--vh", `${innerHeight}px`);
    };
    addEventListener("resize", resized, { passive: true });
    cleanups.push(() => removeEventListener("resize", resized));

    cleanups.push(penOnce());
    cleanups.push(finalEyes());
    return () => {
      for (const c of cleanups) c();
    };
  }, []);

  return null;
}

function penOnce(): () => void {
  const timeline = CSS.supports("animation-timeline: view()");
  const observers = new Map<number, IntersectionObserver>();
  for (const el of document.querySelectorAll<HTMLElement>("[data-pen-once]")) {
    const value = el.dataset.penOnce;
    if (value === "timeline" && timeline) continue;
    const threshold = Number(value) || 0.45;
    let io = observers.get(threshold);
    if (!io) {
      io = new IntersectionObserver(
        (entries, self) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("on");
            self.unobserve(e.target);
          }
        },
        { threshold, rootMargin: "0px 0px -6% 0px" },
      );
      observers.set(threshold, io);
    }
    io.observe(el);
  }
  return () => {
    for (const io of observers.values()) io.disconnect();
  };
}

// Travel of each pupil, in viewBox units: the big eyes and the small ones.
const TRAVEL_BIG = 1.55;
const TRAVEL_SMALL = 0.62;

function finalEyes(): () => void {
  const band = document.querySelector<HTMLElement>("#final");
  const pupils = [...document.querySelectorAll<SVGGElement>(".final-eyes .pupil")];
  if (!band || pupils.length === 0) return () => {};
  const eyes = pupils.map((pupil) => {
    const r = Number(pupil.querySelector(".iris")?.getAttribute("r") ?? 0);
    return { pupil, travel: r > 2 ? TRAVEL_BIG : TRAVEL_SMALL, x: 0, y: 0, tx: 0, ty: 0 };
  });

  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    const dt = last ? now - last : 16.7;
    last = now;
    const k = 1 - (1 - 0.16) ** (dt / 16.7);
    let moving = false;
    for (const eye of eyes) {
      eye.x += (eye.tx - eye.x) * k;
      eye.y += (eye.ty - eye.y) * k;
      if (Math.abs(eye.tx - eye.x) > 0.01 || Math.abs(eye.ty - eye.y) > 0.01) moving = true;
      eye.pupil.style.setProperty("--px", eye.x.toFixed(3));
      eye.pupil.style.setProperty("--py", eye.y.toFixed(3));
    }
    raf = moving ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  const move = (e: PointerEvent) => {
    for (const eye of eyes) {
      const r = eye.pupil.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 420) * eye.travel;
      eye.tx = (dx / d) * reach;
      eye.ty = (dy / d) * reach * 0.8;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };

  let listening = false;
  const near = new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting && !listening) addEventListener("pointermove", move, { passive: true });
      if (!e?.isIntersecting && listening) removeEventListener("pointermove", move);
      listening = !!e?.isIntersecting;
    },
    { rootMargin: "100% 0px" },
  );
  const seen = new IntersectionObserver(([e]) =>
    band.classList.toggle("awake", !!e?.isIntersecting),
  );
  near.observe(band);
  seen.observe(band);
  return () => {
    near.disconnect();
    seen.disconnect();
    removeEventListener("pointermove", move);
    cancelAnimationFrame(raf);
  };
}
