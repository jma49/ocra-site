import { ArrowRight, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

function Visual({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 font-mono text-[11.5px] text-[var(--fg-muted)]"
    >
      {children}
    </div>
  );
}

function Off({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-[var(--fg-subtle)] line-through decoration-[var(--fg-subtle)]">
      <X className="size-3 shrink-0" />
      {children}
    </span>
  );
}

function On({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-[var(--fg)]">
      <Check className="size-3 shrink-0 text-[var(--accent)]" />
      {children}
    </span>
  );
}

// One small, concrete picture per decision, in the order of the items. The
// text inside is either code (left untranslated) or from the copy.
function visuals(v: Copy["decisions"]["visuals"]): ReactNode[] {
  return [
    <Visual key="line">
      <span className="text-[var(--fg)]">
        "return session.expiresAt &lt; Date.now();"
      </span>
      <ArrowRight className="size-3" />
      <span>
        {v.located} <span className="text-[var(--accent)]">session.ts:42</span>
      </span>
    </Visual>,
    <Visual key="scope">
      {v.outOfScope.map((item) => (
        <Off key={item}>{item}</Off>
      ))}
    </Visual>,
    <Visual key="tools">
      <On>read_file</On>
      <On>read_diff</On>
      <On>code_search</On>
      <Off>edit</Off>
      <Off>bash</Off>
      <Off>webfetch</Off>
    </Visual>,
    <Visual key="machine">
      {v.machine.map((item) => (
        <Off key={item}>{item}</Off>
      ))}
    </Visual>,
    <Visual key="bill">
      <span>tokens: 19558 in (15360 cached), 118 out, 0 reasoning</span>
      <span className="text-[var(--fg)]">$0.0062</span>
    </Visual>,
    <Visual key="failback">
      <span className="flex items-center gap-1 text-[var(--fg-subtle)]">
        <X className="size-3" />
        gemini-3.5-flash 503
      </span>
      <ArrowRight className="size-3" />
      <On>gemini-flash-lite-latest</On>
    </Visual>,
  ];
}

export function Decisions({ copy }: { copy: Copy["decisions"] }) {
  const pictures = visuals(copy.visuals);
  return (
    <Section band>
      <Heading index={2} title={copy.title} body={copy.body} />
      <ol className="grid gap-x-16 md:grid-cols-2">
        {copy.items.map((item, i) => (
          <li
            key={item.title}
            className="flex gap-5 border-t border-[var(--border)] py-8"
          >
            <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-[var(--fg-subtle)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[var(--fg-muted)]">
                {item.body}
              </p>
              {pictures[i]}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
