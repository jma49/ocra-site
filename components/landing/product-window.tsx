"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";
import { terminalLines } from "@/lib/landing/example-run";
import { PrPane } from "./pr-pane";

type Tab = "pr" | "terminal" | "cloud";

// Sample data for the console picture; labelled as such under the window.
const BARS: [number, number, number][] = [
  [3, 2, 1],
  [5, 2, 2],
  [2, 1, 1],
  [6, 3, 2],
  [8, 3, 1],
  [4, 2, 2],
  [2, 1, 0],
  [7, 4, 2],
  [9, 3, 3],
  [6, 2, 1],
  [10, 4, 2],
  [8, 3, 2],
  [11, 5, 3],
  [9, 4, 2],
];
const ROWS = [
  ["openrouter · qwen3.8-27b", "7,911 in"],
  ["anthropic · claude-sonnet-5-5", "41,204 in"],
  ["deepseek · deepseek-v4", "12,880 in"],
];

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
  return (
    <div className="stage" id="product">
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
        {tab === "pr" && <PrPane copy={copy.pr} />}
        {tab === "terminal" && (
          <pre className="term">
            {terminalLines.map(([text, tone]) => (
              <span
                key={text}
                className={tone || undefined}
              >{`${text}\n`}</span>
            ))}
            <span className="caret" />
          </pre>
        )}
        {tab === "cloud" && (
          <div className="console">
            <aside>
              {copy.console.nav.map((item, i) => (
                <span key={item} className={i ? undefined : "on"}>
                  {item}
                </span>
              ))}
            </aside>
            <div className="m">
              <div className="stats">
                <div className="stat">
                  <small>{copy.console.stats.reviews}</small>
                  <b>38</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.requests}</small>
                  <b>2,114</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.spend}</small>
                  <b>$9.82</b>
                </div>
              </div>
              <div className="bars" aria-hidden="true">
                {BARS.map(([a, b, c], i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed sample series
                  <i key={i} style={{ height: (a + b + c) * 5.6 }}>
                    <b style={{ flex: a }} />
                    <b style={{ flex: b }} />
                    <b style={{ flex: c }} />
                  </i>
                ))}
              </div>
              <div className="rows">
                {ROWS.map(([m, n]) => (
                  <div key={m}>
                    <span>{m}</span>
                    <span>{n}</span>
                    <span>200</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={t.icon} />
            </svg>
            {t.label}
          </button>
        ))}
      </div>
      <p className="example-note">{copy.example}</p>
    </div>
  );
}
