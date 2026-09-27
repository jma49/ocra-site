"use client";

import { Check, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";

type TokenState = "file" | "finding" | "anchored" | "confirmed" | "leaving";

// What sits at each step of the example run, keyed by token id. A token
// marked "leaving" fades out at that step and is gone from the next one.
// Files flow until Matrix; findings appear at Review.
const SCRIPT: Record<string, TokenState>[] = [
  { a: "file", b: "file", c: "file", d: "file", lock: "leaving" },
  { a: "file", b: "file", c: "file", d: "file" },
  { a: "file", b: "file", c: "file", d: "file" },
  { a: "file", b: "file", c: "file", d: "file" },
  { f1: "finding", f2: "finding", f3: "finding", f4: "finding" },
  { f1: "anchored", f2: "anchored", f3: "anchored", f4: "anchored" },
  { f1: "anchored", f2: "anchored", f3: "anchored", f4: "leaving" },
  { f1: "confirmed", f2: "confirmed", f3: "leaving" },
  { f1: "confirmed", f2: "leaving" },
  { f1: "confirmed" },
];
const STEP_MS = 1600;
const END_PAUSE_MS = 3200;

function Token({ id, state }: { id: string; state: TokenState }) {
  const square = id === "lock" || /^[a-d]$/.test(id);
  return (
    <span
      className={cn(
        "flow-token flex size-[18px] items-center justify-center",
        square ? "rounded-[3px]" : "rounded-full",
        state === "file" && "bg-[var(--fg-muted)]",
        state === "finding" && "border-[1.5px] border-[var(--fg)]",
        state === "anchored" && "bg-[var(--fg)]",
        state === "confirmed" && "bg-[var(--accent)] text-[var(--bg)]",
        state === "leaving" &&
          "flow-token-leaving border-[1.5px] border-[var(--fg-subtle)]",
      )}
    >
      {state === "confirmed" ? (
        <Check strokeWidth={3} className="size-3" />
      ) : null}
    </span>
  );
}

export function PipelineFlow({
  copy,
  stages,
  step,
  onStep,
}: {
  copy: Copy["run"]["flow"];
  stages: string[];
  step: number;
  onStep: (step: number, playing: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const columns = stages.length + 1;
  const tokens = SCRIPT[step] ?? {};

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced) setPlaying(true);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      {
        threshold: 0.4,
      },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const last = step >= SCRIPT.length - 1;
    const timer = setTimeout(
      () => onStep(last ? 0 : step + 1, true),
      last ? END_PAUSE_MS : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, inView, step, onStep]);

  const labels = [...stages, copy.report];
  return (
    <div ref={ref} className="border-b border-[var(--border)]">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 text-xs text-[var(--fg-subtle)]">
        <span className="font-mono">{copy.label}</span>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="btn-outline btn-sm"
          aria-label={playing ? copy.pause : copy.play}
        >
          {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
          {playing ? copy.pause : copy.play}
        </button>
      </div>
      <div className="overflow-x-auto px-3 pb-5">
        <div className="min-w-[720px]">
          <div className="relative h-20" aria-hidden>
            <div
              className="flow-cluster absolute top-1/2 flex max-w-[6.5rem] -translate-x-1/2 -translate-y-1/2 flex-wrap justify-center gap-1.5"
              style={{ left: `${((step + 0.5) / columns) * 100}%` }}
            >
              {Object.entries(tokens).map(([id, state]) => (
                <Token key={id} id={id} state={state} />
              ))}
            </div>
          </div>
          <ol
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {labels.map((label, i) => (
              <li key={label} className="flex flex-col items-center gap-2">
                <span
                  aria-hidden
                  className="relative flex h-3 w-full items-center justify-center"
                >
                  <span
                    className={cn(
                      "absolute inset-x-0 h-px",
                      i <= step
                        ? "bg-[var(--fg)]"
                        : "bg-[var(--border-strong)]",
                    )}
                  />
                  <span
                    className={cn(
                      "relative size-2.5 rounded-full border-[1.5px]",
                      i < step && "border-[var(--fg)] bg-[var(--fg)]",
                      i === step &&
                        "border-[var(--accent)] bg-[var(--bg)] ring-4 ring-[var(--accent-soft)]",
                      i > step &&
                        "border-[var(--border-strong)] bg-[var(--bg)]",
                    )}
                  />
                </span>
                <button
                  type="button"
                  aria-pressed={i === step}
                  onClick={() => {
                    setPlaying(false);
                    onStep(i, false);
                  }}
                  className={cn(
                    "focus-ring rounded-[6px] px-1.5 py-1 text-xs transition-colors",
                    i === step
                      ? "bg-[var(--fg)] text-[var(--bg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="min-h-[3.5rem] px-5 pb-5 text-sm leading-relaxed text-[var(--fg-muted)]">
        {copy.captions[step]}
      </p>
    </div>
  );
}
