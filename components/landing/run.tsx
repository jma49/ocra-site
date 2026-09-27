"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy, StageKind } from "@/lib/copy";
import { Heading, Section } from "./section";

// Shape, not colour, tells the kinds apart.
const dot: Record<StageKind, string> = {
  code: "rounded-[2px] bg-[var(--fg)]",
  model: "rounded-full border-[1.5px] border-[var(--fg)]",
  planned: "rounded-full border border-dashed border-[var(--fg-subtle)]",
};

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
      <div className="panel grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <ol className="border-b border-[var(--border)] p-2 md:border-r md:border-b-0">
          {copy.stages.map((s, i) => {
            const selected = i === active;
            return (
              <li key={s.name}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(i)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-left text-sm transition-colors",
                    selected
                      ? "bg-[var(--color-fd-muted)]"
                      : "hover:bg-[var(--bg-subtle)]",
                  )}
                >
                  <span className="w-6 font-mono text-[11px] text-[var(--fg-subtle)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-2 text-[var(--fg-muted)]">
                      {s.summary}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0", dot[s.kind])}
                  />
                  <span className="sr-only">{copy.legend[s.kind]}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col p-7" aria-live="polite">
          <p className="flex items-center gap-2 font-mono text-xs text-[var(--fg-subtle)]">
            <span aria-hidden className={cn("size-2", dot[stage.kind])} />
            {copy.legend[stage.kind]}
          </p>
          <p className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
            {stage.name}
          </p>
          <p className="mt-3 leading-relaxed text-[var(--fg-muted)]">
            {stage.detail}
          </p>
          <div className="mt-auto flex flex-wrap gap-5 border-t border-[var(--border)] pt-4 text-xs text-[var(--fg-subtle)] max-md:mt-8">
            {(Object.keys(dot) as StageKind[])
              .filter((kind) => copy.stages.some((s) => s.kind === kind))
              .map((kind) => (
                <span key={kind} className="flex items-center gap-2">
                  <span aria-hidden className={cn("size-2", dot[kind])} />
                  {copy.legend[kind]}
                </span>
              ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
