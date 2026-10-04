"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";
import { SplitHead } from "./heading";
import { FindingComment } from "./session-code";
import { tabPattern } from "./tabs";

type State = "reported" | "fixed" | "dismissed";

// One finding through its life: reported, fixed by the author, or declined
// by a maintainer.
export function Lifecycle({
  copy,
  finding,
}: {
  copy: Copy["lifecycle"];
  finding: Copy["window"]["pr"];
}) {
  const [state, setState] = useState<State>("reported");
  const states: State[] = ["reported", "fixed", "dismissed"];
  const t = tabPattern("lifecycle", states, state, setState);
  return (
    <section className="chapter tight-top lifecycle">
      <div className="wrap">
        <SplitHead
          title={copy.title}
          emphasis={copy.emphasis}
          body={copy.body}
        />
        <div className="life" data-s={state}>
          <div>
            <div className="seg" {...t.list}>
              {states.map((s) => (
                <button key={s} type="button" {...t.tab(s)}>
                  {copy.tabs[s]}
                </button>
              ))}
            </div>
            <div className="thread" {...t.panel(state)}>
              {state !== "dismissed" && (
                <div className="caption" aria-hidden="true">
                  {copy.caption}
                </div>
              )}
              <div className="cmt">
                <div className="main">
                  <FindingComment
                    variant="thread"
                    title={finding.findingTitle}
                    body={finding.findingBody}
                  />
                </div>
                {state === "dismissed" && (
                  <>
                    <div className="extra reply">
                      <strong>{copy.maintainer}</strong> {copy.reply}
                    </div>
                    <div className="extra">{copy.resolvedMaintainer}</div>
                  </>
                )}
                {state === "fixed" && (
                  <div className="extra">{copy.resolvedBot}</div>
                )}
              </div>
            </div>
            <p className="state-text" aria-live="polite">
              {copy.notes[state]}
            </p>
          </div>
          <ol className="keys">
            {copy.keys.map((k, i) => (
              <li key={k.title}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{k.title}</strong>
                  <span>{k.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
