"use client";

import { useEffect, useState } from "react";
import type { Copy } from "@/lib/copy";
import { cloudUrl } from "@/lib/shared";

const INSTALL = "npm install -g @open-cr-agent/cli";
const FAR = "100000px";

// Follows the reader once the hero has scrolled away, and steps aside from the
// plans on, which carry the same choice themselves (as does the final call to
// action), so it never sits over a price.
export function Dock({ copy: labels }: { copy: Copy["dock"] }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Observers instead of a scroll handler: no layout reads per scroll event.
  // Each root is stretched far past one edge of the viewport so that its
  // answer flips at a single line, whichever way the page moves and however
  // far a jump (a nav link, Home) skips: the hero is gone once its bottom is
  // above the viewport, and the plans are reached once their top is above
  // the bottom tenth.
  useEffect(() => {
    const hero = document.getElementById("hero");
    const plans = document.getElementById("plans");
    if (!hero || !plans) return;
    const state = { heroGone: false, plansReached: false };
    const watch = (
      el: HTMLElement,
      rootMargin: string,
      update: (entry: IntersectionObserverEntry) => void,
    ) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          update(entry);
          setShown(state.heroGone && !state.plansReached);
        },
        { rootMargin },
      );
      io.observe(el);
      return io;
    };
    const observers = [
      watch(hero, `0px 0px ${FAR} 0px`, (e) => {
        state.heroGone = !e.isIntersecting;
      }),
      watch(plans, `${FAR} 0px -10% 0px`, (e) => {
        state.plansReached = e.isIntersecting;
      }),
    ];
    return () => {
      for (const io of observers) io.disconnect();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="dock" aria-label={labels.label} data-shown={shown} inert={!shown}>
      <code>{INSTALL}</code>
      <button type="button" className="copy" onClick={copy}>
        {copied ? labels.copied : labels.copy}
      </button>
      <a className="btn btn-dark btn-sm" href={cloudUrl}>
        {labels.start} <i>&rarr;</i>
      </a>
    </aside>
  );
}
