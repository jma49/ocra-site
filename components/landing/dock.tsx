"use client";

import { useEffect, useState } from "react";
import type { Copy } from "@/lib/copy";
import { cloudUrl } from "@/lib/shared";

const INSTALL = "npm install -g @open-cr-agent/cli";

// Follows the reader once the hero has scrolled away, and steps aside for the
// final call to action, which repeats the same choice.
export function Dock({ copy: labels }: { copy: Copy["dock"] }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Observers instead of a scroll handler: no layout reads per scroll event.
  // The hero counts as gone once it is above the viewport; the final call
  // to action counts as near once its top enters the bottom tenth.
  useEffect(() => {
    const hero = document.getElementById("hero");
    const final = document.getElementById("final");
    if (!hero || !final) return;
    const state = { heroGone: false, finalNear: false };
    const watch = (
      el: HTMLElement,
      rootMargin: string,
      update: (entry: IntersectionObserverEntry) => void,
    ) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          update(entry);
          setShown(state.heroGone && !state.finalNear);
        },
        { rootMargin },
      );
      io.observe(el);
      return io;
    };
    const observers = [
      watch(hero, "0px", (e) => {
        state.heroGone = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      }),
      watch(final, "0px 0px -10% 0px", (e) => {
        state.finalNear = e.isIntersecting || e.boundingClientRect.top < 0;
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
