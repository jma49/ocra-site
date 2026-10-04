"use client";

import { useEffect, useState } from "react";
import { cloudUrl } from "@/lib/shared";

const INSTALL = "npm install -g @open-cr-agent/cli";

// Follows the reader once the hero has scrolled away, and steps aside for the
// final call to action, which repeats the same choice.
export function Dock({
  copy: labels,
}: {
  copy: { start: string; copy: string; copied: string };
}) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const final = document.getElementById("final");
    const onScroll = () => {
      if (!hero || !final) return;
      setShown(
        hero.getBoundingClientRect().bottom < 0 &&
          final.getBoundingClientRect().top > innerHeight * 0.9,
      );
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
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
    <div className="dock" data-shown={shown} inert={!shown}>
      <code>{INSTALL}</code>
      <button type="button" className="copy" onClick={copy}>
        {copied ? labels.copied : labels.copy}
      </button>
      <a className="btn btn-dark btn-sm" href={cloudUrl}>
        {labels.start} <i>&rarr;</i>
      </a>
    </div>
  );
}
