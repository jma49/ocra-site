"use client";

import { type ReactNode, useState } from "react";
import { tabPattern } from "./tabs";

export type WindowTab = "pr" | "terminal" | "cloud";

const TABS: WindowTab[] = ["pr", "terminal", "cloud"];
const ICONS: Record<WindowTab, string> = {
  pr: "M6 8.5v7M18 15.5V9a3 3 0 0 0-3-3h-4M8.5 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20.5 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
  terminal: "M5 7l5 5-5 5M12 17h7",
  cloud: "M7 18h10a4 4 0 0 0 .6-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z",
};

// The product window's only client state: which pane shows. The panes are
// rendered on the server (product-window.tsx), each with its tab panel's
// attributes, and handed in.
export function WindowTabs({
  prefix,
  labels,
  urls,
  panes,
  children,
}: {
  prefix: string;
  labels: Record<WindowTab, string>;
  urls: Record<WindowTab, string>;
  panes: Record<WindowTab, ReactNode>;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<WindowTab>("pr");
  const t = tabPattern(prefix, TABS, tab, setTab);
  return (
    <div className="stage" id="product">
      <div className="tabs" {...t.list}>
        {TABS.map((id) => (
          <button key={id} type="button" {...t.tab(id)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d={ICONS[id]} />
            </svg>
            {labels[id]}
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
          <span className="url">{urls[tab]}</span>
          <span className="spacer" />
        </div>
        {panes[tab]}
      </div>
      {children}
    </div>
  );
}
