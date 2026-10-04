"use client";

import { useState } from "react";
import { SmallSpider } from "@/components/brand/spider-mark";
import type { Copy } from "@/lib/copy";
import { SplitHead } from "./heading";
import { SessionCode, Suggestion } from "./session-code";

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
            <div className="seg" role="tablist">
              {states.map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={state === s}
                  onClick={() => setState(s)}
                >
                  {copy.tabs[s]}
                </button>
              ))}
            </div>
            <div className="thread">
              {state !== "dismissed" && (
                <div className="caption" aria-hidden="true">
                  {copy.caption}
                </div>
              )}
              <div className="cmt">
                <div className="main">
                  <div className="cmt-h">
                    <span className="av">
                      <SmallSpider size={18} dark />
                    </span>
                    <span>
                      <strong>ocra</strong> · <code>src/auth/session.ts</code>
                    </span>
                  </div>
                  <SessionCode />
                  <div className="cmt-b">
                    <div className="tags">
                      <span className="tag t-crit">critical</span>
                      <span className="tag t-ok">verified</span>
                      <span className="tag t-plain">
                        correctness · b7d6c863
                      </span>
                    </div>
                    <strong className="fg">{finding.findingTitle}</strong>{" "}
                    {finding.findingBody}
                    <Suggestion />
                  </div>
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
