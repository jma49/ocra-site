import type { HTMLAttributes, KeyboardEvent } from "react";

const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

// An inactive stacked variant (a tab panel, a lifecycle state, a story
// figure): out of the tab order and the accessibility tree, and hidden
// (03-objects.css: visibility: hidden) but still in its grid cell, so the
// tallest variant keeps sizing the cell and nothing moves on a switch.
export const inactive = (off: boolean) =>
  (off ? { inert: true, "data-inactive": "" } : {}) satisfies HTMLAttributes<HTMLElement> & {
    "data-inactive"?: string;
  };

// The ARIA tabs pattern for a small fixed set whose panels are all
// rendered: the selected tab is the one in the tab order; the arrow keys,
// Home and End move between tabs and select them; every tab controls its
// panel; every panel names its tab, and the unselected ones are inactive.
export function tabPattern<Id extends string>(
  prefix: string,
  ids: readonly Id[],
  selected: Id,
  select: (id: Id) => void,
) {
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const at = ids.indexOf(selected);
    const next = {
      ArrowRight: at + 1,
      ArrowDown: at + 1,
      ArrowLeft: at - 1,
      ArrowUp: at - 1,
      Home: 0,
      End: ids.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const id = ids[(next + ids.length) % ids.length];
    if (id === undefined) return;
    select(id);
    document.getElementById(tabId(prefix, id))?.focus();
  };
  return {
    // The tablist, named (`label`: what the tabs choose between).
    list: (label: string) =>
      ({ role: "tablist", "aria-label": label, onKeyDown }) satisfies HTMLAttributes<HTMLElement>,
    tab: (id: Id) =>
      ({
        id: tabId(prefix, id),
        role: "tab",
        "aria-selected": id === selected,
        "aria-controls": panelId(prefix, id),
        tabIndex: id === selected ? 0 : -1,
        onClick: () => select(id),
      }) satisfies HTMLAttributes<HTMLElement>,
    panel: (id: Id) => ({
      id: panelId(prefix, id),
      role: "tabpanel",
      "aria-labelledby": tabId(prefix, id),
      ...inactive(id !== selected),
    }),
  };
}
