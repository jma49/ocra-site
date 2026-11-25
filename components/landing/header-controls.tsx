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

// The header's only client state: the phone menu, the theme and whether the
// page has left its top. The bar and the drawer are rendered on the server
// and passed in.

const Menu = createContext<{
  open: boolean;
  toggle: () => void;
  button: RefObject<HTMLButtonElement | null>;
} | null>(null);

// The drawer exists below this width (02-nav.css).
const WIDE = "(min-width: 1024px)";

// The sticky header: the bar (logo, links, controls) and the phone drawer.
// While the drawer is open a scrim covers the page, the page is inert and
// holds still (02-nav.css), so the drawer is the only thing to read, tap,
// tab to or scroll; it takes the viewport below the bar and no more. It
// closes on a tap outside the bar and the drawer (the scrim; a click, so a
// drag there is not a tap), on a link in it, on Escape (focus returns to
// its button), and when the window grows past the drawer; those listeners
// exist only while it is open.
// Whether the page has left its top: the hero's sentinel 24 px down has
// gone under the bar's lower edge (68 px down the viewport). The bar then
// gains its hairline (02-nav.css).
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = document.querySelector("[data-top-sentinel]");
    if (!sentinel) return;
    // A batch can hold several entries for the one sentinel (a resize away
    // and back); the last is the current one.
    const io = new IntersectionObserver((entries) => setScrolled(!entries.at(-1)?.isIntersecting), {
      rootMargin: "-68px 0px 0px 0px",
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return scrolled;
}

function useActiveSection(navRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const links = [...nav.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]')];
    const ids = links.map((a) => a.getAttribute("href")?.slice(1) ?? "").filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const visible = new Set<string>();
    const sync = () => {
      const active = ids.find((id) => visible.has(id));
      for (const a of links) {
        const id = a.getAttribute("href")?.slice(1);
        if (id && id === active) a.dataset.active = "true";
        else delete a.dataset.active;
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        sync();
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    for (const s of sections) io.observe(s);
    return () => io.disconnect();
  }, [navRef]);
}

export function NavShell({ bar, drawer }: { bar: ReactNode; drawer: ReactNode }) {
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const scrolled = useScrolled();
  useActiveSection(nav);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const outside = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(".nav, .drawer")) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      button.current?.focus();
    };
    // 12 px clear of the viewport's bottom edge, as the bar is of its sides.
    const sheet = shell.current?.querySelector<HTMLElement>(".drawer");
    const fit = () => {
      if (sheet)
        sheet.style.maxHeight = `${innerHeight - sheet.getBoundingClientRect().top - 12}px`;
    };
    const wide = matchMedia(WIDE);
    const page = [...(shell.current?.parentElement?.children ?? [])].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== shell.current && !el.inert,
    );
    for (const el of page) el.inert = true;
    fit();
    document.addEventListener("click", outside);
    document.addEventListener("keydown", onKey);
    addEventListener("resize", fit, { passive: true });
    wide.addEventListener("change", close);
    return () => {
      for (const el of page) el.inert = false;
      if (sheet) sheet.style.maxHeight = "";
      document.removeEventListener("click", outside);
      document.removeEventListener("keydown", onKey);
      removeEventListener("resize", fit);
      wide.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <Menu value={{ open, toggle: () => setOpen((o) => !o), button }}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: closes the menu after a link inside it is followed; the links themselves are the controls */}
      <header
        className="nav-shell"
        data-open={open || undefined}
        ref={shell}
        onClick={(e) => {
          if ((e.target as Element).closest("#site-menu a")) setOpen(false);
        }}
      >
        <div className="nav" ref={nav} data-scrolled={scrolled || undefined}>
          {bar}
        </div>
        <div className="drawer" id="site-menu">
          {drawer}
        </div>
        <div className="nav-scrim" aria-hidden="true" />
      </header>
    </Menu>
  );
}

export function MenuButton({ labels }: { labels: { open: string; close: string } }) {
  const menu = useContext(Menu);
  const open = menu?.open ?? false;
  return (
    <button
      type="button"
      ref={menu?.button}
      className="ib nav-menu"
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
      aria-controls="site-menu"
      onClick={menu?.toggle}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"} />
      </svg>
    </button>
  );
}

// A toggle for the dark theme: pressed while it is on. The theme is known
// only in the browser, so until then the button states nothing.
export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      className={className ? `ib ${className}` : "ib"}
      data-theme-toggle=""
      aria-label={label}
      aria-pressed={mounted ? dark : undefined}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path
          className="theme-moon"
          d="M20.5 13.6A8.5 8.5 0 1 1 10.4 3.5a6.6 6.6 0 0 0 10.1 10.1z"
        />
        <g className="theme-sun">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </g>
      </svg>
    </button>
  );
}
