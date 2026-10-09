"use client";

import { useEffect } from "react";

// What reveals as it scrolls in, and in what order within its group.
const REVEAL = [
  ".split-head",
  ".legend",
  ".works-grid",
  ".pipe-steps > li",
  ".pipe-fig",
  ".state-grid",
  ".cards > article",
  ".life",
  ".secure",
  ".plans > article",
  ".faq-grid",
  ".final .eyes-alive",
].join(",");
// Surfaces that carry the pointer's spotlight.
const SPOT = ".card, .plan, .secure";
// How far the reading light reaches past the pointer (03-hero.css). Beyond
// it the light is outside the hero, and moving it would only repaint.
const REACH = 320;

// The landing page's motion in one island, so no section turns into a client
// component for it:
// - sections and cards rise in as they scroll into view, staggered within a
//   grid (hidden only once this has run, so the page reads without
//   JavaScript, never under Reduce motion, and never once on screen: the
//   script may run after the reader has scrolled);
// - a soft light follows the pointer across the surfaces;
// - every eye row with `data-look` turns its pupils towards the pointer;
// - the hero's reading light follows the pointer.
// The pointer effects answer the pointer, so they run under Reduce motion.
export function LandingMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanups: (() => void)[] = [];

    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const items = [...document.querySelectorAll<HTMLElement>(REVEAL)].filter(
        (el) => el.getBoundingClientRect().top >= innerHeight,
      );
      for (const el of items) {
        const siblings = el.parentElement ? [...el.parentElement.children] : [];
        el.style.setProperty("--ri", String(Math.max(0, siblings.indexOf(el))));
        el.dataset.reveal = "";
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      for (const el of items) io.observe(el);
      root.classList.add("motion");
      cleanups.push(() => {
        io.disconnect();
        root.classList.remove("motion");
      });
    }

    const eyes = [...document.querySelectorAll<SVGElement>("[data-look]")];
    const reading = document.querySelector<HTMLElement>(".reading");
    let raf = 0;
    let last: PointerEvent | undefined;
    let light = "";
    const frame = () => {
      raf = 0;
      if (!last) return;
      const { clientX: x, clientY: y, target } = last;
      for (const el of eyes) {
        const r = el.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2);
        const dy = y - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        // Full turn once the pointer is a few eye-widths away.
        const k = Math.min(1, d / (r.width * 2 + 120));
        el.style.setProperty("--px", ((dx / d) * k).toFixed(3));
        el.style.setProperty("--py", ((dy / d) * k).toFixed(3));
      }
      if (reading) {
        const r = reading.getBoundingClientRect();
        const lx = x - r.left;
        const ly = y - r.top;
        const away = lx < -REACH || ly < -REACH || lx > r.width + REACH || ly > r.height + REACH;
        // Out of reach the light parks in one place, so moving the pointer
        // elsewhere on the page changes nothing.
        const [px, py] = away ? [-REACH, -REACH] : [Math.round(lx), Math.round(ly)];
        if (`${px} ${py}` !== light) {
          light = `${px} ${py}`;
          reading.style.setProperty("--lx", `${px}px`);
          reading.style.setProperty("--ly", `${py}px`);
          reading.dataset.live = "";
        }
      }
      const spot = target instanceof Element ? target.closest<HTMLElement>(SPOT) : null;
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(x - r.left).toFixed(0)}px`);
        spot.style.setProperty("--my", `${(y - r.top).toFixed(0)}px`);
      }
    };
    const move = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    addEventListener("pointermove", move, { passive: true });
    cleanups.push(() => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    });

    return () => {
      for (const c of cleanups) c();
    };
  }, []);

  return null;
}
