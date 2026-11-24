"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

const SHOWN_MS = 1600;

// The install command's Copy button. Its minimum width holds either label,
// so it keeps its width when "Copied" replaces "Copy"; a status line tells
// screen readers. Where the clipboard is refused, the command is selected
// instead, ready to copy by hand.
export function CopyCommand({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const code = button.parentElement?.querySelector("code");
      if (code) getSelection()?.selectAllChildren(code);
      return;
    }
    clearTimeout(timer.current);
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), SHOWN_MS);
  };

  return (
    <>
      <button type="button" className="cmd-copy" data-copied={copied || undefined} onClick={copy}>
        {copied ? done : label}
      </button>
      <span className="sr-only" role="status">
        {copied ? done : ""}
      </span>
    </>
  );
}
