"use client";

import { useEffect } from "react";
import { clamp, EASE, ease, motionAllowed, sleep } from "@/components/landing/desk/motion/core";
import { PenRig, setDrawn, strokesOf, write } from "@/components/landing/desk/motion/pen";

// The lifecycle's motion (D3; motion.md, Lifecycle), one lead per beat.
// Scroll is the camera: as the stage arrives, push 2 slides in from the
// desk's right edge onto push 1's blank lower half and lands (scrubbed, smoothed, reversible). Once it has
// landed the review plays once, a beat at a time: the ruler reads push 2
// down to the fix, its eyes glance up at the old note and blink; the pen
// ticks that note on push 1; the state turns Fixed and the card's thread is
// retyped. Scrolling back before the landing resets it. Without motion the
// server's finished desk stays as it is.

const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const num = (s: CSSStyleDeclaration, name: string) =>
  Number.parseFloat(s.getPropertyValue(name)) || 0;
const NARROW = "(max-width: 1023px)";
// Push 2 travels while the section's top goes from 30 % of the viewport
// to 20 % above it (the stage then holds, pinned).
const FROM_TOP = 0.3;
const SPAN = 0.5;

export function LifecyclePlay() {
  useEffect(() => {
    const section = document.getElementById("lifecycle");
    const q = <T extends Element>(s: string) => section?.querySelector<T>(s) ?? null;
    const pin = q<HTMLElement>(".life-pin");
    const world = q<HTMLElement>(".life-world");
    const r2 = q<HTMLElement>(".life-r2");
    const sheet1 = q<HTMLElement>(".life-r1 .desk-sheet");
    const layer = q<SVGSVGElement>(".life-ink");
    const ruler = q<HTMLElement>(".life-r2 .ruler");
    const eyes = q<SVGSVGElement>(".life-r2 .ruler-eyes");
    const penEl = q<HTMLElement>(".life-pen");
    const thread = q<HTMLElement>(".life-thread-v");
    const h2 = q<HTMLElement>(".life-h");
    if (!section || !pin || !world || !r2 || !sheet1) return;
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
    const r2Sh = [
      ...(r2.querySelector(".desk-sheet") ?? r2).querySelectorAll<HTMLElement>(":scope > .sh"),
    ];

    // Where push 2 comes from, per layout (50-lifecycle.css).
    let from = { x: 0, y: 0, r: 0 };
    const measure = () => {
      const w = getComputedStyle(world);
      from = { x: num(w, "--r2-dx"), y: num(w, "--r2-dy"), r: num(w, "--r2-dr") };
    };

    let target = 0;
    let p = 0;
    let played = false;
    let run: AbortController | null = null;

    const render = () => {
      const k = ease.glide(p);
      const u = 1 - k;
      r2.style.translate = `${(from.x * u).toFixed(1)}px ${(from.y * u).toFixed(1)}px`;
      r2.style.rotate = `${(from.r * u).toFixed(3)}deg`;
      // Carried: held up while it travels, flat on contact.
      const lift = u > 0 ? 0.7 * Math.sin(Math.min(1, u * 1.6) * Math.PI * 0.5) : 0;
      for (const el of r2Sh) el.style.setProperty("--lift", lift.toFixed(3));
      if (p >= 0.97 && !played) void play();
      if (p < 0.5 && played) reset();
    };

    let raf = 0;
    let last = 0;
    const frameTick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      p += (target - p) * (1 - 0.78 ** (dt / 16.7));
      if (Math.abs(target - p) < 0.0005) p = target;
      render();
      raf = p !== target ? requestAnimationFrame(frameTick) : 0;
      if (!raf) last = 0;
    };
    const read = () => {
      const top = section.getBoundingClientRect().top;
      target = seg(innerHeight * FROM_TOP - top, 0, innerHeight * SPAN);
      if (!raf) raf = requestAnimationFrame(frameTick);
    };

    const look = (px: number, py = 0) => {
      eyes.style.setProperty("--px", String(px));
      eyes.style.setProperty("--py", String(py));
    };
    // The thread's state, erased and typed again: well under a second.
    const retype = async (text: string, signal: AbortSignal) => {
      thread.classList.add("typing");
      const cur = thread.textContent ?? "";
      for (let i = cur.length; i >= 0; i--) {
        thread.textContent = cur.slice(0, i);
        await sleep(20, signal);
      }
      await sleep(90, signal);
      const each = Math.min(34, 620 / Math.max(1, text.length));
      for (let i = 1; i <= text.length; i++) {
        thread.textContent = text.slice(0, i);
        await sleep(each, signal);
      }
      await sleep(700, signal);
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
        // Reading: the ruler slides in under push 2's first line and steps
        // down to the fix.
        ruler.style.setProperty("--row", "0");
        ruler.classList.add("in");
        ruler.animate(
          [
            { translate: "-30px 0", opacity: 0 },
            { translate: "0 0", opacity: 1 },
          ],
          { duration: 360, easing: EASE.settle, fill: "forwards" },
        );
        look(0.9, 0.2);
        await sleep(300, signal);
        const to = Number(ruler.dataset.row ?? "0");
        for (let r = 1; r <= to; r++) {
          ruler.style.setProperty("--row", String(r));
          await sleep(r === to ? 200 : 110, signal);
        }
        // On the fix: the eyes glance up at the old note on push 1, blink.
        look(1.1, -1);
        await sleep(260, signal);
        eyes
          .querySelector(".lids")
          ?.animate(
            [{ transform: "scaleY(1)" }, { transform: "scaleY(0.08)" }, { transform: "scaleY(1)" }],
            { duration: 170, easing: "ease-in-out" },
          );
        await sleep(200, signal);
        ruler.animate(
          [
            { translate: "0 0", opacity: 1 },
            { translate: "-90px 0", opacity: 0 },
          ],
          { duration: 320, easing: EASE.glide, fill: "forwards" },
        );
        // Comment last: the pen comes in lifted and ticks push 1's note.
        const first = tickInk.runs[0]?.getPointAtLength(0);
        const sx = (first?.x ?? 0) + tickInk.dx;
        const sy = (first?.y ?? 0) + tickInk.dy;
        rig.set({ x: sx + 340, y: sy + 260, r: 30, lift: 1, tilt: 1 });
        penEl.classList.remove("away");
        await rig.to({ x: sx + 6, y: sy + 6, r: 34, lift: 0.4 }, 420, ease.settle, signal);
        ruler.classList.remove("in");
        await write(rig, tickInk, { speed: 1.4, signal });
        // Wet ink shines for a moment on the tick alone.
        for (const g of tickInk.groups)
          g.querySelector(".ink-shine")?.animate([{ opacity: 0.55 }, { opacity: 0 }], {
            duration: 720,
            easing: EASE.glide,
          });
        // The pen is put down first; then the card's line is the one lead.
        await rig.to(restOf(), 620, ease.glide, signal);
        pin.dataset.state = "fixed";
        await retype(doneText, signal);
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
      render();
    } else {
      unplayed();
      read();
      p = target;
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
