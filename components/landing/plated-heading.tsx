"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cjk } from "./heading";

// A poster headline printed on three plates: ink on top, aquamarine and pink
// underneath. On load the colour plates settle into register; under the
// pointer they slip off it, following the pointer, with a glitch slice at
// the pointer's row. The text itself is never split, so it reads and wraps
// as one line of copy.
export function PlatedHeading({
  as: Tag,
  title,
  emphasis,
  className,
}: {
  as: "h1" | "h2";
  title: string;
  emphasis: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amp = reduced ? 0.6 : 1;
    const cut = el.querySelector<HTMLElement>(".plate-cut");
    const cur = { x: 0.6, y: 0.4, s: reduced ? 0 : 3.2 };
    const tgt = { x: 0.6, y: 0.4, s: 0 };
    let hover = false;
    let lastMove = 0;
    let raf = 0;
    const tick = (t: number) => {
      const k = hover ? 0.18 : 0.07;
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      cur.s += (tgt.s - cur.s) * k;
      const ox = cur.x * cur.s * 0.06 * amp;
      const oy = cur.y * cur.s * 0.04 * amp;
      el.style.setProperty("--ax", `${(-ox).toFixed(4)}em`);
      el.style.setProperty("--ay", `${(-oy).toFixed(4)}em`);
      el.style.setProperty("--px", `${(ox * 1.3).toFixed(4)}em`);
      el.style.setProperty("--py", `${(oy * 1.3).toFixed(4)}em`);
      if (cut) {
        const live = !reduced && hover && t - lastMove < 260;
        cut.style.opacity = live && Math.random() > 0.35 ? "1" : "0";
      }
      raf =
        Math.abs(tgt.s - cur.s) > 0.002 || hover
          ? requestAnimationFrame(tick)
          : 0;
    };
    const go = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    go();
    if (!matchMedia("(hover: hover)").matches)
      return () => cancelAnimationFrame(raf);
    const enter = () => {
      hover = true;
      tgt.s = 1;
      go();
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tgt.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tgt.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty(
        "--cy",
        `${Math.max(0, e.clientY - r.top - 10).toFixed(0)}px`,
      );
      el.style.setProperty(
        "--cx",
        `${((Math.random() - 0.5) * 0.12).toFixed(3)}em`,
      );
      lastMove = performance.now();
      go();
    };
    const leave = () => {
      hover = false;
      tgt.s = 0;
      if (cut) cut.style.opacity = "0";
      go();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Chinese poster lines break explicitly before the emphasis (AGENTS.md).
  const text: ReactNode = (
    <>
      {title}
      {cjk(title) ? <br /> : " "}
      <em>{emphasis}</em>
    </>
  );
  return (
    <Tag ref={ref} className={`plated ${className ?? ""}`}>
      <span className="plate plate-a" aria-hidden="true">
        {text}
      </span>
      <span className="plate plate-p" aria-hidden="true">
        {text}
      </span>
      {text}
      <span className="plate plate-cut" aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
