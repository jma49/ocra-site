"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { tabPattern } from "../tabs";

type WindowTab = "pr" | "terminal";
const TABS: readonly WindowTab[] = ["pr", "terminal"];

const moving = () =>
  document.documentElement.classList.contains("mo") &&
  matchMedia("(prefers-reduced-motion: no-preference)").matches;

// The product window's only client state: which pane shows. Both panes are
// rendered on the server and stacked in one cell, so switching never moves
// the page; the hidden one is inert. With motion, a pane the visitor picks
// eases in (motion.md §5), and the terminal types its run again each time
// it is shown (12-terminal.css; the review's own clock pauses meanwhile).
export function WindowTabs({
  labels,
  tablist,
  chip,
  panes,
}: {
  labels: Record<WindowTab, string>;
  tablist: string;
  chip: ReactNode;
  panes: Record<WindowTab, ReactNode>;
}) {
  const [tab, setTab] = useState<WindowTab>("pr");
  // Panes the visitor has opened: the terminal plays only from then on.
  const [opened, setOpened] = useState<ReadonlySet<WindowTab>>(() => new Set(["pr"]));
  const chosen = useRef(false);
  const select = (id: WindowTab) => {
    chosen.current = true;
    setTab(id);
    setOpened((had) => (had.has(id) ? had : new Set([...had, id])));
  };
  const t = tabPattern("window", TABS, tab, select);

  useEffect(() => {
    if (!chosen.current || !moving()) return;
    const panel = document.getElementById(`window-panel-${tab}`);
    if (!panel) return;
    if (tab === "terminal") {
      for (const a of panel.getAnimations({ subtree: true })) {
        a.currentTime = 0;
        a.play();
      }
    }
    const ease = getComputedStyle(document.documentElement).getPropertyValue("--e-enter").trim();
    panel.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 250, easing: ease || "linear" },
    );
  }, [tab]);

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
        {chip}
      </div>
      <div className="stack">
        {TABS.map((id) => (
          <div
            key={id}
            className={`sheet pane pane-${id}`}
            data-opened={opened.has(id) || undefined}
            {...t.panel(id)}
          >
            {panes[id]}
          </div>
        ))}
      </div>
    </div>
  );
}
