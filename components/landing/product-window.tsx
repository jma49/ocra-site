"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";
import {
  type CallRole,
  exampleRun,
  formatCount,
  terminalLines,
} from "@/lib/landing/example-run";
import { PrPane } from "./pr-pane";
import { tabPattern } from "./tabs";

type Tab = "pr" | "terminal" | "cloud";

// The console after the run above: one review, its model calls by role.
// Fourteen days; the run is on the last.
const DAYS = Array.from({ length: 14 }, (_, i) => `day-${i + 1}`);
const TODAY = DAYS.at(-1);
const { calls, usage } = exampleRun;
const ROLES: CallRole[] = ["review", "grouping", "verification", "judge"];
const byRole = ROLES.map((role) => {
  const of = calls.filter((call) => call.role === role);
  return {
    role,
    model: of.find((call) => call.model)?.model,
    count: of.length,
    input: of.reduce((sum, call) => sum + call.input, 0),
  };
});
const count = (...roles: CallRole[]) =>
  calls.filter((call) => roles.includes(call.role)).length;
// The chart stacks three shades: review tasks, grouping, and the checks.
const SEGMENTS = [
  count("review"),
  count("grouping"),
  count("verification", "judge"),
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
  const t = tabPattern(
    "window",
    tabs.map((x) => x.id),
    tab,
    setTab,
  );
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
        {tab === "pr" && <PrPane copy={copy.pr} panel={t.panel("pr")} />}
        {tab === "terminal" && (
          <pre className="term" {...t.panel("terminal")}>
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
          <div className="console" {...t.panel("cloud")}>
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
                  <b>1</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.requests}</small>
                  <b>{calls.length}</b>
                </div>
                <div className="stat">
                  <small>{copy.console.stats.spend}</small>
                  <b>${usage.dollars.toFixed(4)}</b>
                </div>
              </div>
              <div className="bars" aria-hidden="true">
                {DAYS.map((day) => (
                  <i
                    key={day}
                    style={{ height: day === TODAY ? calls.length * 9 : 0 }}
                  >
                    {day === TODAY &&
                      SEGMENTS.map((n, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed segments
                        <b key={i} style={{ flex: n }} />
                      ))}
                  </i>
                ))}
              </div>
              <div className="rows">
                {byRole.map((r) => (
                  <div key={r.role}>
                    <span>
                      {copy.console.roles[r.role]}
                      {r.model && ` · ${r.model}`}
                    </span>
                    <span>{formatCount(r.input)} in</span>
                    <span>200</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
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
      <p className="example-note">{copy.example}</p>
    </div>
  );
}
