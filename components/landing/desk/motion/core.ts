// The desk's one physics, for client islands (foundation.md, Motion). Every
// helper honours the gate: `html.mo` (set before paint when motion is
// allowed, dropped by the 4 s fail-safe) and a signal that cancels it.

// The easing vocabulary, as in app/tokens.css: settle (paper landing), glide
// (an object carried), stroke (the pen's velocity), snap (a clip biting).
export const EASE = {
  settle: "cubic-bezier(0.2, 0.75, 0.15, 1)",
  glide: "cubic-bezier(0.45, 0, 0.2, 1)",
  stroke: "cubic-bezier(0.6, 0, 0.4, 1)",
  snap: "cubic-bezier(0.3, 1.45, 0.5, 1)",
} as const;

export type Ease = (t: number) => number;

// A CSS cubic-bezier as a function of time (Newton steps on x, then y).
export function bezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const c = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  const d = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t * t;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) t -= (c(x1, x2, t) - x) / (d(x1, x2, t) || 1e-6);
    return c(y1, y2, Math.min(1, Math.max(0, t)));
  };
}

export const ease = {
  settle: bezier(0.2, 0.75, 0.15, 1),
  glide: bezier(0.45, 0, 0.2, 1),
  stroke: bezier(0.6, 0, 0.4, 1),
  snap: bezier(0.3, 1.45, 0.5, 1),
  // The pen's velocity on a stroke: a slow landing, a quick middle, a slow lift.
  pen: (u: number) => (u < 0.5 ? 2 * u * u * (1.4 - 0.8 * u) : 1 - (-2 * u + 2) ** 2.2 / 2),
  linear: (u: number) => u,
} satisfies Record<string, Ease>;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Whether the page may move: the gate's class, and no reduced motion.
export function motionAllowed(): boolean {
  return (
    document.documentElement.classList.contains("mo") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// A mouse or trackpad that hovers: the pointer effects run only there.
export const finePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

export class Cancelled extends Error {}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((res, rej) => {
    const id = setTimeout(res, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      rej(new Cancelled());
    });
  });
}

// One value from 0 to 1 over `ms` on animation frames; `fn` gets the eased
// value. Rejects with Cancelled when the signal aborts.
export function tween(
  ms: number,
  fn: (k: number) => void,
  e: Ease = ease.glide,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((res, rej) => {
    const t0 = performance.now();
    const step = (now: number) => {
      if (signal?.aborted) return rej(new Cancelled());
      const t = Math.min(1, (now - t0) / ms);
      fn(e(t));
      if (t < 1) requestAnimationFrame(step);
      else res();
    };
    requestAnimationFrame(step);
  });
}

// Run `fn` once when `el` is `threshold` in view; returns a disposer.
export function whenSeen(el: Element, fn: () => void, threshold = 0.45): () => void {
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries.at(-1);
      if (!e?.isIntersecting) return;
      io.disconnect();
      fn();
    },
    { threshold, rootMargin: "0px 0px -6% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

// A scroll-scrubbed value: `fn(p)` with p from 0 (el's top meets the
// viewport's bottom) to 1 (el's bottom meets its top), on frames, and only
// while `el` is in view. Prefer a CSS scroll timeline (animation-timeline:
// view()) where the value is a transform or an opacity; this is for the rest.
export function scrub(el: Element, fn: (p: number) => void): () => void {
  let raf = 0;
  const read = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    fn(clamp((innerHeight - r.top) / (innerHeight + r.height)));
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };
  const io = new IntersectionObserver((entries) => {
    const e = entries.at(-1);
    if (e?.isIntersecting) {
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else removeEventListener("scroll", onScroll);
  });
  io.observe(el);
  return () => {
    io.disconnect();
    removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
  };
}

// A chapter's timeline: beats in sequence, each awaited, cancelled as a
// whole. `beat(ms)` waits; a beat returning a promise is awaited.
export async function play(
  beats: readonly ((signal: AbortSignal) => unknown)[],
  signal: AbortSignal,
): Promise<boolean> {
  try {
    for (const b of beats) {
      if (signal.aborted) return false;
      await b(signal);
    }
    return true;
  } catch (e) {
    if (e instanceof Cancelled) return false;
    throw e;
  }
}
