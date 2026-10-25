"use client";

import { useEffect } from "react";
import { hoverLift, magnetic, nearEyes, pointerLight } from "./desk/motion/pointer";
import { autoText } from "./desk/motion/text";

// The landing page's shared motion, in one island so no section turns into a
// client component for it (motion.md §2, §6, §9, §12):
// - `html.hy` once hydrated. The gating script in the root layout's <head>
//   added `html.mo` before the first paint (with motion allowed) and drops
//   it after 4 s if this never runs, so every pre-play state is released.
//   This never adds `mo` itself: a pre-play state never flashes after paint.
// - Ink layers drawn once in view (`data-ink="once"`, desk/ink.tsx) get
//   `.on` once 45 % visible, which draws their strokes (08-ink.css).
// - `--vh`, the viewport height the pinned story sizes from, re-measured
//   only when the width changes (toolbars and full-page captures change the
//   height alone).
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

    cleanups.push(inkOnce());
    // The desk (foundation.md): the lamp follows the pointer on every desk
    // section, sheets and cards lift under it, typed and counted text plays
    // once in view, the eye row on a ruler watches the pointer.
    for (const s of document.querySelectorAll<HTMLElement>(
      '.home [data-ground="desk"], .home [data-ground="desk-evening"]',
    ))
      cleanups.push(pointerLight(s));
    cleanups.push(hoverLift());
    cleanups.push(autoText());
    cleanups.push(nearEyes());
    cleanups.push(magnetic());
    return () => {
      for (const c of cleanups) c();
    };
  }, []);

  return null;
}

function inkOnce(): () => void {
  const io = new IntersectionObserver(
    (entries, self) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("on");
        self.unobserve(e.target);
      }
    },
    { threshold: 0.45, rootMargin: "0px 0px -6% 0px" },
  );
  for (const el of document.querySelectorAll("[data-ink='once']")) io.observe(el);
  return () => io.disconnect();
}
