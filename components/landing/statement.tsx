import type { Copy } from "@/lib/copy";
import { Marked } from "./pen/marks";
import { Lines, Section } from "./section";

// The strikes' durations where scroll timelines are missing: a word 420 ms,
// the long one 560 ms, 350 ms apart (motion.md §7).
const STRIKE_MS = [420, 420, 560] as const;

type Count = Copy["statement"]["proof"]["from"];

// One side of the count: the numeral in the display face, its words beside
// it on the numeral's baseline. The arrow leads the second side, so a
// narrow column breaks the count before it.
function Side({ count, className, arrow }: { count: Count; className: string; arrow?: boolean }) {
  return (
    <span className={`qp-side ${className}`}>
      {arrow ? (
        <>
          <span className="qp-arrow" aria-hidden="true">
            →
          </span>
          <span className="sr-only">, </span>
        </>
      ) : null}
      {count.before ? <span className="qp-w">{count.before} </span> : null}
      <span className="t-gauge qp-n">{count.n}</span>
      <span className="qp-w"> {count.after}</span>
    </span>
  );
}

// Quiet by design: the first night band, pure typography (sections.md §5).
// The reviewers' out-of-scope list is struck by the pen as the reader
// scrolls past it, and un-struck on the way back (40-quiet.css); without
// scroll timelines it is struck once at half visibility (motion.tsx). Under
// the statement, the example run's count says the same thing in numbers.
export function Statement({ copy }: { copy: Copy["statement"] }) {
  const proof = copy.proof;
  return (
    <Section ground="night" className="quiet" labelledBy="quiet-title">
      <div className="wrap quiet-grid">
        <h2 className="t-statement" id="quiet-title">
          <Lines lines={copy.lines} />
        </h2>
        <div className="quiet-r">
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
          <p className="t-body quiet-caption">{copy.caption}</p>
        </div>
        <p className="quiet-proof">
          <span className="qp-label">
            {proof.label}
            <span className="sr-only">: </span>
          </span>
          <span className="qp-count">
            <Side count={proof.from} className="qp-from" />
            <Side count={proof.to} className="qp-to" arrow />
          </span>
        </p>
      </div>
    </Section>
  );
}
