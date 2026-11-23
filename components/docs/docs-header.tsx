"use client";

import { useNotebookLayout } from "@fumadocs/base-ui/layouts/notebook";
import { LinkItem, type MainItemType } from "@fumadocs/base-ui/layouts/shared";
import { Languages, Menu } from "lucide-react";
import type { ComponentProps } from "react";

// The manual's bar on the ground (app/docs-nav.css): the logo and the
// manual's name on the left; search, GitHub, sign in, language, theme and
// the call to action on the right; on a phone the logo, search and the
// drawer's button. It takes Fumadocs' header slot, so the search, the
// language menu and the drawer are Fumadocs' own.

export function DocsHeader(props: ComponentProps<"header">) {
  const {
    slots,
    navItems,
    props: { nav },
  } = useNotebookLayout();
  const links = navItems.filter(
    (item): item is MainItemType => item.type === undefined || item.type === "main",
  );
  const custom = navItems.filter((item) => item.type === "custom");
  return (
    <header {...props} id="nd-subnav" className="docs-bar">
      <div className="docs-bar-body">
        {slots.navTitle ? <slots.navTitle className="docs-logo" /> : null}
        {/* A server element passed in a list warns without a key: one child. */}
        <span className="docs-slot">{nav?.children}</span>
        <div className="docs-bar-r">
          {slots.searchTrigger ? (
            <slots.searchTrigger.full hideIfDisabled className="docs-search" />
          ) : null}
          {links.map((item) => (
            <LinkItem key={item.url} item={item} className="docs-nav-a">
              {item.text}
            </LinkItem>
          ))}
          {slots.languageSelect ? (
            <slots.languageSelect.root className="docs-ib docs-wide">
              <Languages size={16} strokeWidth={1.75} />
            </slots.languageSelect.root>
          ) : null}
          {slots.themeSwitch ? (
            <span className="docs-wide">
              <slots.themeSwitch />
            </span>
          ) : null}
          {custom.map((item, i) =>
            item.type === "custom" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list from baseOptions
              <span key={i} className="docs-wide">
                {item.children}
              </span>
            ) : null,
          )}
          {slots.searchTrigger ? (
            <slots.searchTrigger.sm hideIfDisabled className="docs-ib docs-search-sm" />
          ) : null}
          {slots.sidebar ? (
            <slots.sidebar.trigger className="docs-ib docs-narrow docs-menu">
              <Menu size={20} strokeWidth={1.75} />
            </slots.sidebar.trigger>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// The foot of the page tree: in the drawer on a phone, the language, the
// theme and the call to action; on a wider screen Fumadocs hides it.
export function DrawerFoot({ children, ...props }: ComponentProps<"div">) {
  const { navItems } = useNotebookLayout();
  const cta = navItems.find((item) => item.type === "custom");
  return (
    <div {...props}>
      {children}
      {cta?.type === "custom" ? <span className="docs-slot">{cta.children}</span> : null}
    </div>
  );
}

// The head of the page tree: in the drawer on a phone, the logo and the
// close button, as the bar is (on a wider screen it is hidden).
export function DrawerHead({ children, ...props }: ComponentProps<"div">) {
  const { slots } = useNotebookLayout();
  return (
    <div {...props}>
      {slots.navTitle ? <slots.navTitle className="docs-logo docs-drawer-logo" /> : null}
      {children}
    </div>
  );
}
