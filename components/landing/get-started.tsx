"use client";

import { ArrowRight, Check, Copy as CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Panel } from "@/components/ui/panel";
import type { Copy } from "@/lib/copy";
import { localePath } from "@/lib/shared";
import { Heading, Section } from "./section";

const commands = `git clone https://github.com/jma49/Open-CR-Agent.git
cd Open-CR-Agent && npm install && npm run build
npm link --workspace @open-cr-agent/cli
export GEMINI_API_KEY=...
cd your-repository && ocra review`;

export function GetStarted({
  copy,
  locale,
}: {
  copy: Copy["start"];
  locale: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <Heading title={copy.title} body={copy.body} className="mb-8" />
        <Link href={localePath(locale, "/docs/quickstart")} className="btn">
          {copy.docs}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Panel
        label="zsh"
        dark
        accessory={
          <button
            type="button"
            onClick={onCopy}
            className="btn-outline btn-sm gap-1 border-[#3f3f46] text-white/80 hover:bg-white/5 focus-visible:outline-[#7fffd4]"
          >
            <span className="relative size-3" aria-hidden>
              <CopyIcon
                className="swap-icon absolute inset-0 size-3"
                data-shown={!copied}
              />
              <Check
                className="swap-icon absolute inset-0 size-3"
                data-shown={copied}
              />
            </span>
            <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
          </button>
        }
      >
        <pre className="terminal m-0 overflow-x-auto p-5 font-mono text-[12px] leading-7">
          {commands}
        </pre>
      </Panel>
    </Section>
  );
}
