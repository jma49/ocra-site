"use client";

import { useEffect, useRef } from "react";

// A field of points on a slowly rolling surface, seen in perspective. Drawn on
// a 2D canvas (no WebGL dependency); it pauses off screen and in background
// tabs, and draws a single still frame under reduced motion.
const COLS = 120;
const ROWS = 46;
const NEAR = 1.2;
const FAR = 12;
const CAMERA_HEIGHT = 1.5;
const MAX_DPR = 2;

export function WaveField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let tilt = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    const started = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = (now - started) / 1000;
      const dark = root.classList.contains("dark");
      const rgb = dark ? "127, 255, 212" : "11, 122, 92";
      const strength = dark ? 1 : 0.6;
      tilt = {
        x: tilt.x + (target.x - tilt.x) * 0.04,
        y: tilt.y + (target.y - tilt.y) * 0.04,
      };
      ctx.clearRect(0, 0, width, height);

      // A floor of points seen from above the horizon. Each row spans the
      // visible width, so rows keep an even density on screen while depth
      // shows in the rows' spacing, the dots' size and their fade.
      const focal = width * 0.55;
      const horizon = height * (0.34 + tilt.y * 0.03);
      const centre = width * (0.55 + tilt.x * 0.04);
      const reach = (width * 0.62) / focal;
      for (let r = 0; r < ROWS; r++) {
        const z = NEAR + ((FAR - NEAR) * r) / (ROWS - 1);
        const fade = 1 - (z - NEAR) / (FAR - NEAR);
        const half = reach * z;
        for (let c = 0; c < COLS; c++) {
          const x = -half + (2 * half * c) / (COLS - 1);
          const y =
            Math.sin(x * 0.5 + t * 0.7) * 0.3 +
            Math.cos(z * 0.65 - t * 0.5) * 0.25 +
            Math.sin((x - z) * 0.35 + t * 0.4) * 0.18;
          const px = centre + (x / z) * focal;
          const py = horizon + ((CAMERA_HEIGHT - y) / z) * focal * 0.5;
          if (py < -4 || py > height + 4) continue;
          const crest = 0.55 + y;
          const alpha =
            Math.max(0, Math.min(1, fade ** 1.9 * crest)) * strength;
          if (alpha < 0.03) continue;
          const size = Math.max(1, 2.6 / z + 0.4);
          ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) draw(started + 4000);
      else if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      target = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      start();
    });
    const themeObserver = new MutationObserver(() => {
      if (reduced.matches) start();
    });
    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (reduced.matches || !frame)
        draw(reduced.matches ? started + 4000 : performance.now());
    });

    resize();
    observer.observe(canvas);
    sizeObserver.observe(canvas);
    themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
    reduced.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      themeObserver.disconnect();
      reduced.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
