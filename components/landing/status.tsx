import { Check, Circle } from "lucide-react";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

export function Status({ copy }: { copy: Copy["status"] }) {
  return (
    <Section>
      <Heading title={copy.title} />
      <ol className="panel divide-y divide-[var(--border)]">
        {copy.items.map((item) => (
          <li
            key={item.milestone}
            className="grid gap-2 px-6 py-5 md:grid-cols-[3rem_11rem_1fr_7rem] md:items-center"
          >
            <span className="font-mono text-sm text-[var(--fg-subtle)]">
              {item.milestone}
            </span>
            <span className="font-medium">{item.title}</span>
            <span className="text-sm leading-relaxed text-[var(--fg-muted)]">
              {item.body}
            </span>
            <span
              className={
                item.done
                  ? "flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] md:justify-end"
                  : "flex items-center gap-1.5 text-xs text-[var(--fg-subtle)] md:justify-end"
              }
            >
              {item.done ? (
                <Check className="size-3.5" />
              ) : (
                <Circle className="size-3" />
              )}
              {item.state}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
