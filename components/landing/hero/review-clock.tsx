"use client";

import { type ReactNode, useEffect, useRef } from "react";

// play() on an animation at its end would rewind it (WAAPI auto-rewind), so
// a resume plays only what has not finished, and a pause holds only what runs.
const atEnd = (a: Animation) =>
  Number(a.currentTime ?? 0) >= Number(a.effect?.getComputedTiming().endTime ?? 0);
const resume = (anims: Animation[]) => {
  for (const a of anims) {
    if (a.playState === "running" || a.playState === "finished") continue;
    if (atEnd(a)) a.finish();
    else a.play();
  }
};
const hold = (anims: Animation[]) => {
  for (const a of anims) if (a.playState === "running") a.pause();
};

const targetOf = (a: Animation) =>
  a.effect instanceof KeyframeEffect ? (a.effect.target ?? null) : null;

// How long the theatre may wait for the code face before it plays anyway.
const FONT_WAIT = 1500;
// The page has settled by then (motion.md §3): the theatre never overlaps
// the load.
const NOT_BEFORE = 1000;

// The hero's clock (motion.md §4). The theatre is CSS animations inside
// #review (13-hero-run.css), held paused until this mounts; from then on
// this owns them through the Web Animations API, so nothing else ever
// touches their play state. It plays them once the code is at least 60 %
// in view, the page has settled, the code face is in (or 1.5 s have
// passed), the Pull request tab is selected and the document is visible;
// it pauses whenever one of those stops holding and resumes where it
// stopped. Replay rewinds them. Without motion (html.mo) the review is
// already finished and this only says so.
//
// It also links the comment and line 42 on hover (data-linked).
export function ReviewClock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: (() => void)[] = [linkedHover(root)];
    const html = document.documentElement;
    const motion =
      html.classList.contains("mo") &&
      matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!motion) {
      root.dataset.clock = "done";
      return () => {
        for (const c of cleanups) c();
      };
    }

    const anims = root.getAnimations({ subtree: true });
    for (const a of anims) a.pause();
    root.dataset.clock = "ready";

    const code = root.querySelector<HTMLElement>(".code");
    const pane = root.closest<HTMLElement>("[role='tabpanel']");
    const hero = root.closest(".hero");
    let inView = false;
    let settled = false;
    let fontIn = false;
    let started = false;
    let cycle = 0;

    const selected = () => !pane?.hasAttribute("data-inactive");
    const shown = () => document.visibilityState === "visible";
    const done = () => root.dataset.clock === "done";

    const watchDone = () => {
      const mine = ++cycle;
      Promise.all(anims.map((a) => a.finished)).then(
        () => {
          if (mine === cycle) root.dataset.clock = "done";
        },
        () => {},
      );
    };

    const update = () => {
      if (done()) return;
      const go = inView && settled && fontIn && selected() && shown();
      if (go) {
        if (!started) {
          started = true;
          watchDone();
        }
        resume(anims);
        root.dataset.clock = "play";
      } else if (started) {
        hold(anims);
        root.dataset.clock = "paused";
      }
    };

    // The page has settled: the hero's entrance (the desk's settle, the
    // copy's rise) is over, and a second has passed since navigation.
    const settle =
      hero
        ?.getAnimations({ subtree: true })
        .filter((a) => a.playState !== "finished" && !root.contains(targetOf(a))) ?? [];
    const wait = Math.max(0, NOT_BEFORE - performance.now());
    const timer = window.setTimeout(() => {
      Promise.all(settle.map((a) => a.finished.catch(() => {}))).then(() => {
        settled = true;
        update();
      });
    }, wait);
    cleanups.push(() => window.clearTimeout(timer));

    const family = code ? getComputedStyle(code).fontFamily.split(",")[0]?.trim() : "";
    const fontTimer = window.setTimeout(() => {
      fontIn = true;
      update();
    }, FONT_WAIT);
    cleanups.push(() => window.clearTimeout(fontTimer));
    if (family) {
      document.fonts.load(`13px ${family}`).then(
        () => {
          fontIn = true;
          update();
        },
        () => {},
      );
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        const tall = (e.rootBounds?.height ?? innerHeight) * 0.6;
        inView = e.intersectionRatio >= 0.6 || e.intersectionRect.height >= tall;
        update();
      },
      { threshold: [0, 0.3, 0.6, 0.8, 1] },
    );
    if (code) io.observe(code);
    cleanups.push(() => io.disconnect());

    const tabs = new MutationObserver(update);
    if (pane) tabs.observe(pane, { attributes: true, attributeFilter: ["data-inactive"] });
    cleanups.push(() => tabs.disconnect());

    document.addEventListener("visibilitychange", update);
    cleanups.push(() => document.removeEventListener("visibilitychange", update));

    const replay = (event: MouseEvent) => {
      if (!(event.target as Element).closest("[data-replay]")) return;
      for (const a of anims) {
        a.currentTime = 0;
        a.play();
      }
      started = true;
      root.dataset.clock = "play";
      watchDone();
      update();
    };
    root.addEventListener("click", replay);
    cleanups.push(() => root.removeEventListener("click", replay));

    return () => {
      for (const c of cleanups) c();
    };
  }, []);

  return (
    <div className="review" id="review" data-pen="clock" data-clock="idle" ref={ref}>
      {children}
    </div>
  );
}

// Pointer over the comment or the line it anchors links the two: the marks
// thicken, the band darkens, the comment's ring deepens (13-hero-run.css).
function linkedHover(root: HTMLElement): () => void {
  if (!matchMedia("(hover: hover)").matches) return () => {};
  const linkedTarget = (target: EventTarget | null) =>
    target instanceof Element && !!target.closest(".comment, .ln[data-anchor]");
  const over = (e: PointerEvent) => {
    if (linkedTarget(e.target)) root.dataset.linked = "";
  };
  const out = (e: PointerEvent) => {
    if (linkedTarget(e.target) && !linkedTarget(e.relatedTarget)) delete root.dataset.linked;
  };
  root.addEventListener("pointerover", over);
  root.addEventListener("pointerout", out);
  return () => {
    root.removeEventListener("pointerover", over);
    root.removeEventListener("pointerout", out);
  };
}
