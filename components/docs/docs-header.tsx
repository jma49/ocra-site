"use client";

import { useNotebookLayout } from "@fumadocs/base-ui/layouts/notebook";
import { LinkItem, type MainItemType } from "@fumadocs/base-ui/layouts/shared";
import { Languages } from "lucide-react";
import { type ComponentProps, useEffect, useState } from "react";

// The manual's bar, laid out as the landing page's (components/landing/
// site-header.tsx): logo and sections on the left; search, GitHub, sign in,
// language, theme and the call to action on the right; on a phone the logo,
// search and the drawer's button. Bare on the desk at the top of a page, a
// smoked glass bar once the page has moved (app/docs-nav.css). It takes
// Fumadocs' header slot, so the search, the language menu and the drawer are
// Fumadocs' own.
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(scrollY > 8);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return scrolled;
}

export function DocsHeader(props: ComponentProps<"header">) {
  const {
    slots,
    navItems,
    props: { nav },
  } = useNotebookLayout();
  const scrolled = useScrolled();
  const links = navItems.filter(
    (item): item is MainItemType => item.type === undefined || item.type === "main",
  );
  const custom = navItems.filter((item) => item.type === "custom");
  return (
    <header {...props} id="nd-subnav" className="docs-bar" data-scrolled={scrolled || undefined}>
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
              <Languages size={17} strokeWidth={1.8} />
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
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 8h16M4 16h16" />
              </svg>
            </slots.sidebar.trigger>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// The foot of the page tree: in the drawer on a phone, the language, the
// theme and the call to action (the bar's, drawn as paper here); on a wider
// screen Fumadocs hides it.
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
