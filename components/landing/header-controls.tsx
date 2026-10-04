"use client";

import { useTheme } from "next-themes";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// The header's only client state: the phone menu and the theme. The rest of
// the header is rendered on the server and passed in.

const Menu = createContext<{
  open: boolean;
  toggle: () => void;
  button: RefObject<HTMLButtonElement | null>;
} | null>(null);

// The menu closes on a tap outside it, on a link in it, on Escape (focus
// returns to its button) and once the page scrolls.
export function NavShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const outside = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      button.current?.focus();
    };
    const startY = scrollY;
    const scrolled = () => {
      if (Math.abs(scrollY - startY) > 40) close();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", onKey);
    addEventListener("scroll", scrolled, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", onKey);
      removeEventListener("scroll", scrolled);
    };
  }, [open]);

  return (
    <Menu value={{ open, toggle: () => setOpen((o) => !o), button }}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: closes the menu after a link inside it is followed; the links themselves are the controls */}
      <div
        className="nav-shell"
        data-open={open}
        ref={shell}
        onClick={(e) => {
          if ((e.target as Element).closest(".drawer a")) setOpen(false);
        }}
      >
        {children}
      </div>
    </Menu>
  );
}

export function MenuButton({ label }: { label: string }) {
  const menu = useContext(Menu);
  return (
    <button
      type="button"
      ref={menu?.button}
      className="ib menu"
      aria-label={label}
      aria-expanded={menu?.open ?? false}
      aria-controls="site-menu"
      onClick={menu?.toggle}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="ib"
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
