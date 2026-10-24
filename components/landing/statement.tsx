import type { Copy } from "@/lib/copy";
import { Marked } from "./pen/marks";
import { Lines, Section } from "./section";

// Quiet by design: the first night band, pure typography (sections.md §5).
// Stub from package F: the three out-of-scope words are struck once when the
// list is half in view; P adds the scroll-scrubbed strike (motion.md §7).
export function Statement({ copy }: { copy: Copy["statement"] }) {
  return (
    <Section ground="night" className="quiet">
      <div className="wrap quiet-grid">
        <h2 className="t-statement">
          <Lines lines={copy.lines} />
        </h2>
        <div className="quiet-side">
          <p className="t-statement-body">{copy.lead}</p>
          <ul className="oos" data-pen="on" data-pen-once="0.5">
            {copy.outOfScope.map((word, i) => (
              <li key={word} className="t-struck">
                <Marked kind="strike" at={i * 350}>
                  {word}
                </Marked>
              </li>
            ))}
          </ul>
          <p className="t-body quiet-caption">{copy.caption}</p>
          <p className="t-mono quiet-proof">{copy.proof}</p>
        </div>
      </div>
    </Section>
  );
}
