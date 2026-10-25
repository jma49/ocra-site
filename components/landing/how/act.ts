// Small acts the story's island repeats: the camera's fit, a 1 px shake, a
// blink, a row typed in character steps. No state of their own.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

type Frame = { x: number; y: number; w: number; h: number };
export type Cam = { tx: number; ty: number; s: number };

// A shot ([x0, y0, x1, y1] in world px) fitted and centred in a frame of
// the stage, never above world scale 1.
export function fitShot(shot: readonly number[], f: Frame): Cam {
  const [x0 = 0, y0 = 0, x1 = 1, y1 = 1] = shot;
  const w = x1 - x0;
  const h = y1 - y0;
  const s = Math.min(1, f.w / w, f.h / h);
  return { s, tx: f.x + (f.w - w * s) / 2 - x0 * s, ty: f.y + (f.h - h * s) / 2 - y0 * s };
}

// Paper under a clip's bite: a 1 px give and back.
export function shake(els: readonly (Element | null | undefined)[]) {
  for (const el of els)
    el?.animate(
      [
        { translate: "0 0" },
        { translate: "0 1.2px" },
        { translate: "0 -0.6px" },
        { translate: "0 0" },
      ],
      { duration: 160 },
    );
}

export function blink(eyes: Element | null | undefined) {
  eyes
    ?.querySelector(".lids")
    ?.animate(
      [{ transform: "scaleY(1)" }, { transform: "scaleY(0.08)" }, { transform: "scaleY(1)" }],
      {
        duration: 180,
        easing: "ease-in-out",
      },
    );
}

// A typed row that keeps its markup (the matrix's two columns): revealed
// left to right in character steps.
export async function stepType(el: HTMLElement, cps: number, signal: AbortSignal) {
  el.classList.remove("untyped");
  const n = Math.max(8, (el.textContent ?? "").length);
  const a = el.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
    duration: (n / cps) * 1000,
    easing: `steps(${n})`,
  });
  signal.addEventListener("abort", () => a.finish());
  await a.finished;
}
