"use client";

import { type ReactNode, useState } from "react";
import { tabPattern } from "../tabs";

type WindowTab = "pr" | "terminal";
const TABS: readonly WindowTab[] = ["pr", "terminal"];

// The product window's only client state: which pane shows. Both panes are
// rendered on the server and stacked in one cell, so switching never moves
// the page; the hidden one is inert.
export function WindowTabs({
  labels,
  tablist,
  chip,
  panes,
}: {
  labels: Record<WindowTab, string>;
  tablist: string;
  chip: string;
  panes: Record<WindowTab, ReactNode>;
}) {
  const [tab, setTab] = useState<WindowTab>("pr");
  const t = tabPattern("window", TABS, tab, setTab);
  return (
    <div className="desk">
      <div className="desk-top">
        <div className="seg" {...t.list(tablist)}>
          {TABS.map((id) => (
            <button key={id} type="button" data-label={labels[id]} {...t.tab(id)}>
              {labels[id]}
            </button>
          ))}
        </div>
        <span className="chip chip-example on-stone" aria-describedby="product-cap">
          {chip}
        </span>
      </div>
      <div className="stack">
        {TABS.map((id) => (
          <div key={id} className="sheet pane" {...t.panel(id)}>
            {panes[id]}
          </div>
        ))}
      </div>
    </div>
  );
}
