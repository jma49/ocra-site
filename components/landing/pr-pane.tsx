"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SmallSpider } from "@/components/brand/spider-mark";
import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { FindingComment } from "./session-code";

type State = "running" | "done";
const STAGES = ["select", "bundle", "review", "verify", "verdict"];
const { pr, files } = exampleRun;
const TOKENS: number = exampleRun.usage.input;
const DOLLARS: number = exampleRun.usage.dollars;

// The pull request as ocra leaves it, replayed when it scrolls into view:
// stages light up, the summary fills in, the cost counts up.
export function PrPane({ copy }: { copy: Copy["window"]["pr"] }) {
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [state, setState] = useState<State>("done");
  const [stage, setStage] = useState(STAGES.length);
  const [rows, setRows] = useState(4);
  const [finding, setFinding] = useState(true);
  const [tokens, setTokens] = useState(TOKENS);
  const [dollars, setDollars] = useState(DOLLARS);

  const clear = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);
  const later = useCallback((ms: number, f: () => void) => {
    timers.current.push(window.setTimeout(f, ms));
  }, []);

  const count = useCallback(() => {
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      const e = 1 - (1 - k) ** 3;
      setTokens(Math.round(TOKENS * e));
      setDollars(DOLLARS * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const run = useCallback(() => {
    clear();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("done");
      return;
    }
    setState("running");
    setStage(0);
    setRows(0);
    setFinding(false);
    setTokens(0);
    setDollars(0);
    later(500, () => {
      setRows(1);
      setStage(1);
    });
    later(1100, () => {
      setRows(2);
      setStage(2);
    });
    later(1900, () => {
      setFinding(true);
      setStage(3);
    });
    later(2600, () => {
      setRows(3);
      setStage(4);
    });
    later(3100, () => {
      setRows(4);
      count();
    });
    later(3500, () => {
      setStage(STAGES.length);
      setState("done");
    });
  }, [clear, later, count]);

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

  const running = state === "running";
  const head = {
    running: copy.reviewing,
    done: copy.reviewed,
  }[state];
  const v = copy.values;
  const summary: [string, string][] = [
    [copy.rows.reviewed, v.reviewed],
    [copy.rows.tasks, v.tasks],
    [copy.rows.findings, v.findings],
    [
      copy.rows.cost,
      `${tokens.toLocaleString("en-US")} ${v.tokens} · $${dollars.toFixed(4)}`,
    ],
  ];
  const s = copy.side;
  const busy = running;

  return (
    <div ref={root} className="pr" data-state={state}>
      <div className="pr-main">
        <div className="pr-title">
          {copy.title} <span>#{pr.number}</span>
        </div>
        <div className="pr-meta">
          {copy.meta.into} <code>{pr.base}</code> {copy.meta.from}{" "}
          <code>{pr.head}</code> · {copy.meta.files}
        </div>
        <div className="cmt">
          <div className="cmt-h">
            <span className="av">
              <SmallSpider size={18} dark />
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
            <div
              className="stages"
              aria-hidden="true"
              style={
                {
                  "--prog": `${(Math.min(stage + 1, STAGES.length) / STAGES.length) * 100}%`,
                } as CSSProperties
              }
            >
              {STAGES.map((name, i) => (
                <span
                  key={name}
                  className={
                    i === stage ? "on" : i < stage ? "done" : undefined
                  }
                >
                  {name}
                </span>
              ))}
              <i className="bar" />
            </div>
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
          <SmallSpider size={18} />
          {busy ? s.reviewing : s.changes}
        </div>
        <p className="side-h">{s.checks}</p>
        <div className="chk">
          <i className="dot ok" />
          build
        </div>
        <div className="chk">
          <i className="dot ok" />
          test
        </div>
        <div className="chk">
          <i className={`dot ${busy ? "spin" : "bad"}`} />
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
