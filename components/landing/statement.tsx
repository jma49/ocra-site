"use client";

import { useEffect, useRef } from "react";
import type { Copy } from "@/lib/copy";
import { Heading } from "./heading";

// The manifesto: words brighten one by one as the paragraph scrolls through
// the middle of the screen. Without JavaScript, or with Reduce motion on,
// the paragraph is simply shown.
export function Statement({ copy }: { copy: Copy["statement"] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = [...el.querySelectorAll<HTMLElement>(".w")];
    el.dataset.scrub = "on";
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.8;
      const end = innerHeight * 0.45 - r.height;
      const k = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      const lit = k * words.length;
      words.forEach((w, i) => {
        w.style.opacity = String(Math.min(1, Math.max(0.16, lit - i + 0.16)));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Chinese has no spaces: it brightens by character instead of by word.
  const parts = /\s/.test(copy.body) ? copy.body.split(/(\s+)/) : [...copy.body];
  return (
    <section className="chapter tight-top">
      <div className="wrap state-grid">
        <Heading title={copy.title} emphasis={copy.emphasis} />
        <p ref={ref} className="scrub">
          {parts.map((p, i) =>
            /^\s+$/.test(p) ? (
              p
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered
              <span key={i} className="w">
                {p}
              </span>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
