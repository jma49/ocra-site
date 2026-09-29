"use client";

import { ArrowRight, Check, Copy as CopyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath } from "@/lib/shared";
import { Heading, Section } from "./section";

type Tab = "cli" | "action";

const snippets: Record<Tab, { label: string; text: string }> = {
  cli: {
    label: "zsh",
    text: `npm install -g @open-cr-agent/cli
export GEMINI_API_KEY=...
export OCRA_MODEL_TOP=google/gemini-3.1-pro-preview
export OCRA_MODEL_STANDARD=google/gemini-3.5-flash
export OCRA_MODEL_LIGHT=google/gemini-flash-lite-latest
cd your-repository && ocra review --from main`,
  },
  // The manual's GitHub page, with models set in env.
  action: {
    label: ".github/workflows/ocra.yml",
    text: `name: ocra
on: pull_request

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: ocra-\${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: jma49/Open-CR-Agent@v0.1.1
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          OCRA_MODEL_TOP: google/gemini-3.1-pro-preview
          OCRA_MODEL_STANDARD: google/gemini-3.5-flash
          OCRA_MODEL_LIGHT: google/gemini-flash-lite-latest`,
  },
};

export function GetStarted({
  copy,
  locale,
}: {
  copy: Copy["start"];
  locale: string;
}) {
  const [tab, setTab] = useState<Tab>("cli");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(reset.current), []);
  const snippet = snippets[tab];
  const onCopy = async () => {
    clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(snippet.text);
      setCopied("done");
    } catch {
      // Clipboard access can be denied; say so instead of doing nothing.
      setCopied("failed");
    }
    reset.current = setTimeout(() => setCopied("idle"), 2000);
  };

  return (
    <Section band className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <Heading
          index={6}
          title={copy.title}
          body={copy.body}
          className="mb-8"
        />
        <fieldset className="m-0 inline-flex min-w-0 rounded-lg border border-border p-1">
          <legend className="sr-only">{copy.title}</legend>
          {(Object.keys(snippets) as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={t === tab}
              onClick={() => {
                setTab(t);
                setCopied("idle");
              }}
              className={cn(
                "focus-ring rounded-[4px] px-3 py-1.5 text-sm transition-colors",
                t === tab ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
              )}
            >
              {copy.tabs[t]}
            </button>
          ))}
        </fieldset>
        {tab === "action" ? (
          <p className="mt-5 text-sm leading-relaxed text-fg-muted">
            {copy.actionNote}
          </p>
        ) : null}
        <div className="mt-8">
          <Link
            href={localePath(
              locale,
              tab === "cli" ? "/docs/quickstart" : "/docs/github",
            )}
            className="btn"
          >
            {tab === "cli" ? copy.docs : copy.actionDocs}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
      <Panel
        label={snippet.label}
        dark
        accessory={
          <button
            type="button"
            onClick={onCopy}
            className="btn-outline btn-sm gap-1 border-term-border-strong text-term-strong/80 hover:bg-term-strong/5 focus-visible:outline-term-ok"
          >
            <span className="relative size-3" aria-hidden>
              <CopyIcon
                className="swap-icon absolute inset-0 size-3"
                data-shown={copied !== "done"}
              />
              <Check
                className="swap-icon absolute inset-0 size-3"
                data-shown={copied === "done"}
              />
            </span>
            <span aria-live="polite">
              {copied === "done"
                ? copy.copied
                : copied === "failed"
                  ? copy.copyFailed
                  : copy.copy}
            </span>
          </button>
        }
      >
        <pre className="terminal m-0 overflow-x-auto p-5 font-mono text-[12px] leading-7">
          {snippet.text}
        </pre>
      </Panel>
    </Section>
  );
}
