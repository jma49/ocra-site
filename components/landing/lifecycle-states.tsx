"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { tabPattern } from "./tabs";

export type LifeState = "reported" | "fixed" | "dismissed";
const STATES: LifeState[] = ["reported", "fixed", "dismissed"];
const DWELL_MS = 4800;

// The lifecycle's only state: which ending is shown. The thread is rendered
// on the server with every ending in it; `data-in` on its parts and the
// `data-s` set here pick what shows (07-sections.css). Like the pipeline, the
// endings advance on their own while the section is on screen, until the
// reader points at it or picks one; under Reduce motion they wait for the
// reader.
export function LifecycleStates({
  copy,
  thread,
  keys,
}: {
  copy: Pick<Copy["lifecycle"], "tabs" | "notes">;
  thread: ReactNode;
  keys: ReactNode;
}) {
  const [state, setState] = useState<LifeState>("reported");
  const [auto, setAuto] = useState(false);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAuto(true);
    const io = new IntersectionObserver(([entry]) => setSeen(!!entry?.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = auto && seen && !held;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(
      () => setState(STATES[(STATES.indexOf(state) + 1) % STATES.length] ?? "reported"),
      DWELL_MS,
    );
    return () => clearTimeout(t);
  }, [running, state]);

  const pick = (s: LifeState) => {
    setState(s);
    setAuto(false);
  };
  const t = tabPattern("lifecycle", STATES, state, pick);
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pausing the auto-advance is a convenience; the tabs are the controls
    <div
      ref={root}
      className="life"
      data-s={state}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div>
        <div className="seg" {...t.list}>
          {STATES.map((s) => (
            <button key={s} type="button" {...t.tab(s)}>
              {copy.tabs[s]}
            </button>
          ))}
        </div>
        <div className="thread" {...t.panel(state)}>
          {thread}
        </div>
        <p className="state-text" aria-live={running ? "off" : "polite"}>
          {copy.notes[state]}
        </p>
      </div>
      {keys}
    </div>
  );
}
