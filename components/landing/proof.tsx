import type { Copy } from "@/lib/copy";

// Four facts under the hero, each with the line that backs it.
export function Proof({ copy }: { copy: Copy["proof"] }) {
  return (
    <section className="proof" aria-label={copy.label}>
      <ul className="wrap proof-in">
        {copy.items.map((item) => (
          <li key={item.title}>
            <b>{item.title}</b>
            <span>{item.body}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
