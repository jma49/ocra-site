import type { HTMLAttributes, KeyboardEvent } from "react";

// The ARIA tabs pattern for a small fixed set: the selected tab is the one
// in the tab order, the arrow keys, Home and End move between tabs and
// select them, and the panel names the tab that labels it.
export function tabPattern<Id extends string>(
  prefix: string,
  ids: readonly Id[],
  selected: Id,
  select: (id: Id) => void,
) {
  const tabId = (id: Id) => `${prefix}-tab-${id}`;
  const panelId = (id: Id) => `${prefix}-panel-${id}`;
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
    document.getElementById(tabId(id))?.focus();
  };
  return {
    list: { role: "tablist", onKeyDown } satisfies HTMLAttributes<HTMLElement>,
    tab: (id: Id) =>
      ({
        id: tabId(id),
        role: "tab",
        "aria-selected": id === selected,
        // Only the selected panel is rendered.
        "aria-controls": id === selected ? panelId(id) : undefined,
        tabIndex: id === selected ? 0 : -1,
        onClick: () => select(id),
      }) satisfies HTMLAttributes<HTMLElement>,
    panel: (id: Id) =>
      ({
        id: panelId(id),
        role: "tabpanel",
        "aria-labelledby": tabId(id),
      }) satisfies HTMLAttributes<HTMLElement>,
  };
}
