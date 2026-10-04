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
import { FIX_EVENT } from "./hanging-spider";
import { Line, Return, SessionCode } from "./session-code";

type State = "running" | "done" | "fixing" | "fixed";
const STAGES = ["select", "bundle", "review", "verify", "verdict"];
const TOKENS = 315936;
const DOLLARS = 0.5134;

// The pull request as ocra leaves it, replayed when it scrolls into view:
// stages light up, the summary fills in, the cost counts up. "Commit
// suggestion" applies the fix and ocra re-reviews and resolves the thread.
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

  const commit = () => {
    clear();
    setState("fixing");
    later(1300, () => {
      setState("fixed");
      window.dispatchEvent(new Event(FIX_EVENT));
    });
  };

  const running = state === "running";
  const fixed = state === "fixed";
  const applied = state === "fixing" || fixed;
  const head = {
    running: copy.reviewing,
    done: copy.reviewed,
    fixing: copy.rereviewing,
    fixed: copy.rereviewed,
  }[state];
  const v = copy.values;
  const summary: [string, string][] = [
    [copy.rows.reviewed, v.reviewed],
    [copy.rows.tasks, v.tasks],
    [copy.rows.findings, fixed ? v.findingsFixed : v.findings],
    [
      copy.rows.cost,
      `${tokens.toLocaleString("en-US")} ${v.tokens} · $${dollars.toFixed(4)}`,
    ],
  ];
  const s = copy.side;
  const busy = running || state === "fixing";

  return (
    <div ref={root} className="pr" data-state={state}>
      <div className="pr-main">
        <div className="pr-title">
          {copy.title} <span>#812</span>
        </div>
        <div className="pr-meta">
          {copy.meta.into} <code>main</code> {copy.meta.from}{" "}
          <code>fix/session-expiry</code> · {copy.meta.files}
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
            <div
              className={`verdict${running ? " hide" : ""}${fixed ? " ok" : ""}`}
            >
              <i />
              {fixed ? copy.verdictFixed : copy.verdict}
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
          <div className="cmt-h">
            <span className="av">
              <SmallSpider size={18} dark />
            </span>
            <span>
              <strong>ocra</strong> · <code>src/auth/session.ts</code>{" "}
              {copy.onLine} 42
            </span>
            {fixed && <span className="resolved-chip">{copy.resolved}</span>}
          </div>
          <div className="fold">
            <div className="fold-in">
              <SessionCode>
                <Line n={42} quoted className={applied ? "applied" : undefined}>
                  <Return fixed={applied} />
                  <span className="qtip" role="tooltip">
                    {copy.quoteTip}
                  </span>
                </Line>
              </SessionCode>
              <div className="cmt-b">
                <div className="tags">
                  <span className="tag t-crit">critical</span>
                  <span className="tag t-ok">verified</span>
                  <span className="tag t-plain">correctness</span>
                </div>
                <strong className="fg">{copy.findingTitle}</strong>{" "}
                {copy.findingBody}
                <div className="sugg">
                  <div className="h">{copy.suggested}</div>
                  <div className="d">
                    - return session.expiresAt &lt; Date.now();
                  </div>
                  <div className="a">
                    + return session.expiresAt * 1000 &lt; Date.now();
                  </div>
                  <div className="sugg-act">
                    <button
                      type="button"
                      className="commit"
                      disabled={state !== "done"}
                      onClick={commit}
                    >
                      {copy.commit}
                    </button>
                    <span>{copy.commitHint}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {fixed && <div className="resolved-line">{copy.resolvedLine}</div>}
        </div>
      </div>
      <aside className="pr-side">
        <h5>{s.reviewers}</h5>
        <div className="chk">
          <SmallSpider size={18} />
          {busy ? s.reviewing : fixed ? s.approved : s.changes}
        </div>
        <h5>{s.checks}</h5>
        <div className="chk">
          <i className="dot ok" />
          build
        </div>
        <div className="chk">
          <i className="dot ok" />
          test
        </div>
        <div className="chk">
          <i className={`dot ${busy ? "spin" : fixed ? "ok" : "bad"}`} />
          {busy ? s.running : fixed ? s.passed : s.blocking}
        </div>
        <h5>{s.files}</h5>
        <div className="chk file" data-why={s.why.session}>
          src/auth/session.ts
        </div>
        <div className="chk file" data-why={s.why.login}>
          src/auth/login.ts
        </div>
        <div className="chk file" data-why={s.why.docs}>
          docs/sessions.md
        </div>
        <div className="chk file out" data-why={s.why.lock}>
          package-lock.json
        </div>
      </aside>
    </div>
  );
}
