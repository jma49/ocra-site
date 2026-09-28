"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

// Fades content in the first time it scrolls into view, rising slightly
// unless the visitor prefers reduced motion. Nothing is hidden until this
// has run, so the page reads the same without JavaScript.
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "pending" | "visible">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;
    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("visible");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal={state}>
      {children}
    </div>
  );
}
