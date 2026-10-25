import type { Copy } from "@/lib/copy";
import { Marked } from "./pen/marks";
import { Lines, Section } from "./section";

// The strikes' durations where scroll timelines are missing: a word 420 ms,
// the long one 560 ms, 350 ms apart (motion.md §7).
const STRIKE_MS = [420, 420, 560] as const;

// Quiet by design: the first night band, pure typography (sections.md §5).
// The reviewers' out-of-scope list is struck by the pen as the reader
// scrolls past it, and un-struck on the way back (40-quiet.css); without
// scroll timelines it is struck once at half visibility (motion.tsx).
export function Statement({ copy }: { copy: Copy["statement"] }) {
  return (
    <Section ground="night" className="quiet" labelledBy="quiet-title">
      <div className="wrap quiet-grid">
        <h2 className="t-statement" id="quiet-title">
          <Lines lines={copy.lines} />
        </h2>
        <p className="t-statement-body quiet-lead">{copy.lead}</p>
        <ul className="oos" data-pen="on" data-pen-once="timeline">
          {copy.outOfScope.map((word, i) => (
            <li key={word} className="t-struck">
              <Marked kind="strike" at={i * 350} dur={STRIKE_MS[i]}>
                {word}
              </Marked>
            </li>
          ))}
        </ul>
        <div className="quiet-foot">
          <p className="t-body quiet-caption">{copy.caption}</p>
          <p className="quiet-proof">{copy.proof}</p>
        </div>
      </div>
    </Section>
  );
}
