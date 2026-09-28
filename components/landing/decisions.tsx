import { ArrowRight, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

function Visual({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border border-border bg-bg-subtle px-3 py-2.5 font-mono text-[11px] text-fg-muted"
    >
      {children}
    </div>
  );
}

function Off({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-fg-subtle line-through decoration-fg-subtle">
      <X className="size-3 shrink-0" />
      {children}
    </span>
  );
}

function On({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-fg">
      <Check className="size-3 shrink-0 text-accent" />
      {children}
    </span>
  );
}

// One small, concrete picture per decision, in the order of the items. The
// text inside is either code (left untranslated) or from the copy.
function visuals(v: Copy["decisions"]["visuals"]): ReactNode[] {
  return [
    <Visual key="line">
      <span className="text-fg">
        "return session.expiresAt &lt; Date.now();"
      </span>
      <ArrowRight className="size-3" />
      <span>
        {v.located} <span className="text-accent">session.ts:42</span>
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
      <span className="text-fg">$0.0062</span>
    </Visual>,
    <Visual key="failback">
      <span className="flex items-center gap-1 text-fg-subtle">
        <X className="size-3" />
        gemini-3.5-flash 503
      </span>
      <ArrowRight className="size-3" />
      <On>gemini-flash-lite-latest</On>
    </Visual>,
  ];
}

export function Decisions({
  copy,
  locale,
}: {
  copy: Copy["decisions"];
  locale: string;
}) {
  const pictures = visuals(copy.visuals);
  return (
    <Section id="decisions" labelledBy="decisions-title" className="lg:pt-8">
      <Heading
        id="decisions-title"
        title={copy.title}
        body={copy.body}
        locale={locale}
      />
      <ol className="mt-16 grid list-none gap-x-10 gap-y-14 p-0 md:grid-cols-2 xl:grid-cols-3">
        {copy.items.map((item, i) => (
          <li
            key={item.title}
            className="flex min-w-0 flex-col gap-3 border-t border-border pt-5"
          >
            <span className="font-mono text-[0.8125rem] text-accent">
              [{String(i + 1).padStart(2, "0")}]
            </span>
            <h3 className="text-xl font-semibold leading-snug tracking-[-0.01em]">
              {item.title}
            </h3>
            <p className="mb-2 text-[0.9375rem] leading-relaxed text-fg-muted">
              {item.body}
            </p>
            {pictures[i]}
          </li>
        ))}
      </ol>
    </Section>
  );
}
