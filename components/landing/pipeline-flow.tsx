"use client";

import { Check, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy, StageKind } from "@/lib/copy";

type Flow = Copy["run"]["flow"];
type Reason = keyof Flow["reasons"];

// The example run, step by step: which files or findings are on screen and
// what happened to each. Steps 0–3 are about files, 4–9 about findings.
// Removed items stay visible, struck through, with the reason.
const FILES = [
  "src/auth/session.ts",
  "src/auth/token.ts",
  "src/api/login.ts",
  "docs/auth.md",
  "package-lock.json",
] as const;
const BUNDLES = [
  {
    files: [0, 1, 2],
    reviewers: ["correctness", "security", "performance"],
    skipped: false,
  },
  { files: [3], reviewers: ["correctness"], skipped: true },
];
const FINDINGS = [
  {
    title: "Every session is treated as expired",
    reviewer: "correctness",
    severity: "critical",
    at: "session.ts:42",
  },
  {
    title: "Expiry compares seconds with milliseconds",
    reviewer: "security",
    severity: "warning",
    at: "session.ts:42",
  },
  {
    title: "Token stays valid after logout",
    reviewer: "security",
    severity: "warning",
    at: "token.ts:31",
  },
  {
    title: "user may be undefined",
    reviewer: "correctness",
    severity: "warning",
    at: "login.ts:17",
  },
];
// When each removed finding goes, and why.
const DROPPED: Record<number, { step: number; reason: Reason }> = {
  3: { step: 6, reason: "memory" },
  2: { step: 7, reason: "disproved" },
  1: { step: 8, reason: "merged" },
};
const VERIFY_STEP = 7;
const FILE_STEPS = 4;
const STEPS = 10;
const STEP_MS = 3200;

const shape: Record<StageKind, string> = {
  code: "rounded-[2px] bg-current",
  model: "rounded-full border-[1.5px] border-current",
  planned: "rounded-full border border-dashed border-current",
};

function Tag({
  tone,
  children,
}: {
  tone: "drop" | "ok" | "info";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-px font-sans text-[11px]",
        tone === "drop" &&
          "border border-dashed border-[var(--border-strong)] text-[var(--fg-muted)]",
        tone === "ok" && "verified",
        tone === "info" &&
          "border border-[var(--border)] text-[var(--fg-muted)]",
      )}
    >
      {tone === "drop" ? <X className="size-3" /> : null}
      {tone === "ok" ? <Check className="size-3" /> : null}
      {children}
    </span>
  );
}

function Files({ step, copy }: { step: number; copy: Flow }) {
  if (step >= 2) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {BUNDLES.map((bundle, b) => (
          <div
            key={bundle.files.join()}
            className="rounded-lg border border-[var(--border)] p-3"
          >
            <p className="font-mono text-[11px] text-[var(--fg-subtle)]">
              {copy.bundle} {b + 1}
            </p>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {bundle.files.map((f) => (
                <li key={f}>{FILES[f]}</li>
              ))}
            </ul>
            {step >= 3 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {bundle.reviewers.map((r) => (
                  <Tag key={r} tone="info">
                    {r}
                  </Tag>
                ))}
                {bundle.skipped ? (
                  <Tag tone="drop">security, performance · {copy.skipped}</Tag>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  return (
    <ul className="space-y-1.5 font-mono text-xs">
      {FILES.map((file) => {
        const lock = file === "package-lock.json";
        return (
          <li key={file} className="flex flex-wrap items-center gap-2">
            <span
              className={cn(lock && "text-[var(--fg-subtle)] line-through")}
            >
              {file}
            </span>
            {lock ? <Tag tone="drop">{copy.reasons.lock}</Tag> : null}
          </li>
        );
      })}
      {step >= 1 ? (
        <li className="pt-2">
          <Tag tone="info">{copy.tier}</Tag>
        </li>
      ) : null}
    </ul>
  );
}

function Findings({ step, copy }: { step: number; copy: Flow }) {
  const report = step === STEPS - 1;
  return (
    <ol className="space-y-2">
      {FINDINGS.map((f, i) => {
        const dropped = DROPPED[i];
        const gone = dropped !== undefined && step >= dropped.step;
        if (report && gone) return null;
        return (
          <li
            key={f.title}
            className={cn(
              "rounded-lg border px-3 py-2",
              report && "border-[var(--accent)]",
              !report && !gone && "border-[var(--border)]",
              gone &&
                "border-dashed border-[var(--border-strong)] bg-[var(--bg-subtle)]",
            )}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-mono text-xs text-[var(--fg-subtle)]">
                #{i + 1}
              </span>
              <span
                className={cn(
                  "font-medium",
                  gone && "text-[var(--fg-muted)] line-through",
                )}
              >
                {f.title}
              </span>
              {step >= 5 ? (
                <span className="font-mono text-xs text-[var(--fg-subtle)]">
                  {f.at}
                </span>
              ) : null}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Tag tone="info">{f.reviewer}</Tag>
              <span
                className={cn(
                  "rounded-md px-1.5 py-px text-[11px]",
                  f.severity === "critical"
                    ? "severity-critical"
                    : "border border-[var(--border)] text-[var(--fg-muted)]",
                )}
              >
                {f.severity}
              </span>
              {gone ? (
                <Tag tone="drop">{copy.reasons[dropped.reason]}</Tag>
              ) : null}
              {!gone && step >= VERIFY_STEP ? (
                <Tag tone="ok">{copy.reasons.verified}</Tag>
              ) : null}
            </div>
          </li>
        );
      })}
      {report ? (
        <li className="pt-1 text-sm font-medium">{copy.verdict}</li>
      ) : null}
    </ol>
  );
}

export function PipelineFlow({
  copy,
  stages,
}: {
  copy: Flow;
  stages: { name: string; kind: StageKind; detail: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const labels = [...stages.map((s) => s.name), copy.report];

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setPlaying(true);
    const observer = new IntersectionObserver(
      ([e]) => setInView(!!e?.isIntersecting),
      {
        threshold: 0.35,
      },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % STEPS), STEP_MS);
    return () => clearInterval(timer);
  }, [playing, inView]);

  // On phones the stage list scrolls sideways; keep the current stage in it.
  useEffect(() => {
    const list = strip.current;
    const item = list?.children[step] as HTMLElement | undefined;
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [step]);

  const go = (next: number) => {
    setPlaying(false);
    setStep((next + STEPS) % STEPS);
  };

  return (
    <div ref={ref} className="grid md:grid-cols-[13rem_1fr]">
      <ol
        ref={strip}
        className="relative flex gap-1 overflow-x-auto border-b max-md:[mask-image:linear-gradient(to_right,black_80%,transparent)] border-[var(--border)] p-2 md:flex-col md:overflow-visible md:border-r md:border-b-0"
      >
        {labels.map((label, i) => {
          const kind = stages[i]?.kind;
          return (
            <li key={label} className="shrink-0">
              <button
                type="button"
                aria-pressed={i === step}
                onClick={() => go(i)}
                className={cn(
                  "focus-ring flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-1.5 text-left text-sm transition-colors",
                  i === step && "bg-[var(--fg)] text-[var(--bg)]",
                  i < step && "text-[var(--fg)] hover:bg-[var(--bg-subtle)]",
                  i > step &&
                    "text-[var(--fg-subtle)] hover:bg-[var(--bg-subtle)]",
                )}
              >
                <span className="w-5 font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{label}</span>
                {kind ? (
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0", shape[kind])}
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="flex min-w-0 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-mono text-xs text-[var(--fg-subtle)]">
            {copy.label} · {step < FILE_STEPS ? copy.files : copy.findings}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="btn-outline btn-sm"
              aria-label={copy.previous}
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="btn-outline btn-sm"
              aria-label={playing ? copy.pause : copy.play}
            >
              {playing ? (
                <Pause className="size-3" />
              ) : (
                <Play className="size-3" />
              )}
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              className="btn-outline btn-sm"
              aria-label={copy.next}
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
        {/* Every step is laid out in the same cell and only the current one
            is visible, so the panel is as tall as the tallest step and does
            not jump while the run plays. */}
        <div className="mt-4 grid flex-1 [&>*]:[grid-area:1/1]">
          {labels.map((label, i) => (
            <div
              key={label}
              aria-hidden={i !== step}
              className={cn("flex flex-col", i !== step && "invisible")}
            >
              <h3 className="text-xl font-semibold tracking-[-0.02em]">
                {label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
                {copy.captions[i]}
              </p>
              <div className="mt-5 pb-5">
                {i < FILE_STEPS ? (
                  <Files step={i} copy={copy} />
                ) : (
                  <Findings step={i} copy={copy} />
                )}
              </div>
              {stages[i] ? (
                <p className="mt-auto border-t border-[var(--border)] pt-4 text-xs leading-relaxed text-[var(--fg-subtle)]">
                  {stages[i].detail}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="mt-4 h-0.5 overflow-hidden rounded-full bg-[var(--border)]"
        >
          <div
            className="h-full bg-[var(--accent)] transition-[width] duration-500"
            style={{ width: `${((step + 1) / STEPS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
