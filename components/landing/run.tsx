"use client";

import { useState } from "react";
import { Window } from "@/components/aqua/window";
import { cn } from "@/lib/cn";
import type { Copy, StageKind } from "@/lib/copy";
import { Heading, Section } from "./section";

const dot: Record<StageKind, string> = {
  code: "bg-[var(--aqua-accent)]",
  model: "bg-[#9b59d0]",
  planned: "border border-current opacity-60",
};

// A Finder-style window: stages in a source list, the chosen one on the right.
export function Run({ copy }: { copy: Copy["run"] }) {
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      copy.stages.findIndex((s) => s.name === "Review"),
    ),
  );
  const stage = copy.stages[active] ?? copy.stages[0];
  if (!stage) return null;

  return (
    <Section id="how-it-works">
      <Heading title={copy.title} body={copy.body} />
      <Window
        title={copy.window}
        bodyClassName="grid gap-2 p-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      >
        <ol className="inset py-1 text-[13px]">
          {copy.stages.map((s, i) => {
            const selected = i === active;
            return (
              <li key={s.name}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex w-full items-baseline gap-3 px-3 py-1.5 text-left",
                    selected ? "row-selected" : "hover:bg-black/5",
                  )}
                >
                  <span
                    className={cn(
                      "w-5 font-mono text-[11px]",
                      !selected && "text-[var(--aqua-dim)]",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "font-bold",
                        s.kind === "planned" && !selected && "opacity-60",
                      )}
                    >
                      {s.name}
                    </span>
                    <span
                      className={cn(
                        "ml-2",
                        selected ? "text-white/85" : "text-[var(--aqua-dim)]",
                      )}
                    >
                      {s.summary}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "size-2 shrink-0 translate-y-[-1px] rounded-full",
                      selected ? "bg-white" : dot[s.kind],
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ol>
        <div className="inset flex flex-col p-6" aria-live="polite">
          <p className="flex items-center gap-2 text-xs text-[var(--aqua-dim)]">
            <span className={cn("size-2 rounded-full", dot[stage.kind])} />
            {copy.legend[stage.kind]}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-[-0.02em]">
            {stage.name}
          </p>
          <p className="mt-3 leading-relaxed text-[var(--aqua-dim)]">
            {stage.detail}
          </p>
          <div className="groove mt-auto flex flex-wrap gap-5 pt-4 text-xs text-[var(--aqua-dim)]">
            {(Object.keys(dot) as StageKind[])
              .filter((kind) => copy.stages.some((s) => s.kind === kind))
              .map((kind) => (
                <span key={kind} className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", dot[kind])} />
                  {copy.legend[kind]}
                </span>
              ))}
          </div>
        </div>
      </Window>
    </Section>
  );
}
