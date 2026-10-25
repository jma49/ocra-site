import { EyesMark } from "@/components/brand/eyes-mark";
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

// The header of ocra's summary comment, collapsed, as GitHub lists it: it is
// posted with the inline comment at the end of the run. Below 600 px it
// closes the sheet; wider, it is a card of its own, laid over the sheet's
// lower-left corner (11-window.css). The heading is the engine's
// (render.ts: "## ocra review · 🛑 Significant concerns"), the octagon
// drawn by the pen.
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

// Where the comment will land, until it lands (13-hero-run.css): one row at
// the top of the comment's place, the eye row and what it is doing, reading
// the change, then checking the line it will anchor. The comment covers it
// in place. Only the theatre shows it; the finished review, Reduce motion
// and no JavaScript never do.
function Pending({ says }: { says: Copy["window"]["pr"]["pending"] }) {
  return (
    <div className="pending" aria-hidden="true">
      <EyesMark size={24} className="pending-eyes" />
      <span className="pending-says">
        <span className="pending-read">{says.reading}</span>
        <span className="pending-check">{says.checking}</span>
      </span>
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
// (motion.md §4, compressed so the comment is in by about 3 s after load;
// the reader's own beats are in 13-hero-run.css). Rendered finished;
// review-clock.tsx plays it. The leaf is the sheet's printed face, clipped
// to the paper (11-window.css); the summary card lies outside it.
export function Review({ copy }: { copy: Copy["window"] }) {
  return (
    <ReviewClock>
      <div className="leaf">
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
              anchor: 860,
              marks: [
                { kind: "under", token: "session.expiresAt", at: 900 },
                { kind: "under", token: "Date.now()", at: 1100 },
                { kind: "caret", token: finding.insertAfter, at: 1290 },
              ],
              notes: [
                {
                  token: "session.expiresAt",
                  text: copy.pr.notes.seconds,
                  place: "below",
                  at: 980,
                },
                { token: "Date.now()", text: copy.pr.notes.milliseconds, place: "below", at: 1170 },
                {
                  token: finding.insertAfter,
                  end: true,
                  text: insert,
                  place: "above",
                  at: 1350,
                  mono: true,
                },
              ],
            },
            { n: 43 },
          ]}
        />
        <div className="review-foot">
          <Pending says={copy.pr.pending} />
          <Comment onLine={copy.pr.onLine} label={copy.pr.commentLabel} />
        </div>
      </div>
      <SummaryRow label={copy.pr.summaryLabel} />
    </ReviewClock>
  );
}
