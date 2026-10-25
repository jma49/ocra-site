import { tick, underline } from "@/lib/landing/ink/marks";

// A's hover, the only hover the desk has: a text link gets the pen's
// underline, the primary call to action's arrow a pen tick. Both are ink
// strokes revealed on :hover and :focus-visible (08-ink.css), never chrome
// colour; they sit outside the text, so nothing moves.

const LINE = underline(2, 196, 4, { width: 2.6, seed: 21 }).strokes[0];
const TICK = tick(2, 6, { size: 12, width: 2.4, seed: 23 }).strokes[0];

export function InkUnderline() {
  if (!LINE) return null;
  return (
    <svg
      className="hover-ink ink-under"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <mask id="hover-under" maskUnits="userSpaceOnUse">
        <path className="ink-run" d={LINE.centre} pathLength={1} strokeWidth={14} />
      </mask>
      <path className="ink-body" d={LINE.outline} filter="url(#ink)" mask="url(#hover-under)" />
    </svg>
  );
}

export function PenTick() {
  if (!TICK) return null;
  return (
    <svg className="hover-ink ink-tick" viewBox="0 0 20 20" aria-hidden="true">
      <mask id="hover-tick" maskUnits="userSpaceOnUse">
        <path className="ink-run" d={TICK.centre} pathLength={1} strokeWidth={10} />
      </mask>
      <path className="ink-body" d={TICK.outline} filter="url(#ink)" mask="url(#hover-tick)" />
    </svg>
  );
}
