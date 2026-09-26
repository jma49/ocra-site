import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

export function Decisions({ copy }: { copy: Copy["decisions"] }) {
  return (
    <Section>
      <Heading title={copy.title} body={copy.body} />
      <ol className="grid gap-x-14 md:grid-cols-2">
        {copy.items.map((item, i) => (
          <li key={item.title} className="groove flex gap-5 py-7">
            <span className="gel-dot mt-0.5">{i + 1}</span>
            <div>
              <h3 className="text-[1.05rem] font-bold tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[var(--aqua-dim)]">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
