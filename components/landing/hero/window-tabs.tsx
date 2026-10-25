"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { tabPattern } from "../tabs";

type WindowTab = "pr" | "terminal";
const TABS: readonly WindowTab[] = ["pr", "terminal"];

const moving = () =>
  document.documentElement.classList.contains("mo") &&
  matchMedia("(prefers-reduced-motion: no-preference)").matches;

// The product window, the desk itself (a figure: the tab row, the two
// papers, then its caption along the foot), and its only client state:
// which paper lies on top. Both are rendered on the server and laid out at
// the same size, so a switch never moves the page: the one on top lies in
// front, the other behind it, up and to the right, with its bar and its
// first line showing (11-window.css), inert. Choosing a tab swaps them
// (CSS transitions), and the terminal prints the rest of its run again each
// time it comes to the top (12-terminal.css; the review's own clock pauses
// meanwhile).
export function WindowTabs({
  labels,
  tablist,
  chip,
  panes,
  caption,
}: {
  labels: Record<WindowTab, string>;
  tablist: string;
  chip: ReactNode;
  panes: Record<WindowTab, ReactNode>;
  caption: ReactNode;
}) {
  const [tab, setTab] = useState<WindowTab>("pr");
  // Papers the visitor has brought up: the terminal plays only from then on.
  const [opened, setOpened] = useState<ReadonlySet<WindowTab>>(() => new Set(["pr"]));
  const chosen = useRef(false);
  const select = (id: WindowTab) => {
    chosen.current = true;
    setTab(id);
    setOpened((had) => (had.has(id) ? had : new Set([...had, id])));
  };
  const t = tabPattern("window", TABS, tab, select);
  const behind = tab === "pr" ? "terminal" : "pr";

  useEffect(() => {
    if (!chosen.current) return;
    const terminal = document.getElementById("window-panel-terminal");
    // Back under the pull request, the terminal shows its verdict again.
    if (tab === "pr") terminal?.querySelector(".term")?.scrollTo({ top: 0 });
    if (tab !== "terminal" || !moving()) return;
    for (const a of terminal?.getAnimations({ subtree: true }) ?? []) {
      if (!(a instanceof CSSAnimation)) continue;
      a.currentTime = 0;
      a.play();
    }
  }, [tab]);

  return (
    <figure className="product desk" id="product">
      <div className="desk-top">
        <div className="seg" {...t.list(tablist)}>
          {TABS.map((id) => (
            <button key={id} type="button" data-label={labels[id]} {...t.tab(id)}>
              {labels[id]}
            </button>
          ))}
        </div>
        {chip}
      </div>
      <div className="stack">
        {TABS.map((id) => (
          <div
            key={id}
            className={`pane pane-${id}`}
            data-opened={opened.has(id) || undefined}
            {...t.panel(id)}
          >
            {panes[id]}
          </div>
        ))}
        {/* Where the paper behind shows, a pointer can bring it up too; the
            tabs are the way for the keyboard and screen readers, so this
            never takes focus. */}
        <button
          type="button"
          className="pane-lift"
          tabIndex={-1}
          aria-hidden="true"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => select(behind)}
        />
      </div>
      {caption}
    </figure>
  );
}
