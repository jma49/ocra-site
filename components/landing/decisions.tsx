import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

export function Decisions({ copy }: { copy: Copy["decisions"] }) {
  return (
    <Section>
      <Heading title={copy.title} body={copy.body} />
      <ol className="grid gap-x-16 md:grid-cols-2">
        {copy.items.map((item, i) => (
          <li
            key={item.title}
            className="flex gap-5 border-t border-[var(--border)] py-8"
          >
            <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-[var(--fg-subtle)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.015em]">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[var(--fg-muted)]">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
