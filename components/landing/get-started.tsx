"use client";

import { ArrowRight, Check, Copy as CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Window } from "@/components/aqua/window";
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
        <Link href={localePath(locale, "/docs/quickstart")} className="gel">
          {copy.docs}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Window
        title="Terminal — zsh"
        accessory={
          <button
            type="button"
            onClick={onCopy}
            className="gel-plain gel-small gap-1"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <CopyIcon className="size-3" />
            )}
            {copied ? copy.copied : copy.copy}
          </button>
        }
      >
        <pre className="terminal m-0 overflow-x-auto rounded-b-[5px] p-5 font-mono text-[12px] leading-7">
          {commands}
        </pre>
      </Window>
    </Section>
  );
}
