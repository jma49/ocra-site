import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { CodeRows } from "../code";
import { BotAvatar, Comment } from "../comment";
import { ReviewClock } from "./review-clock";

const { finding, diff } = exampleRun;
const insert = finding.insert.trim();

// "Example run", wherever the recorded run appears; it points at the
// caption that says what the run is. Below 600 px it moves from the desk's
// tab row into each sheet bar (11-window.css shows one or the other).
export function ExampleChip({ label, where = "bar" }: { label: string; where?: "desk" | "bar" }) {
  return (
    <span
      className={
        where === "desk" ? "chip chip-example on-stone desk-chip" : "chip chip-example bar-chip"
      }
      aria-describedby="product-cap"
    >
      {label}
    </span>
  );
}

// The header of ocra's summary comment, collapsed, as GitHub lists it under
// the inline comment: both are posted together at the end of the run. The
// heading is the engine's (render.ts: "## ocra review · 🛑 Significant
// concerns"), the octagon drawn by the pen.
function SummaryRow({ label }: { label: string }) {
  return (
    <div className="summary-row">
      <BotAvatar />
      <strong className="summary-who">github-actions</strong>
      <span className="summary-head">
        <span>ocra review ·</span>
        <span className="sev-octagon" aria-hidden="true" />
        <strong>{exampleRun.summaryHeading}</strong>
      </span>
      <span className="summary-label">{label}</span>
    </div>
  );
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M2.75 8a5.25 5.25 0 1 0 1.6-3.77M2.5 2.25v2.5h2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The pull request pane: the recorded rows the finding's evidence cites (16,
// 21) and the function (40–43), as GitHub shows them; the reader reads them,
// the pen marks line 42, then the comment and the summary row land
// (motion.md §4). Rendered finished; review-clock.tsx plays it.
export function Review({ copy }: { copy: Copy["window"] }) {
  return (
    <ReviewClock>
      <div className="sheet-bar">
        <span className="url">{copy.urls.pr}</span>
        <ExampleChip label={copy.exampleChip} />
        <button type="button" className="replay" data-replay="" aria-label={copy.pr.replayLabel}>
          <ReplayIcon />
          <span>{copy.pr.replay}</span>
        </button>
      </div>
      <div className="file-h">
        <span className="file-path">{diff.path}</span>
        <span className="file-stat">
          <span className="file-add">+{diff.additions}</span>{" "}
          <span className="file-del">−{diff.deletions}</span>
        </span>
      </div>
      <CodeRows
        path={diff.path}
        label={copy.pr.codeLabel}
        reader="sweep"
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
        <SummaryRow label={copy.pr.summaryLabel} />
      </div>
    </ReviewClock>
  );
}
