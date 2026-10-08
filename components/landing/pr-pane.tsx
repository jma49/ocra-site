"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { EyesMark } from "@/components/brand/eyes-mark";
import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { FindingComment } from "./session-code";

const STAGES = ["select", "bundle", "review", "verify", "verdict"];
const { pr, files } = exampleRun;
const TOKENS: number = exampleRun.usage.input;
const DOLLARS: number = exampleRun.usage.dollars;

// What the pane shows at one moment of the replay; `cost` is the share of
// the run's cost counted up so far.
interface Frame {
  running: boolean;
  stage: number;
  rows: number;
  finding: boolean;
  cost: number;
}

const DONE: Frame = {
  running: false,
  stage: STAGES.length,
  rows: 4,
  finding: true,
  cost: 1,
};

// The replay as a table: at each time, what changes. The cost counts up
// over COUNT_MS from the moment `count` is set.
const COUNT_MS = 900;
const TIMELINE: [number, Partial<Frame> & { count?: true }][] = [
  [0, { running: true, stage: 0, rows: 0, finding: false, cost: 0 }],
  [500, { rows: 1, stage: 1 }],
  [1100, { rows: 2, stage: 2 }],
  [1900, { finding: true, stage: 3 }],
  [2600, { rows: 3, stage: 4 }],
  [3100, { rows: 4, count: true }],
  // The count runs on to 4000 ms; the verdict lands before it ends.
  [3500, { running: false, stage: STAGES.length }],
];

// The pull request as ocra leaves it, replayed when it scrolls into view:
// stages light up, the summary fills in, the cost counts up.
export function PrPane({
  copy,
  panel,
}: {
  copy: Copy["window"]["pr"];
  panel: HTMLAttributes<HTMLDivElement>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<{ timers: number[]; frame: number }>({
    timers: [],
    frame: 0,
  });
  const [frame, update] = useReducer(
    (current: Frame, patch: Partial<Frame>) => ({ ...current, ...patch }),
    DONE,
  );

  const clear = useCallback(() => {
    for (const t of pending.current.timers) clearTimeout(t);
    cancelAnimationFrame(pending.current.frame);
    pending.current = { timers: [], frame: 0 };
  }, []);

  const count = useCallback(() => {
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / COUNT_MS);
      update({ cost: 1 - (1 - k) ** 3 });
      pending.current.frame = k < 1 ? requestAnimationFrame(step) : 0;
    };
    pending.current.frame = requestAnimationFrame(step);
  }, []);

  const run = useCallback(() => {
    clear();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update(DONE);
      return;
    }
    for (const [ms, { count: counting, ...patch }] of TIMELINE) {
      const apply = () => {
        update(patch);
        if (counting) count();
      };
      if (ms === 0) apply();
      else pending.current.timers.push(window.setTimeout(apply, ms));
    }
  }, [clear, count]);

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

  const { running, stage, rows, finding } = frame;
  const state = running ? "running" : "done";
  const tokens = Math.round(TOKENS * frame.cost);
  const dollars = DOLLARS * frame.cost;
  const head = {
    running: copy.reviewing,
    done: copy.reviewed,
  }[state];
  const v = copy.values;
  const summary: [string, string][] = [
    [copy.rows.reviewed, v.reviewed],
    [copy.rows.tasks, v.tasks],
    [copy.rows.findings, v.findings],
    [copy.rows.cost, `${tokens.toLocaleString("en-US")} ${v.tokens} · $${dollars.toFixed(4)}`],
  ];
  const s = copy.side;
  const busy = running;

  return (
    <div ref={root} className="pr" data-state={state} {...panel}>
      <div className="pr-main">
        <div className="pr-title">
          {copy.title} <span>#{pr.number}</span>
        </div>
        <div className="pr-meta">
          {copy.meta.into} <code>{pr.base}</code> {copy.meta.from} <code>{pr.head}</code> ·{" "}
          {copy.meta.files}
        </div>
        <div className="cmt">
          <div className="cmt-h">
            <span className="av">
              <EyesMark size={16} />
            </span>
            <span>
              <strong>ocra</strong> {head}
            </span>
            {!busy && (
              <button type="button" className="replay" onClick={run}>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                {copy.replay}
              </button>
            )}
          </div>
          <div className="cmt-b">
            <ol
              className="track"
              aria-hidden="true"
              style={
                {
                  "--p": Math.min(stage, STAGES.length - 1) / (STAGES.length - 1),
                } as CSSProperties
              }
            >
              {STAGES.map((name, i) => (
                <li key={name} className={i === stage ? "on" : i < stage ? "done" : undefined}>
                  <i />
                  {name}
                </li>
              ))}
            </ol>
            <div className={`verdict${running ? " hide" : ""}`}>
              <i />
              {copy.verdict}
            </div>
            <table className="sum">
              <tbody>
                {summary.map(([k, val], i) => (
                  <tr key={k} className={i >= rows ? "hide" : undefined}>
                    <td>{k}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`cmt finding${finding ? "" : " hide"}`}>
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
        </div>
      </div>
      <aside className="pr-side">
        <p className="side-h">{s.reviewers}</p>
        <div className="chk">
          <span className="av av-sm">
            <EyesMark size={12} />
          </span>
          {busy ? s.reviewing : s.changes}
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
          {busy ? <i className="dot spin" /> : <CheckIcon state="bad" />}
          {busy ? s.running : s.blocking}
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
