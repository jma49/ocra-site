"use client";

import { useEffect, useRef, useState } from "react";
import { SpiderMark } from "@/components/brand/spider-mark";

// Plays the glitch burst once. The spider answers the pointer, so this runs
// with Reduce motion on too; only the idle loops follow that setting.
export function burst(el: Element | null) {
  if (!el) return;
  el.classList.remove("burst");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("burst");
  setTimeout(() => el.classList.remove("burst"), 600);
}

// The page's own event: the demo fix in the hero window landed.
export const FIX_EVENT = "ocra:fix-landed";

// The spider on its thread over the hero window. Click (or Enter) sends it up
// the thread; again brings it back down. The thread shortens and lengthens
// with it.
export function HangingSpider({ up, down }: { up: string; down: string }) {
  const [high, setHigh] = useState(false);
  const spider = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFix = () => setTimeout(() => burst(spider.current), 100);
    window.addEventListener(FIX_EVENT, onFix);
    return () => window.removeEventListener(FIX_EVENT, onFix);
  }, []);

  const toggle = () => {
    burst(spider.current);
    setHigh((h) => !h);
  };

  return (
    <div className="hang" data-high={high}>
      <div className="bob">
        <button
          type="button"
          className="yo"
          aria-label={high ? down : up}
          onPointerEnter={() => burst(spider.current)}
          onClick={toggle}
        >
          <span className="silk" aria-hidden="true" />
          <div ref={spider} className="spider">
            <SpiderMark size={200} dark glitch={2.2} animated />
          </div>
        </button>
      </div>
    </div>
  );
}

// The big spider over the final call to action: the same burst, no thread.
export function BigSpider() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="big spider"
      aria-hidden="true"
      onPointerEnter={() => burst(ref.current)}
    >
      <SpiderMark size={300} dark glitch={2.4} animated />
    </div>
  );
}
