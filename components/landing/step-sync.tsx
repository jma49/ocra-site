"use client";

import { type ReactNode, useEffect, useRef } from "react";

// Marks the step whose middle is nearest the viewport's middle, and its
// picture in the sticky panel, with `on`. Computed from layout on scroll
// and resize: unlike an IntersectionObserver it is a pure function of the
// layout, so it never flips between two identical frames (a full-page
// screenshot stretches the viewport and used to catch it mid-switch).
export function StepSync({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const steps = [...el.querySelectorAll<HTMLElement>(".step")];
    const pictures = [...el.querySelectorAll<HTMLElement>(".vis")];
    let raf = 0;
    const pick = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let best = 0;
      let dist = Number.POSITIVE_INFINITY;
      steps.forEach((step, i) => {
        const r = step.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      for (const [i, node] of [...steps.entries(), ...pictures.entries()]) {
        node.classList.toggle("on", i === best);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sync" ref={root}>
      {children}
    </div>
  );
}
