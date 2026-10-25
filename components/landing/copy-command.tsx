"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

const SHOWN_MS = 1600;
const BLINK_MS = 460;

// The final sheet's Copy button. Both labels are rendered in one cell, so
// the button keeps its width when "Copied" replaces "Copy"; a status line
// tells screen readers. The eye row on the pen's clip catches the light
// once in acknowledgement (62-final.css, `data-blink`). Where the clipboard
// is refused, the command is selected instead, ready to copy by hand.
export function CopyCommand({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(
    () => () => {
      for (const t of timers.current) clearTimeout(t);
    },
    [],
  );

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const code = button.closest(".final-install")?.querySelector("code");
      if (code) getSelection()?.selectAllChildren(code);
      return;
    }
    for (const t of timers.current) clearTimeout(t);
    setCopied(true);
    const band = button.closest<HTMLElement>("#final");
    band?.setAttribute("data-blink", "");
    timers.current = [
      window.setTimeout(() => setCopied(false), SHOWN_MS),
      window.setTimeout(() => band?.removeAttribute("data-blink"), BLINK_MS),
    ];
  };

  return (
    <>
      <button
        type="button"
        className="final-copy-btn"
        data-copied={copied || undefined}
        onClick={copy}
      >
        <span className="final-copy-label" data-shown={!copied || undefined}>
          {label}
        </span>
        <span className="final-copy-label" data-shown={copied || undefined}>
          <svg viewBox="0 0 16 14" width="13" height="12" aria-hidden="true">
            <path d="M1.5 7.5 6 12 14.5 1.5" />
          </svg>
          {done}
        </span>
      </button>
      <span className="sr-only" role="status">
        {copied ? done : ""}
      </span>
    </>
  );
}
