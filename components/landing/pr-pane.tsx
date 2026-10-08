"use client";

import { type HTMLAttributes, useCallback, useEffect, useReducer, useRef } from "react";
import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { BotAvatar, FindingComment } from "./session-code";

const { pr, files, usage, outcome } = exampleRun;
const excluded = files.filter((f) => !f.selected).length;

// ocra's summary comment as the GitHub Action posts it for this run, from
// renderSummary in the engine's packages/vcs-platform/src/render.ts. The
// comment is the engine's own text, in English in every language, like the
// inline comment's labels. Left out: the override hint and the run id, which
// name a commit and a run this recording does not have.
const SUMMARY = {
  heading: "ocra review · 🛑 Significant concerns",
  counts: `${outcome.verified} finding(s)`,
  countsRest: "(1 critical, 0 warning, 0 suggestion) · risk tier",
  disclaimer:
    "The verdict is advice from language models that read the change itself, and can be swayed by text in it. Do not use it as a security gate.",
  coverage: `${exampleRun.changedFiles} reviewed · 0 unchanged since the last review · 0 not reviewed · ${excluded} excluded · ${usage.input} in / ${usage.output} out tokens · $${usage.dollars.toFixed(4)}`,
};

// What the pane shows at one moment of the replay.
interface Frame {
  running: boolean;
  summary: boolean;
  finding: boolean;
}

const DONE: Frame = { running: false, summary: true, finding: true };

const TIMELINE: [number, Partial<Frame>][] = [
  [0, { running: true, summary: false, finding: false }],
  [1500, { running: false, summary: true }],
  [2300, { finding: true }],
];

// The pull request as ocra leaves it, replayed when it scrolls into view:
// the check runs, then the summary and the inline comment arrive.
export function PrPane({
  copy,
  panel,
}: {
  copy: Copy["window"]["pr"];
  panel: HTMLAttributes<HTMLDivElement>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [frame, update] = useReducer(
    (current: Frame, patch: Partial<Frame>) => ({ ...current, ...patch }),
    DONE,
  );

  const clear = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);

  const run = useCallback(() => {
    clear();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update(DONE);
      return;
    }
    for (const [ms, patch] of TIMELINE) {
      if (ms === 0) update(patch);
      else timers.current.push(window.setTimeout(() => update(patch), ms));
    }
  }, [clear]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !started) {
          started = true;
          run();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [run, clear]);

  const { running, summary, finding } = frame;
  const s = copy.side;

  return (
    <div ref={root} className="pr" data-state={running ? "running" : "done"} {...panel}>
      <div className="pr-main">
        <div className="pr-title">
          {copy.title} <span>#{pr.number}</span>
        </div>
        <div className="pr-meta">
          <span className="pr-state">Open</span>
          {copy.meta.into} <code>{pr.base}</code> {copy.meta.from} <code>{pr.head}</code> ·{" "}
          {copy.meta.files}
        </div>

        <div className={running ? "event" : "event hide"} aria-hidden={!running}>
          <span className="dot spin" />
          <strong>ocra</strong> {copy.reviewing}
        </div>

        <article className={summary ? "cmt" : "cmt hide"}>
          <header className="cmt-h">
            <BotAvatar />
            <span>
              <strong>github-actions</strong> <span className="bot">bot</span> {copy.reviewed}
            </span>
            {!running && (
              <button type="button" className="replay" onClick={run}>
                {copy.replay}
              </button>
            )}
          </header>
          <div className="md">
            <p className="md-h">{SUMMARY.heading}</p>
            <p>{exampleRun.summary}</p>
            <p>
              <strong>{SUMMARY.counts}</strong> {SUMMARY.countsRest} <code>{exampleRun.tier}</code>
            </p>
            <p>
              <em>{SUMMARY.disclaimer}</em>
            </p>
            <details>
              <summary>Coverage and cost</summary>
              <p>{SUMMARY.coverage}</p>
            </details>
          </div>
        </article>

        <article className={`cmt finding${finding ? "" : " hide"}`}>
          <FindingComment
            variant="pr"
            title={copy.findingTitle}
            body={copy.findingBody}
            onLine={copy.onLine}
            tip={
              <span className="qtip" role="tooltip">
                {copy.quoteTip}
              </span>
            }
          />
        </article>
      </div>
      <aside className="pr-side">
        <p className="side-h">{s.reviewers}</p>
        <div className="chk">
          <BotAvatar small />
          {running ? s.reviewing : s.changes}
        </div>
        <p className="side-h">{s.checks}</p>
        <div className="chk">
          <CheckIcon state="ok" />
          build
        </div>
        <div className="chk">
          <CheckIcon state="ok" />
          test
        </div>
        <div className="chk">
          {running ? <i className="dot spin" /> : <CheckIcon state="bad" />}
          {running ? s.running : s.blocking}
        </div>
        <p className="side-h">{s.files}</p>
        {files
          .filter((f) => s.why[f.id])
          .map((f) => (
            <div
              key={f.id}
              className={f.selected ? "chk file" : "chk file out"}
              data-why={s.why[f.id]}
            >
              {f.path}
            </div>
          ))}
      </aside>
    </div>
  );
}

// A check's status as GitHub draws it: a tick or a cross in a ring.
function CheckIcon({ state }: { state: "ok" | "bad" }) {
  return (
    <svg className={`ci ${state}`} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d={state === "ok" ? "M5 8.2l2 2 4-4.2" : "M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
