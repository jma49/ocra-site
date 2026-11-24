"use client";

import { type ReactNode, useEffect, useRef } from "react";

// The hero's stage leans towards the pointer: the back row of shapes a
// little, the front row more, the window tilts (10-hero.css reads --px and
// --py, each -0.5 to 0.5). Pointer-driven, so it runs under Reduce motion
// too, but only where there is a fine pointer to follow.
export function HeroStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div className="hero-stage" ref={stage}>
      {children}
    </div>
  );
}
