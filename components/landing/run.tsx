"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy, StageKind } from "@/lib/copy";
import { PipelineFlow } from "./pipeline-flow";
import { Heading, Section } from "./section";

// Shape, not colour, tells the kinds apart.
const dot: Record<StageKind, string> = {
  code: "rounded-[2px] bg-[var(--fg)]",
  model: "rounded-full border-[1.5px] border-[var(--fg)]",
  planned: "rounded-full border border-dashed border-[var(--fg-subtle)]",
};

export function Run({ copy }: { copy: Copy["run"] }) {
  const [step, setStep] = useState(0);
  const onStep = useCallback((next: number) => setStep(next), []);
  const stage = copy.stages[Math.min(step, copy.stages.length - 1)];
  if (!stage) return null;

  return (
    <Section id="how-it-works">
      <Heading title={copy.title} body={copy.body} />
      <div className="panel overflow-hidden">
        <PipelineFlow
          copy={copy.flow}
          stages={copy.stages.map((s) => s.name)}
          step={step}
          onStep={onStep}
        />
        <div className="grid gap-6 p-7 md:grid-cols-[14rem_1fr]">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs text-[var(--fg-subtle)]">
              <span aria-hidden className={cn("size-2", dot[stage.kind])} />
              {copy.legend[stage.kind]}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
              {stage.name}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {stage.summary}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="leading-relaxed text-[var(--fg-muted)]">
              {stage.detail}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-[var(--fg-subtle)]">
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
      </div>
    </Section>
  );
}
