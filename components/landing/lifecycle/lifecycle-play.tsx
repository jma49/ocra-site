"use client";

import { useEffect } from "react";
import {
  clamp,
  EASE,
  ease,
  lerp,
  motionAllowed,
  sleep,
} from "@/components/landing/desk/motion/core";
import { PenRig, setDrawn, strokesOf, write } from "@/components/landing/desk/motion/pen";

// The lifecycle's motion (D3; motion.md, Lifecycle). Scroll is the camera:
// through the pinned stage, the finding's card lifts off push 1, push 2
// slides in under it and lands, and the card glides onto push 2 (scrubbed,
// smoothed, reversible). When it has landed the review plays once: the ruler
// reads push 2 down to the fix with the eyes on its tab, glances back and
// blinks; the pen ticks the old note on push 1; the state turns Fixed and the
// card's thread is retyped. Scrolling back past the landing resets it.
// Without motion the server's finished desk stays as it is.

const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const num = (s: CSSStyleDeclaration, name: string) =>
  Number.parseFloat(s.getPropertyValue(name)) || 0;
const NARROW = "(max-width: 1023px)";

export function LifecyclePlay() {
  useEffect(() => {
    const section = document.getElementById("lifecycle");
    const q = <T extends Element>(s: string) => section?.querySelector<T>(s) ?? null;
    const pin = q<HTMLElement>(".life-pin");
    const world = q<HTMLElement>(".life-world");
    const r1 = q<HTMLElement>(".life-r1");
    const r2 = q<HTMLElement>(".life-r2");
    const frame = q<HTMLElement>(".life-penframe");
    const card = q<HTMLElement>(".life-card");
    const sheet1 = q<HTMLElement>(".life-r1 .desk-sheet");
    const layer = q<SVGSVGElement>(".life-ink");
    const ruler = q<HTMLElement>(".life-r2 .ruler");
    const eyes = q<SVGSVGElement>(".life-r2 .ruler-eyes");
    const penEl = q<HTMLElement>(".life-pen");
    const thread = q<HTMLElement>(".life-thread-v");
    const h2 = q<HTMLElement>(".life-h");
    if (!section || !pin || !world || !r1 || !r2 || !frame || !card || !sheet1) return;
    if (!layer || !ruler || !eyes || !penEl || !thread || !h2) return;

    const restOf = () => {
      const [x = 0, y = 0, r = 0] = (
        (matchMedia(NARROW).matches && penEl.dataset.restNarrow) ||
        penEl.dataset.rest ||
        ""
      )
        .split(" ")
        .map(Number);
      return { x, y, r, lift: 0, tilt: 0 };
    };
    const rig = new PenRig(penEl, restOf());
    if (!motionAllowed()) return;

    const rise = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        h2.classList.add("risen");
        rise.disconnect();
      },
      { threshold: 0.45 },
    );
    rise.observe(h2);

    const tickInk = strokesOf(layer, sheet1, ["tick"]);
    // The hero's marks on push 1 are dry ink from the start.
    setDrawn(strokesOf(layer, sheet1, ["units", "now", "caret", "fix"]), true);
    const openText = thread.dataset.open ?? "";
    const doneText = thread.dataset.done ?? "";
    const shadows = (el: Element) => [...el.querySelectorAll<HTMLElement>(":scope > .sh")];
    const r2Sh = shadows(r2.querySelector(".desk-sheet") ?? r2);
    const cardSh = shadows(card);
    const setLift = (els: HTMLElement[], v: number) => {
      for (const el of els) el.style.setProperty("--lift", v.toFixed(3));
    };

    // Where the moving objects come from, per layout (50-lifecycle.css).
    let from = { r2x: 0, r2y: 0, r2r: 0, cx: 0, cy: 0, cr: 0 };
    let cardAt = { x: 0, y: 0, r: 0 };
    const measure = () => {
      const w = getComputedStyle(world);
      from = {
        r2x: num(w, "--r2-dx"),
        r2y: num(w, "--r2-dy"),
        r2r: num(w, "--r2-dr"),
        cx: num(w, "--card-dx"),
        cy: num(w, "--card-dy"),
        cr: num(w, "--card-dr"),
      };
      for (const k of ["--x", "--y", "--r"]) card.style.removeProperty(k);
      const c = getComputedStyle(card);
      cardAt = { x: num(c, "--x"), y: num(c, "--y"), r: num(c, "--r") };
    };

    let target = 0;
    let p = 0;
    let enterT = 1;
    let enter = 1;
    let played = false;
    let run: AbortController | null = null;

    const render = () => {
      const k1 = seg(p, 0.08, 0.24);
      const k2 = ease.glide(seg(p, 0.14, 0.5));
      const k3 = ease.glide(seg(p, 0.42, 0.6));
      // Parallax by height as the stage arrives: paper low, the card higher.
      const d1 = enter * 70;
      const dc = enter * 150;
      r1.style.translate = `0 ${d1.toFixed(1)}px`;
      frame.style.translate = r1.style.translate;
      const u = 1 - k2;
      r2.style.translate = `${(from.r2x * u).toFixed(1)}px ${(from.r2y * u + d1).toFixed(1)}px`;
      r2.style.rotate = `${(from.r2r * u).toFixed(3)}deg`;
      // Carried: it rises as it starts to move and settles flat on contact.
      setLift(
        r2Sh,
        k2 < 1 ? 0.75 * Math.sin(Math.min(1, k2 * 1.05) * Math.PI * 0.5) * u + 0.12 * u : 0,
      );
      const v = 1 - k3;
      const lift = k1 * v;
      card.style.setProperty(
        "--x",
        `${lerp(cardAt.x + from.cx - k1 * 18, cardAt.x, k3).toFixed(1)}px`,
      );
      card.style.setProperty(
        "--y",
        `${(lerp(cardAt.y + from.cy - k1 * 26, cardAt.y, k3) + dc).toFixed(1)}px`,
      );
      card.style.setProperty("--r", `${(cardAt.r + from.cr * v).toFixed(3)}deg`);
      setLift(cardSh, lift);
      if (p >= 0.58 && !played) void play();
      if (p < 0.4 && played) reset();
    };

    let raf = 0;
    let last = 0;
    const frameTick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = 1 - 0.8 ** (dt / 16.7);
      p += (target - p) * k;
      enter += (enterT - enter) * k;
      if (Math.abs(target - p) < 0.0004) p = target;
      if (Math.abs(enterT - enter) < 0.0004) enter = enterT;
      render();
      raf = p !== target || enter !== enterT ? requestAnimationFrame(frameTick) : 0;
      if (!raf) last = 0;
    };
    const read = () => {
      const r = section.getBoundingClientRect();
      const travel = r.height - pin.offsetHeight;
      target = clamp(-r.top / (travel || 1));
      enterT = clamp(r.top / innerHeight);
      if (!raf) raf = requestAnimationFrame(frameTick);
    };

    const look = (px: number, py = 0) => {
      eyes.style.setProperty("--px", String(px));
      eyes.style.setProperty("--py", String(py));
    };
    const retype = async (text: string, signal: AbortSignal) => {
      thread.classList.add("typing");
      const cur = thread.textContent ?? "";
      for (let i = cur.length; i >= 0; i--) {
        thread.textContent = cur.slice(0, i);
        await sleep(22, signal);
      }
      await sleep(140, signal);
      for (let i = 1; i <= text.length; i++) {
        thread.textContent = text.slice(0, i);
        await sleep(38, signal);
      }
      await sleep(900, signal);
      thread.classList.remove("typing");
    };

    const unplayed = () => {
      setDrawn(tickInk, false);
      thread.textContent = openText;
      thread.classList.remove("typing");
      pin.dataset.state = "open";
      ruler.classList.remove("in");
      for (const a of ruler.getAnimations()) a.cancel();
      penEl.classList.add("away");
      section.classList.remove("done");
    };

    const play = async () => {
      played = true;
      run?.abort();
      const ctl = new AbortController();
      run = ctl;
      const { signal } = ctl;
      try {
        // Reading: the ruler slides in under push 2's first line and glides
        // down a row at a time to the fix.
        ruler.style.setProperty("--row", "0");
        ruler.classList.add("in");
        ruler.animate(
          [
            { translate: "-30px 0", opacity: 0 },
            { translate: "0 0", opacity: 1 },
          ],
          {
            duration: 520,
            easing: EASE.settle,
            fill: "forwards",
          },
        );
        look(0.9, -0.2);
        await sleep(420, signal);
        const last = Number(ruler.dataset.row ?? "0");
        for (let r = 1; r <= last; r++) {
          ruler.style.setProperty("--row", String(r));
          await sleep(r >= last - 1 ? 230 : 85, signal);
        }
        // On the fix: the eyes run along it, glance back at expiresAt, blink.
        look(1.2, -0.5);
        await sleep(170, signal);
        look(0.1, -0.5);
        await sleep(190, signal);
        eyes
          .querySelector(".lids")
          ?.animate(
            [{ transform: "scaleY(1)" }, { transform: "scaleY(0.08)" }, { transform: "scaleY(1)" }],
            { duration: 170, easing: "ease-in-out" },
          );
        await sleep(220, signal);
        await ruler.animate(
          [
            { translate: "0 0", opacity: 1 },
            { translate: "-90px 0", opacity: 0 },
          ],
          {
            duration: 380,
            easing: EASE.glide,
            fill: "forwards",
          },
        ).finished;
        ruler.classList.remove("in");
        // Comment last: the pen comes in lifted and ticks push 1's note.
        const first = tickInk.runs[0]?.getPointAtLength(0);
        const sx = (first?.x ?? 0) + tickInk.dx;
        const sy = (first?.y ?? 0) + tickInk.dy;
        rig.set({ x: sx + 380, y: sy + 300, r: 30, lift: 1, tilt: 1 });
        penEl.classList.remove("away");
        await rig.to({ x: sx + 6, y: sy + 6, r: 36, lift: 0.4 }, 480, ease.settle, signal);
        await write(rig, tickInk, { speed: 1.3, signal });
        // Wet ink shines for a moment on the tick alone.
        for (const g of tickInk.groups)
          g.querySelector(".ink-shine")?.animate([{ opacity: 0.55 }, { opacity: 0 }], {
            duration: 720,
            easing: EASE.glide,
          });
        pin.dataset.state = "fixed";
        const typed = retype(doneText, signal);
        await sleep(160, signal);
        await rig.to(restOf(), 900, ease.glide, signal);
        await typed;
        section.classList.add("done");
      } catch {
        /* scrolled back: reset() took over */
      }
    };

    const reset = () => {
      played = false;
      run?.abort();
      run = null;
      unplayed();
    };

    measure();
    const r = section.getBoundingClientRect();
    if (r.bottom < innerHeight * 0.5) {
      // Arrived below it (a link, a reload): the finished desk, at once.
      played = true;
      target = p = 1;
      enter = enterT = 0;
      render();
    } else {
      unplayed();
      read();
      p = target;
      enter = enterT;
      render();
    }

    let on = false;
    const near = new IntersectionObserver(
      ([e]) => {
        const vis = !!e?.isIntersecting;
        if (vis && !on) addEventListener("scroll", read, { passive: true });
        if (!vis && on) removeEventListener("scroll", read);
        on = vis;
        if (vis) read();
      },
      { rootMargin: "50% 0px" },
    );
    near.observe(section);
    let width = innerWidth;
    const resized = () => {
      if (innerWidth === width) return;
      width = innerWidth;
      measure();
      if (section.classList.contains("done")) rig.set(restOf());
      read();
    };
    addEventListener("resize", resized, { passive: true });
    return () => {
      run?.abort();
      rise.disconnect();
      near.disconnect();
      removeEventListener("scroll", read);
      removeEventListener("resize", resized);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
