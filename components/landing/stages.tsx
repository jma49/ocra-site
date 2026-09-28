"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Reveal } from "./reveal";
import { Heading } from "./section";
import { KindMark, StageFigure } from "./stage-figures";

// The pipeline as four groups of stages in a row that scrolls sideways and
// runs off the right edge of the page: swipe or scroll it, use the arrows,
// or jump with the numbers, which light up for the cards in view. The heading
// column lines up with the page column.
export function Stages({ copy }: { copy: Copy["run"] }) {
  const track = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState<boolean[]>(() =>
    copy.groups.map((_, i) => i < 2),
  );

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const cards = Array.from(list.children);
    const observer = new IntersectionObserver(
      (entries) => {
        setInView((current) => {
          const next = [...current];
          for (const entry of entries) {
            const i = cards.indexOf(entry.target);
            if (i >= 0) next[i] = entry.intersectionRatio >= 0.6;
          }
          return next;
        });
      },
      { root: list, threshold: [0, 0.6, 1] },
    );
    for (const card of cards) observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (index: number) => {
    const list = track.current;
    const card = list?.children[index] as HTMLElement | undefined;
    if (!list || !card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    list.scrollTo({
      left: card.offsetLeft - list.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  };
  const first = inView.indexOf(true);
  const last = inView.lastIndexOf(true);
  const [before, after] = copy.title.split("{command}");
  const arrow =
    "btn-outline focus-ring size-10 justify-center px-0 disabled:pointer-events-none disabled:opacity-40";

  return (
    <section id="how-it-works" className="overflow-hidden">
      <Reveal>
        <div className="grid gap-12 py-16 pl-4 sm:pl-[max(2rem,calc((100%-72rem)/2+2rem))] md:py-24 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
          <div className="flex flex-col justify-center gap-8 pr-4 sm:pr-8 lg:pr-0">
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={copy.previous}
                disabled={first <= 0}
                onClick={() => scrollTo(Math.max(0, first - 1))}
                className={arrow}
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label={copy.next}
                disabled={last >= copy.groups.length - 1}
                onClick={() =>
                  scrollTo(Math.min(copy.groups.length - 1, first + 1))
                }
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
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "focus-ring h-10 rounded-md px-1.5 font-mono text-sm transition-colors",
                      inView[i]
                        ? "text-accent"
                        : "text-fg-subtle hover:text-fg",
                    )}
                  >
                    [{String(i).padStart(2, "0")}]
                  </button>
                ))}
              </div>
            </div>
          </div>
          <ol
            ref={track}
            aria-label={copy.region}
            className="no-scrollbar relative m-0 flex min-w-0 snap-x snap-mandatory list-none gap-6 overflow-x-auto p-0 pr-4 pb-2 sm:pr-8"
          >
            {copy.groups.map((group, i) => (
              <li
                key={group.title}
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
      </Reveal>
    </section>
  );
}
