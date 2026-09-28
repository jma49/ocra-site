"use client";

import { useEffect, useRef } from "react";
import { attachRipple } from "@/lib/ripple";
import { WORDMARK } from "@/lib/wordmark";

// The full-width OCRA band that closes the page. Moving the pointer over it
// sends ripples through the letters, pressing drops a bigger one; reduced
// motion leaves it still.
export function Wordmark({ label }: { label: string }) {
  const band = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!band.current || !art.current || !canvas.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return attachRipple(band.current, canvas.current, art.current);
  }, []);

  return (
    <div
      ref={band}
      className="relative cursor-crosshair touch-pan-y select-none overflow-hidden bg-brand px-4 pt-8 sm:px-8 sm:pt-12"
    >
      <svg
        ref={art}
        viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
        role="img"
        aria-label={label}
        fill="currentColor"
        className="mx-auto block h-auto w-full max-w-[110rem] text-ink"
      >
        {WORDMARK.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}
