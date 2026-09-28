"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { DemoVideo } from "./demo-video";
import { Reveal } from "./reveal";
import { Heading } from "./section";
import { KindMark, StageFigure } from "./stage-figures";

// The pipeline as four groups of stages. The heading and the cards form one
// row that scrolls sideways as a whole, starting at the page column: swipe
// or scroll it, or use the arrows and numbers below it, which stay put. The
// numbers light up for the cards in view.
export function Stages({
  copy,
  locale,
}: {
  copy: Copy["run"];
  locale: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [inView, setInView] = useState<boolean[]>(() =>
    copy.groups.map((_, i) => i === 0),
  );
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const items = cards.current.filter((c): c is HTMLLIElement => c !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        setInView((current) => {
          const next = [...current];
          for (const entry of entries) {
            const i = items.indexOf(entry.target as HTMLLIElement);
            if (i >= 0) next[i] = entry.intersectionRatio >= 0.6;
          }
          return next;
        });
      },
      { root: el, threshold: [0, 0.6, 1] },
    );
    for (const item of items) observer.observe(item);
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Snap points: the start of the row (the heading), then each card, each
  // aligned with the page column.
  const stops = () => {
    const el = row.current;
    if (!el) return [];
    const pad = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const origin = el.getBoundingClientRect().left - el.scrollLeft + pad;
    return [
      0,
      ...cards.current.map((card) =>
        card ? card.getBoundingClientRect().left - origin : 0,
      ),
    ];
  };
  const go = (left: number) => {
    row.current?.scrollTo({ left, behavior: "smooth" });
  };
  const step = (direction: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const points = stops();
    const here = el.scrollLeft;
    const target =
      direction > 0
        ? points.find((p) => p > here + 2)
        : [...points].reverse().find((p) => p < here - 2);
    go(target ?? (direction > 0 ? el.scrollWidth : 0));
  };

  const [before, after] = copy.title.split("{command}");
  const arrow =
    "btn-outline focus-ring size-10 justify-center px-0 disabled:pointer-events-none disabled:opacity-40";

  return (
    <section id="how-it-works">
      <Reveal>
        <div className="py-16 [--column:1rem] sm:[--column:max(2rem,calc((100%-72rem)/2+2rem))] md:py-24">
          <div
            ref={row}
            className="no-scrollbar flex snap-x snap-mandatory scroll-pl-[var(--column)] items-stretch gap-6 overflow-x-auto px-[var(--column)] pb-2 lg:gap-14"
          >
            <div className="flex w-[min(22rem,85vw)] shrink-0 snap-start flex-col justify-center gap-8">
              <Heading
                index={1}
                title={
                  <>
                    {before}
                    <span className="font-mono font-medium tracking-[-0.04em] text-accent">
                      ocra review
                    </span>
                    {after}
                  </>
                }
                body={copy.body}
                className="mb-0"
              />
              <p className="flex gap-5 font-mono text-xs text-fg-muted">
                <span className="flex items-center gap-2">
                  <KindMark kind="code" />
                  {copy.legend.code}
                </span>
                <span className="flex items-center gap-2">
                  <KindMark kind="model" />
                  {copy.legend.model}
                </span>
              </p>
            </div>
            <ol
              aria-label={copy.region}
              className="m-0 flex list-none gap-6 p-0"
            >
              {copy.groups.map((group, i) => (
                <li
                  key={group.title}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="flex w-[min(26rem,85vw)] shrink-0 snap-start flex-col gap-3"
                >
                  <span className="font-mono text-sm text-accent">
                    [{String(i).padStart(2, "0")}]
                  </span>
                  <h3 className="min-h-[3.25rem] text-title font-semibold">
                    {group.title}
                  </h3>
                  <StageFigure
                    index={i}
                    stages={group.stages}
                    example={copy.example}
                    words={copy.figures}
                  />
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-fg-muted">
                    {group.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8 flex items-center gap-2 px-[var(--column)]">
            <button
              type="button"
              aria-label={copy.previous}
              disabled={edge.start}
              onClick={() => step(-1)}
              className={arrow}
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              disabled={edge.end}
              onClick={() => step(1)}
              className={arrow}
            >
              <ArrowRight className="size-4" />
            </button>
            <div className="ml-2 flex">
              {copy.groups.map((group, i) => (
                <button
                  key={group.title}
                  type="button"
                  aria-label={group.title}
                  aria-current={inView[i] ? "true" : undefined}
                  onClick={() => go(stops()[i + 1] ?? 0)}
                  className={cn(
                    "focus-ring h-10 rounded-md px-1.5 font-mono text-sm transition-colors",
                    inView[i] ? "text-accent" : "text-fg-subtle hover:text-fg",
                  )}
                >
                  [{String(i).padStart(2, "0")}]
                </button>
              ))}
            </div>
          </div>
          <div className="mt-14 px-[var(--column)] md:mt-20">
            <DemoVideo copy={copy.demo} locale={locale} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
