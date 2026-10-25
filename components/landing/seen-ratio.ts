// Run `fn` once when `ratio` of `el` is in view (or, for an element taller
// than the screen allows, most of the screen is it); returns a disposer.
// motion/core.ts whenSeen fires at the first pixel: an observer reports
// isIntersecting as soon as anything overlaps, below its threshold too. This
// checks the ratio; it can go once whenSeen does.
export function seenAt(el: Element, fn: () => void, ratio: number, rootMargin = "0px"): () => void {
  const steps = [0, 0.25, 0.5, 0.75, 0.9, 0.98, 1, ratio].sort((a, b) => a - b);
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e?.isIntersecting) return;
      const need = Math.min(ratio, (innerHeight * 0.7) / Math.max(1, e.boundingClientRect.height));
      if (e.intersectionRatio + 0.005 < need) return;
      io.disconnect();
      fn();
    },
    { threshold: steps, rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}
