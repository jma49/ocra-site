import type { Copy } from "@/lib/copy";
import { Lines, Section } from "./section";

// Plain answers (sections.md §10). Stub from package F; C builds it out.
export function Faq({ copy }: { copy: Copy["faq"] }) {
  return (
    <Section ground="paper-2" className="faq">
      <div className="wrap faq-grid">
        <h2 className="t-h2 faq-title">
          <Lines lines={copy.lines} />
        </h2>
        <div className="faq-list">
          {copy.items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary className="t-h4">{item.q}</summary>
              <p className="t-body">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
