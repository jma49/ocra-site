"use client";

import { type ReactNode, useEffect, useRef } from "react";

// The bill's root. It draws once 35 % visible (data-pen-once, motion.tsx);
// it also draws once it has been scrolled past, however the reader got
// there (a fling, a link, a reload further down), so coming back up they
// find the finished bill, not empty share bars that read as 0 %. The hero's
// review clock does the same (review-clock.tsx). The rule lives here, not in
// the shared penOnce, because the bill is the only draw-once root whose
// unplayed state reads as data.
export function FeaturesBook({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The root is everything above the viewport: the bill lies wholly inside
    // it once its bottom has passed the viewport's top.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || e.boundingClientRect.bottom > (e.rootBounds?.bottom ?? 0)) return;
        el.classList.add("on");
        io.disconnect();
      },
      { rootMargin: "100000px 0px -100% 0px", threshold: [0, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="feat-book" data-pen="on" data-pen-once="0.35">
      {children}
    </div>
  );
}
