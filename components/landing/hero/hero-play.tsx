"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, ease, motionAllowed, sleep } from "@/components/landing/desk/motion/core";
import { PenRig, setDrawn, strokesOf, write } from "@/components/landing/desk/motion/pen";

// The hero's load choreography (motion.md, Load and Reading). The lamp, the
// sheet's landing and the headline's rise are CSS (10-hero.css) from the
// first paint; this plays the review on top, on absolute times from the
// navigation so a late hydration catches up instead of running late:
// the ruler reads down the page with the eyes on its tab, glances back at
// expiresAt and blinks on line 42; the pen comes in, writes, lifts and lies
// down; the finding card is dealt and clipped at line 42 by about 3 s.
// A repeat visit in the session (the gate's `html.seen`) paints the final
// state at once, with Replay.
const SEEN = "ocra:desk-hero";

const until = (t: number, signal: AbortSignal) => sleep(Math.max(0, t - performance.now()), signal);

export function HeroPlay({ replay, replayLabel }: { replay: string; replayLabel: string }) {
  const [canReplay, setCanReplay] = useState(false);
  const run = useRef<AbortController | null>(null);

  const play = useCallback(async (t0: number) => {
    const hero = document.getElementById("hero");
    const sheet = hero?.querySelector<HTMLElement>(".hero-sheet");
    const layer = hero?.querySelector<SVGSVGElement>(".hero-ink");
    const ruler = hero?.querySelector<HTMLElement>(".ruler");
    const rigEl = hero?.querySelector<HTMLElement>(".hero-pen");
    const card = hero?.querySelector<HTMLElement>(".hero-card");
    const clip = hero?.querySelector<HTMLElement>(".hero-clip");
    const eyes = ruler?.querySelector<SVGSVGElement>(".ruler-eyes");
    if (!hero || !sheet || !layer || !ruler || !rigEl || !card || !clip || !eyes) return;
    run.current?.abort();
    const ctl = new AbortController();
    run.current = ctl;
    const { signal } = ctl;
    const finish = () => {
      hero.classList.remove("live");
      hero.classList.add("done");
      setDrawn(ink, true);
      ruler.style.setProperty("--row", finalRow);
      ruler.style.removeProperty("--nudge");
      rig.set(rest);
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {
        /* storage refused: the next visit plays again */
      }
      setCanReplay(true);
    };

    const ink = strokesOf(layer, sheet, ["units", "now", "caret", "fix"]);
    const narrow = matchMedia("(max-width: 1023px)").matches && rigEl.dataset.restNarrow;
    const [rx = 0, ry = 0, rr = 0] = ((narrow || rigEl.dataset.rest) ?? "").split(" ").map(Number);
    const rest = { x: rx, y: ry, r: rr, lift: 0, tilt: 0 };
    const rig = new PenRig(rigEl, { x: rest.x + 520, y: rest.y + 620, r: 52, lift: 1, tilt: 1 });
    const look = (px: number, py = 0) => {
      eyes.style.setProperty("--px", String(px));
      eyes.style.setProperty("--py", String(py));
    };
    const finalRow = ruler.dataset.row ?? "0";
    const row42 = Number(finalRow) - 1;

    setDrawn(ink, false);
    ruler.classList.remove("in");
    card.classList.remove("dealt");
    clip.classList.remove("bit");
    hero.classList.remove("done");
    hero.classList.add("live");
    setCanReplay(false);

    try {
      // Reading: the ruler slides in under line 29 (the call to isExpired),
      // pauses there, then glides down a row at a time to line 42.
      await until(t0 + 250, signal);
      // On a phone the desk is cropped to the last lines: read from there.
      const from = narrow ? Math.max(0, row42 - 6) : 0;
      ruler.style.setProperty("--row", String(from));
      ruler.classList.add("in");
      look(0.9, -0.2);
      await sleep(200, signal);
      // The pen sets off from the desk while the ruler is still reading, so
      // it is over the line as the eyes find it.
      const first = ink.runs[0]?.getPointAtLength(0);
      const start = { x: (first?.x ?? 0) + ink.dx, y: (first?.y ?? 0) + ink.dy };
      let enter: Promise<void> | undefined;
      for (let r = from + 1; r <= row42; r++) {
        ruler.style.setProperty("--row", String(r));
        if (r === row42 - 4)
          enter = rig.to(
            { x: start.x + 70, y: start.y + 80, r: 40, lift: 0.55, tilt: 1 },
            520,
            ease.settle,
            signal,
          );
        await sleep(r > row42 - 3 ? 50 : narrow ? 70 : 28, signal);
      }
      // Line 42: the eyes run along it to Date.now(), glance back at
      // expiresAt, and blink; the ruler makes room for the pen.
      look(1.2, -0.5);
      await sleep(130, signal);
      look(0.15, -0.5);
      ruler.style.setProperty("--nudge", "14px");
      await sleep(150, signal);
      eyes
        .querySelector(".lids")
        ?.animate(
          [{ transform: "scaleY(1)" }, { transform: "scaleY(0.08)" }, { transform: "scaleY(1)" }],
          { duration: 170, easing: "ease-in-out" },
        );
      await enter;
      await write(rig, ink, { speed: 0.4, signal });
      look(0.4, 0.4);
      // Done writing: the pen lies down, the card is dealt and clipped.
      const lie = rig.to({ ...rest, lift: 0, tilt: 0 }, 640, ease.glide, signal);
      card.classList.add("dealt");
      const deal = card.animate(
        [
          { translate: "-180px 420px", rotate: "-18deg", opacity: 0.4 },
          { translate: "-14px 18px", rotate: "-2deg", opacity: 1, offset: 0.72 },
          { translate: "0px 0px", rotate: "0deg", opacity: 1 },
        ],
        { duration: 560, easing: EASE.settle, fill: "backwards" },
      );
      await deal.finished;
      clip.classList.add("bit");
      clip.animate(
        [
          { scale: "1.22", translate: "0 -10px", opacity: 0 },
          { scale: "0.96", translate: "0 0", opacity: 1, offset: 0.7 },
          { scale: "1", translate: "0 0", opacity: 1 },
        ],
        { duration: 240, easing: EASE.snap, fill: "backwards" },
      );
      await sleep(170, signal);
      card.animate(
        [
          { translate: "0 0" },
          { translate: "1px 0" },
          { translate: "-1px 0" },
          { translate: "0 0" },
        ],
        { duration: 110 },
      );
      await lie;
      finish();
    } catch {
      /* cancelled by a replay; it sets its own state */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const visible = hero.getBoundingClientRect().bottom > innerHeight * 0.3;
    if (!motionAllowed() || root.classList.contains("seen") || !visible) {
      hero.classList.add("done");
      const rig = hero.querySelector<HTMLElement>(".hero-pen");
      const narrow = rig?.dataset.restNarrow;
      if (rig && narrow && matchMedia("(max-width: 1023px)").matches) {
        const [x = 0, y = 0, r = 0] = narrow.split(" ").map(Number);
        new PenRig(rig, { x, y, r, lift: 0, tilt: 0 });
      }
      setCanReplay(motionAllowed());
      return;
    }
    void play(0);
    return () => run.current?.abort();
  }, [play]);

  if (!canReplay) return null;
  return (
    <button
      type="button"
      className="hero-replay"
      aria-label={replayLabel}
      onClick={() => {
        document.documentElement.classList.remove("seen");
        void play(performance.now());
      }}
    >
      {replay}
    </button>
  );
}
