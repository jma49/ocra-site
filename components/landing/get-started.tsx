"use client";

import { ArrowRight, Check, Copy as CopyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { localePath } from "@/lib/shared";
import { Section } from "./section";

type Tab = "cli" | "action";

const snippets: Record<Tab, string> = {
  cli: `git clone https://github.com/jma49/Open-CR-Agent.git
cd Open-CR-Agent && npm install && npm run build
npm link --workspace @open-cr-agent/cli
export GEMINI_API_KEY=...
cd your-repository && ocra review`,
  // Same workflow as the manual's GitHub page.
  action: `name: ocra
on: pull_request

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0
      - uses: jma49/Open-CR-Agent@main
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}`,
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
  const onCopy = async () => {
    clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(snippets[tab]);
      setCopied("done");
    } catch {
      // Clipboard access can be denied; say so instead of doing nothing.
      setCopied("failed");
    }
    reset.current = setTimeout(() => setCopied("idle"), 2000);
  };
  const docs = tab === "cli" ? "/docs/quickstart" : "/docs/github";

  return (
    <Section id="start" labelledBy="start-title" className="lg:pt-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_35rem] lg:items-center lg:gap-14">
        <h2
          id="start-title"
          className={cn(
            "font-semibold",
            locale === "zh"
              ? "text-headline-zh-sm md:text-headline-zh"
              : "text-balance text-headline-sm md:text-[3rem]/[1.15]",
          )}
        >
          <span className="block">{copy.title}</span>
          <span className="block text-fg-subtle">{copy.titleRest}</span>
        </h2>
        <Link
          href={localePath(locale, docs)}
          className="btn btn-lg justify-between"
        >
          {tab === "cli" ? copy.docs : copy.actionDocs}
          <ArrowRight className="size-[18px]" />
        </Link>
      </div>
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_35rem] lg:gap-14">
        <figure className="panel m-0 min-w-0">
          <figcaption className="panel-bar pl-1">
            <fieldset className="m-0 flex min-w-0 border-0 p-0">
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
                    "focus-ring h-11 border-b-2 px-3 font-sans text-sm transition-colors",
                    t === tab
                      ? "border-accent text-fg"
                      : "border-transparent text-fg-subtle hover:text-fg",
                  )}
                >
                  {copy.tabs[t]}
                </button>
              ))}
            </fieldset>
            <button
              type="button"
              onClick={onCopy}
              className="btn-ghost btn-sm shrink-0 gap-1.5"
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
          </figcaption>
          <pre className="m-0 overflow-x-auto p-6 font-mono text-[0.8125rem] leading-7">
            {snippets[tab]}
          </pre>
        </figure>
        <div className="flex flex-col gap-5 text-[0.9375rem] leading-relaxed text-fg-muted">
          <p>{copy.body}</p>
          {tab === "action" ? <p>{copy.actionNote}</p> : null}
        </div>
      </div>
    </Section>
  );
}
