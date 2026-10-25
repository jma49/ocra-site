import { Cancelled, ease, motionAllowed, tween, whenSeen } from "./core";

// Typed things and counted figures. The server renders the final text; these
// replay it once when it comes into view, without moving layout: the untyped
// rest keeps its place (hidden), a counted figure keeps its final width.

// Type a plain-text element on with a caret, `cps` characters a second and
// a typewriter's rhythm (a little longer after a space or a stop), the whole
// line done within `max` ms however long it is, so a reader never waits on
// half-typed text. Timed on frames, not a timer per character.
export async function typeOn(
  el: HTMLElement,
  { cps = 38, max = 1100, signal }: { cps?: number; max?: number; signal?: AbortSignal } = {},
) {
  const full = el.textContent ?? "";
  if (!full || !motionAllowed()) return;
  const chars = [...full];
  const beats = chars.map((ch) => (ch === " " ? 1.6 : /[.,:;]/.test(ch) ? 2.4 : 1));
  const unit = Math.min(1000 / cps, max / beats.reduce((a, b) => a + b, 0));
  // When each character appears: the first at once, each next one a beat
  // after the one before it; the caret rests for the last beat.
  const at: number[] = [];
  let t = 0;
  for (const b of beats) {
    at.push(t);
    t += b * unit;
  }
  const on = document.createElement("span");
  const caret = document.createElement("span");
  const rest = document.createElement("span");
  caret.className = "ty-caret";
  rest.className = "ty-rest";
  rest.textContent = full;
  el.replaceChildren(on, caret, rest);
  el.classList.add("typing");
  try {
    await new Promise<void>((res, rej) => {
      const t0 = performance.now();
      let shown = 0;
      const frame = (now: number) => {
        if (signal?.aborted) return rej(new Cancelled());
        const e = now - t0;
        let i = shown;
        while (i < at.length && (at[i] ?? 0) <= e) i++;
        if (i !== shown) {
          shown = i;
          on.textContent = chars.slice(0, i).join("");
          rest.textContent = chars.slice(i).join("");
        }
        if (e >= t) return res();
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  } finally {
    el.textContent = full;
    el.classList.remove("typing");
    el.classList.add("typed");
  }
}

// Count a figure up to the number it shows ("45", "$0.5134", "30 steps"),
// from `from`, over `ms`.
export async function countUp(
  el: HTMLElement,
  { from = 0, ms = 1100, signal }: { from?: number; ms?: number; signal?: AbortSignal } = {},
) {
  const final = el.textContent ?? "";
  const m = /(-?\d[\d,]*(?:\.\d+)?)/.exec(final);
  if (!m || !motionAllowed()) return;
  const [num = ""] = m;
  const to = Number(num.replace(/,/g, ""));
  const places = num.split(".")[1]?.length ?? 0;
  const commas = num.includes(",");
  const before = final.slice(0, m.index);
  const after = final.slice(m.index + num.length);
  el.style.display = "inline-block";
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  const fmt = (v: number) => {
    const s = v.toFixed(places);
    return commas ? Number(s).toLocaleString("en-US", { minimumFractionDigits: places }) : s;
  };
  try {
    await tween(
      ms,
      (k) => {
        el.textContent = before + fmt(from + (to - from) * k) + after;
      },
      ease.settle,
      signal,
    );
  } finally {
    el.textContent = final;
  }
}

// Wire `[data-type]` (cps in the value, default 38) and `[data-count]`
// (the start in the value, default 0) under `scope`, each once in view.
export function autoText(scope: ParentNode = document): () => void {
  if (!motionAllowed()) return () => {};
  const offs: (() => void)[] = [];
  for (const el of scope.querySelectorAll<HTMLElement>("[data-type]")) {
    offs.push(whenSeen(el, () => void typeOn(el, { cps: Number(el.dataset.type) || 38 }), 0.6));
  }
  for (const el of scope.querySelectorAll<HTMLElement>("[data-count]")) {
    offs.push(whenSeen(el, () => void countUp(el, { from: Number(el.dataset.count) || 0 }), 0.6));
  }
  return () => {
    for (const off of offs) off();
  };
}
