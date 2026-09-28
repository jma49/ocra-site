"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Reveal } from "./reveal";
import { KindMark, StageFigure } from "./stage-figures";

// The pipeline as four groups of stages in a row that scrolls sideways:
// swipe or scroll it, use the arrows, or jump with the numbers. The numbers
// light up for the cards in view.
export function Stages({
  copy,
  locale,
}: {
  copy: Copy["run"];
  locale: string;
}) {
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

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="scroll-mt-16"
    >
      <Reveal>
        <div className="mx-auto grid w-full max-w-[90rem] gap-12 py-24 pl-4 sm:pl-8 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-14 lg:py-40">
          <div className="flex flex-col justify-center gap-7 pr-4 sm:pr-8 lg:pr-0">
            <h2
              id="how-title"
              className={cn(
                "whitespace-pre-line font-semibold",
                locale === "zh"
                  ? "text-headline-zh-sm lg:text-[2.5rem]/[1.3]"
                  : "text-balance text-headline-sm lg:text-[2.75rem]/[1.12]",
              )}
            >
              {before}
              <span className="font-mono font-medium tracking-[-0.04em] text-accent">
                ocra review
              </span>
              {after}
            </h2>
            <p className="text-pretty text-lead text-fg-muted">{copy.body}</p>
            <p className="flex gap-5 font-mono text-[0.8125rem] text-fg-muted">
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
                className="focus-ring flex size-11 items-center justify-center border border-border-strong transition-colors enabled:hover:border-fg disabled:text-fg-subtle/60"
              >
                <ArrowLeft className="size-[18px]" />
              </button>
              <button
                type="button"
                aria-label={copy.next}
                disabled={last >= copy.groups.length - 1}
                onClick={() =>
                  scrollTo(Math.min(copy.groups.length - 1, first + 1))
                }
                className="focus-ring flex size-11 items-center justify-center border border-border-strong transition-colors enabled:hover:border-fg disabled:text-fg-subtle/60"
              >
                <ArrowRight className="size-[18px]" />
              </button>
              <div className="ml-3 flex">
                {copy.groups.map((group, i) => (
                  <button
                    key={group.title}
                    type="button"
                    aria-label={group.title}
                    aria-current={inView[i] ? "true" : undefined}
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "focus-ring h-11 px-1.5 font-mono text-[0.8125rem] transition-colors",
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
            className="no-scrollbar relative m-0 flex min-w-0 snap-x snap-mandatory list-none gap-6 overflow-x-auto p-0 pr-4 sm:pr-8"
          >
            {copy.groups.map((group, i) => (
              <li
                key={group.title}
                className="flex w-[min(27.5rem,85vw)] shrink-0 snap-start flex-col gap-3.5"
              >
                <span className="font-mono text-[0.9375rem] font-medium text-accent">
                  [{String(i).padStart(2, "0")}]
                </span>
                <h3 className="min-h-[3.6rem] text-title font-semibold">
                  {group.title}
                </h3>
                <StageFigure
                  index={i}
                  stages={group.stages}
                  example={copy.example}
                  words={copy.figures}
                />
                <p className="text-pretty text-sm leading-relaxed text-fg-muted">
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
