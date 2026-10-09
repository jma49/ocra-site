"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";
import { type CallRole, exampleRun, formatCount, terminalLines } from "@/lib/landing/example-run";
import { PrPane } from "./pr-pane";
import { tabPattern } from "./tabs";

type Tab = "pr" | "terminal" | "cloud";

// The console's Activity page after the run above: every model request it
// made, in pipeline order, each bar sized by its input tokens.
const { calls, usage } = exampleRun;
const STAGE_ORDER: CallRole[] = ["grouping", "review", "verification", "judge"];
const requests = STAGE_ORDER.flatMap((role) => calls.filter((call) => call.role === role));
const maxInput = Math.max(...calls.map((call) => call.input));
// The nav item the page shows: Activity.
const ACTIVE_NAV = 1;

export function ProductWindow({ copy }: { copy: Copy["window"] }) {
  const [tab, setTab] = useState<Tab>("pr");
  const tabs: { id: Tab; label: string; icon: string }[] = [
    {
      id: "pr",
      label: copy.tabs.pr,
      icon: "M6 8.5v7M18 15.5V9a3 3 0 0 0-3-3h-4M8.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
    },
    { id: "terminal", label: copy.tabs.terminal, icon: "M5 7l5 5-5 5M12 17h7" },
    {
      id: "cloud",
      label: copy.tabs.cloud,
      icon: "M7 18h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z",
    },
  ];
  const t = tabPattern(
    "window",
    tabs.map((x) => x.id),
    tab,
    setTab,
  );
  return (
    <div className="stage" id="product">
      <div className="tabs" {...t.list}>
        {tabs.map((x) => (
          <button key={x.id} type="button" {...t.tab(x.id)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={x.icon} />
            </svg>
            {x.label}
          </button>
        ))}
      </div>
      <div className="win">
        <div className="win-bar">
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="url">{copy.urls[tab]}</span>
          <span className="spacer" />
        </div>
        {tab === "pr" && <PrPane copy={copy.pr} panel={t.panel("pr")} />}
        {tab === "terminal" && (
          <pre className="term" {...t.panel("terminal")}>
            {terminalLines.map(([text, tone]) => (
              <span key={text} className={tone || undefined}>{`${text}\n`}</span>
            ))}
            <span className="caret" />
          </pre>
        )}
        {tab === "cloud" && (
          <div className="console" {...t.panel("cloud")}>
            <aside>
              {copy.console.nav.map((item, i) => (
                <span key={item} className={i === ACTIVE_NAV ? "on" : undefined}>
                  {item}
                </span>
              ))}
            </aside>
            <div className="m">
              <div className="stats">
                <div className="stat">
                  <small>{copy.console.stats.requests}</small>
                  <b>{calls.length}</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.input}</small>
                  <b>{formatCount(usage.input)}</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.spend}</small>
                  <b>${usage.dollars.toFixed(4)}</b>
                </div>
              </div>
              <div className="reqs">
                {requests.map((call, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed list of recorded calls
                  <div key={i} data-role={call.role}>
                    <span>
                      {copy.console.roles[call.role]}
                      {call.model && ` · ${call.model}`}
                    </span>
                    <span className="bar" aria-hidden="true">
                      <i style={{ width: `${(call.input / maxInput) * 100}%` }} />
                    </span>
                    <span>{formatCount(call.input)} in</span>
                    <span>200</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="example-note">{copy.example}</p>
    </div>
  );
}
