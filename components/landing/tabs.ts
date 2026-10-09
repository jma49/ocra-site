import type { HTMLAttributes, KeyboardEvent } from "react";

const tabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
const panelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

// A tab panel's attributes: it names the tab that labels it. They depend on
// nothing but the ids, so a panel rendered on the server can carry them.
export const tabPanel = (prefix: string, id: string) =>
  ({
    id: panelId(prefix, id),
    role: "tabpanel",
    "aria-labelledby": tabId(prefix, id),
  }) satisfies HTMLAttributes<HTMLElement>;

// The ARIA tabs pattern for a small fixed set: the selected tab is the one
// in the tab order, the arrow keys, Home and End move between tabs and
// select them, and the panel names the tab that labels it.
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
    list: { role: "tablist", onKeyDown } satisfies HTMLAttributes<HTMLElement>,
    tab: (id: Id) =>
      ({
        id: tabId(prefix, id),
        role: "tab",
        "aria-selected": id === selected,
        // Only the selected panel is rendered.
        "aria-controls": id === selected ? panelId(prefix, id) : undefined,
        tabIndex: id === selected ? 0 : -1,
        onClick: () => select(id),
      }) satisfies HTMLAttributes<HTMLElement>,
    panel: (id: Id) => tabPanel(prefix, id),
  };
}
