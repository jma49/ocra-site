import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { span } from "@/lib/landing/pen";
import { recordedLine } from "@/lib/landing/recorded";
import { CodeRows } from "../code";
import { Arrow, Ringed } from "../pen/marks";

const { finding } = exampleRun;
const ROW = 1.75;
const ANCHOR_ROW = 2;
const QUOTE_ROW = 5;

// The arrow from the agent's quote up to the line ocra found it on: out to
// the right of both and back, in em of the code from the code column's
// start (31-figures.css moves the overlay there). The quote is set in line
// 42's own column, so both end at the same column, and the quote sits under
// the code so the arrow passes only line 43's brace.
function quoteArrow() {
  const line = recordedLine(finding.path, finding.line);
  const { col, n } = span(line, finding.quote);
  const end = (col + n) * 0.6;
  const mid = (row: number) => row * ROW + ROW / 2;
  return (
    <Arrow
      from={{ x: end + 1, y: mid(QUOTE_ROW) }}
      to={{ x: end + 0.6, y: mid(ANCHOR_ROW) }}
      dir="right"
      at={1350}
    />
  );
}

// Story figure 3, review · anchor: the agent quotes code, ocra finds the
// quote in the diff and anchors the finding to that line. The reader sweeps
// lines 40–42 and parks on 42 (31-figures.css), then the margin bar grows,
// the arrow joins the quote under the code to its line and the `L42`
// figure is ringed.
// Beats (ms after `.on`): sweep 400–1080; bar 1150; arrow 1350; ring 1700;
// the note at 2200.
export function FigureReview({ f }: { f: Copy["how"]["figures"] }) {
  return (
    <>
      <div className="fig-l42">
        <Ringed at={1700} w={1.16} h={0.9} className="t-figure l42">
          L{finding.line}
        </Ringed>
        <p className="fig-found">
          <span className="fig-found-note">{f.found}</span>
          <span className="fig-found-path">{finding.path}</span>
        </p>
      </div>
      <CodeRows
        path={finding.path}
        label={`${finding.path}, ${finding.line - 2}–${finding.line + 1}`}
        reader="parked"
        className="fig-code"
        rows={[
          { n: finding.line - 2, hide: "phone" },
          { n: finding.line - 1 },
          { n: finding.line, anchor: 1150 },
          { n: finding.line + 1, hide: "phone" },
          { key: "label", custom: <span className="fig-quotes">{f.quotes}</span> },
          { key: "quote", custom: <span className="fig-quote">{finding.quote}</span> },
        ]}
        overlay={quoteArrow()}
      />
    </>
  );
}
