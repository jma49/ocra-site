"use client";

import { type FocusEvent, type ReactNode, useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { inactive, tabPattern } from "../tabs";

type LifeCopy = Copy["lifecycle"];
type LifeState = keyof LifeCopy["tabs"];
const STATES: readonly LifeState[] = ["reported", "fixed", "dismissed"];
const THREAD = "life-thread";

// The lifecycle's state: which ending of the thread shows (motion.md §10).
// Everything is rendered on the server and stacked, so a switch moves
// nothing; this island picks the state, stacks the variants and owns the
// autoplay.
//
// Autoplay runs only with motion (html.mo): the selected tab's progress
// tick is a 5.2 s CSS animation whose end advances the state, so a hold
// (the pointer on the thread or focus in it, or under 40 % of it visible)
// freezes the clock exactly where it is. The pause button turns autoplay
// off and on. Choosing a state, or putting keyboard focus on the tabs,
// stops it for good. The state note is a live region only while autoplay
// is off, so autoplay is never announced.
export function LifecycleStates({
  copy,
  chip,
  head,
  file,
  line,
  comment,
  events,
  anatomy,
  caption,
}: {
  copy: Pick<LifeCopy, "tabs" | "tablist" | "pause" | "status" | "outdated" | "notes">;
  chip: ReactNode;
  head: ReactNode;
  file: ReactNode;
  line: ReactNode;
  comment: ReactNode;
  events: Record<LifeState, ReactNode>;
  anatomy: ReactNode;
  caption: ReactNode;
}) {
  const [state, setState] = useState<LifeState>("reported");
  const [prev, setPrev] = useState<LifeState>();
  const [auto, setAuto] = useState(false);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const [focused, setFocused] = useState(false);
  const thread = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = thread.current;
    if (!el || !document.documentElement.classList.contains("mo")) return;
    setAuto(true);
    const io = new IntersectionObserver(([e]) => setSeen((e?.intersectionRatio ?? 0) >= 0.4), {
      threshold: [0, 0.4, 0.7, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (next: LifeState) => {
    if (next === state) return;
    setPrev(state);
    setState(next);
  };
  const pick = (s: LifeState) => {
    setAuto(false);
    go(s);
  };
  const advance = () => go(STATES[(STATES.indexOf(state) + 1) % STATES.length] ?? "reported");
  const t = tabPattern("lifecycle", STATES, state, pick);
  const running = auto && seen && !held && !focused;
  const blurred = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  return (
    <div
      className="life"
      data-s={state}
      data-prev={prev}
      data-enter={prev ? "" : undefined}
      data-run={running || undefined}
    >
      {head}
      <div className="life-object">
        <div className="life-controls">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: a tablist; tabPattern().list() spreads its role */}
          <div
            className="seg life-tabs"
            {...t.list(copy.tablist)}
            onFocus={() => setAuto(false)}
            onPointerDown={() => setAuto(false)}
          >
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                data-label={copy.tabs[s]}
                {...t.tab(s)}
                aria-controls={THREAD}
              >
                {copy.tabs[s]}
                {auto && s === state && (
                  <span
                    key={state}
                    className="life-tick"
                    aria-hidden="true"
                    onAnimationEnd={advance}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="life-pause"
            aria-pressed={!auto}
            aria-label={auto ? copy.pause.pause : copy.pause.play}
            onClick={() => setAuto((a) => !a)}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                className="pa"
                d="M5.5 3.5v9M10.5 3.5v9"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
              />
              <path className="pl" d="M5.2 3.3v9.4L12.9 8z" fill="currentColor" />
            </svg>
          </button>
        </div>
        {chip}
        <div
          ref={thread}
          id={THREAD}
          className={state === "fixed" ? "lt on" : "lt"}
          role="tabpanel"
          aria-labelledby={`lifecycle-tab-${state}`}
          data-pen="on"
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setFocused(true)}
          onBlur={blurred}
        >
          <div className="sheet life-thread">
            <div className="lt-bar">
              {file}
              <span className="lt-flags">
                <span className="lt-outdated" {...inactive(state !== "fixed")}>
                  {copy.outdated}
                </span>
                <span className="lt-status">
                  <span className="lt-status-track">
                    <span
                      className="lt-st lt-st-open"
                      aria-hidden={state !== "reported" || undefined}
                    >
                      <i aria-hidden="true" />
                      {copy.status.open}
                    </span>
                    <span
                      className="lt-st lt-st-done"
                      aria-hidden={state === "reported" || undefined}
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" fill="currentColor" />
                        <path
                          d="M4.9 8.3 7.1 10.4 11.2 5.9"
                          fill="none"
                          strokeWidth={1.7}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {copy.status.resolved}
                    </span>
                  </span>
                </span>
              </span>
            </div>
            {line}
            {comment}
          </div>
          <div className="stack lt-events">
            {STATES.map((s) => (
              <div key={s} className="lt-ev" data-in={s} {...inactive(s !== state)}>
                {events[s]}
              </div>
            ))}
          </div>
        </div>
        {caption}
        <div className="stack life-note" aria-live={auto ? undefined : "polite"}>
          {STATES.map((s) => (
            <p key={s} className="t-lede" {...inactive(s !== state)}>
              {copy.notes[s]}
            </p>
          ))}
        </div>
      </div>
      {anatomy}
    </div>
  );
}
