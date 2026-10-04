"use client";

import { type ReactNode, useState } from "react";
import type { Copy } from "@/lib/copy";
import { tabPattern } from "./tabs";

export type LifeState = "reported" | "fixed" | "dismissed";
const STATES: LifeState[] = ["reported", "fixed", "dismissed"];

// The lifecycle's only state: which ending is shown. The thread is rendered
// on the server with every ending in it; `data-in` on its parts and the
// `data-s` set here pick what shows (07-sections.css).
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
  const t = tabPattern("lifecycle", STATES, state, setState);
  return (
    <div className="life" data-s={state}>
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
        <p className="state-text" aria-live="polite">
          {copy.notes[state]}
        </p>
      </div>
      {keys}
    </div>
  );
}
