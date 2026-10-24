import type { Copy } from "@/lib/copy";
import { exampleRun, terminalLines } from "@/lib/landing/example-run";
import { CodeRows } from "../code";
import { BotAvatar, Comment } from "../comment";
import { KeyGlyph } from "../pen/marks";
import { WindowTabs } from "./window-tabs";

const { finding, diff } = exampleRun;
const insert = finding.insert.trim();

// The pull request pane in its finished state: the recorded rows the
// finding's evidence cites (16, 21) and the function (40–43), line 42
// marked by the pen, the comment and the summary row. H adds the clock
// (data-pen="clock" on #review, review-clock.tsx) that plays it.
function Review({ copy }: { copy: Copy["window"] }) {
  return (
    <div className="review" id="review">
      <div className="sheet-bar">
        <span className="url">{copy.urls.pr}</span>
      </div>
      <div className="file-h">
        <span className="file-path">{diff.path}</span>
        <span className="file-stat">
          +{diff.additions} −{diff.deletions}
        </span>
      </div>
      <CodeRows
        path={diff.path}
        label={copy.pr.codeLabel}
        reader="parked"
        foldLabel={copy.pr.fold}
        rows={[
          { fold: [5, 15], hunk: diff.hunk },
          { n: 16 },
          { fold: [17, 20] },
          { n: 21 },
          { fold: [22, 39] },
          { n: 40 },
          { n: 41 },
          {
            n: finding.line,
            hot: true,
            anchor: 1700,
            marks: [
              { kind: "under", token: "session.expiresAt", at: 1900 },
              { kind: "under", token: "Date.now()", at: 2640 },
              { kind: "caret", token: finding.insertAfter, at: 3330 },
            ],
            notes: [
              { token: "session.expiresAt", text: copy.pr.notes.seconds, place: "below", at: 2140 },
              { token: "Date.now()", text: copy.pr.notes.milliseconds, place: "below", at: 2830 },
              {
                token: finding.insertAfter,
                end: true,
                text: insert,
                place: "above",
                at: 3520,
                mono: true,
              },
            ],
          },
          { n: 43 },
        ]}
      />
      <div className="review-foot">
        <Comment onLine={copy.pr.onLine} label={copy.pr.commentLabel} />
        <div className="summary-row">
          <BotAvatar />
          <strong>github-actions</strong>
          <span>ocra review ·</span>
          <span className="sev-octagon" aria-hidden="true" />
          <strong>{exampleRun.summaryHeading}</strong>
          <span className="summary-label">{copy.pr.summaryLabel}</span>
        </div>
      </div>
    </div>
  );
}

function Terminal({ copy }: { copy: Copy["window"] }) {
  return (
    <div className="term-pane">
      <div className="sheet-bar">
        <span className="url">{copy.urls.terminal}</span>
      </div>
      <pre
        className="term"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: output that scrolls must take focus to scroll by keyboard
        tabIndex={0}
      >
        {terminalLines.map(([text, tone]) => (
          <span key={text} className={tone ? `term-${tone}` : undefined}>{`${text}\n`}</span>
        ))}
      </pre>
    </div>
  );
}

// The desk under the hero: two tabs over two stacked sheets, the Example run
// chip, and the caption that says what the example is.
export function ProductWindow({ copy }: { copy: Copy["window"] }) {
  return (
    <figure className="product" id="product">
      <WindowTabs
        labels={copy.tabs}
        tablist={copy.tablist}
        chip={copy.exampleChip}
        panes={{ pr: <Review copy={copy} />, terminal: <Terminal copy={copy} /> }}
      />
      <figcaption id="product-cap" className="product-cap t-small">
        <span>{copy.example}</span>
        {copy.pr.gloss && <span className="product-gloss">{copy.pr.gloss}</span>}
        <span className="product-key">
          <span>
            <KeyGlyph kind="under" />
            {copy.pr.key.units}
          </span>
          <span>
            <KeyGlyph kind="caret" />
            {copy.pr.key.fix}
          </span>
          <span>
            <KeyGlyph kind="bar" />
            {copy.pr.key.anchor}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
