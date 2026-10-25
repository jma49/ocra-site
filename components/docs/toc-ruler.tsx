"use client";

import { type TOCItemInfo, useTOC, useTOCListener } from "fumadocs-core/toc";
import { useCallback, useEffect, useRef } from "react";
import { LookingEyes } from "@/components/brand/eyes-mark";

// The table of contents is a reading ruler: a scale down its edge and the eye
// row riding it to the heading being read (app/docs.css, `.toc-ruler`).
// Fumadocs marks the active links; this only measures them and moves the eyes
// with a transform. On the way the pupils look where they are going, and
// they blink once on arrival. Desktop only: the table sits beside the sheet
// from 1280 px (xl).
export function TocRuler() {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  const activeUrl = useRef<string | undefined>(undefined);

  const place = useCallback(() => {
    const ruler = ref.current;
    const toc = ruler?.parentElement;
    if (!ruler || !toc) return;
    const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const head = links[0];
    const tail = links.at(-1);
    if (!head || !tail) return;
    const box = toc.getBoundingClientRect();
    const first = head.getBoundingClientRect();
    const end = tail.getBoundingClientRect();
    ruler.style.setProperty("--ruler-top", `${first.top - box.top}px`);
    ruler.style.setProperty("--ruler-h", `${end.bottom - first.top}px`);
    const active = links.find((a) => a.getAttribute("href") === activeUrl.current);
    const row = (active ?? head).getBoundingClientRect();
    const y = Math.round(row.top - first.top + Math.min(row.height, 30) / 2);
    if (y === last.current) return;
    const travel = last.current === null ? 0 : Math.sign(y - last.current);
    last.current = y;
    ruler.style.setProperty("--eye-y", `${y}px`);
    for (const t of timers.current) window.clearTimeout(t);
    ruler.style.setProperty("--py", String(travel));
    ruler.dataset.blink = "false";
    if (travel === 0) return;
    timers.current = [
      window.setTimeout(() => ruler.style.setProperty("--py", "0"), 420),
      window.setTimeout(() => {
        ruler.dataset.blink = "true";
      }, 520),
    ];
  }, []);

  const anchors = useTOC();
  const follow = useCallback(
    (items: TOCItemInfo[]) => {
      activeUrl.current = items.find((item) => item.active)?.original.url;
      place();
    },
    [place],
  );
  useTOCListener(follow);

  useEffect(() => {
    const ruler = ref.current;
    const toc = ruler?.parentElement;
    if (!ruler || !toc) return;
    const observer = new ResizeObserver(place);
    observer.observe(toc);
    follow(anchors.get());
    ruler.dataset.ready = "";
    return () => {
      observer.disconnect();
      for (const t of timers.current) window.clearTimeout(t);
    };
  }, [place, follow, anchors]);

  return (
    <div ref={ref} className="toc-ruler" aria-hidden="true">
      <div className="toc-ruler-scale" />
      <div className="toc-ruler-tab">
        <LookingEyes size={30} className="toc-ruler-eyes" />
      </div>
    </div>
  );
}
