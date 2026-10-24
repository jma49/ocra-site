import type { CSSProperties, ReactNode } from "react";
import { EyesMark, LookingEyes } from "@/components/brand/eyes-mark";
import { fill } from "@/lib/copy/define";
import { span } from "@/lib/landing/pen";
import { isAdded, recordedLine, recordedLines } from "@/lib/landing/recorded";
import { CodeMark } from "./pen/code-mark";
import { Bar, Note } from "./pen/marks";

type MarkSpec = {
  kind: "under" | "double" | "strike" | "ring" | "caret" | "box";
  token: string;
  nth?: number;
  at: number;
};

type NoteSpec = {
  // Centred under (or above) this token; with `end`, at the caret's point
  // just after it.
  token: string;
  nth?: number;
  end?: boolean;
  text: string;
  place: "below" | "above";
  at: number;
  mono?: boolean;
};

type Row =
  | {
      // A recorded line, by number.
      n: number;
      // Reserves room for notes above and below (4.85 em) and never wraps.
      hot?: boolean;
      // The anchored line: the neutral reading band, its number in ink, the
      // margin bar growing at `anchor` ms, and the reader parked here.
      anchor?: number;
      // Shown only below 600 px ("phone") or from 600 px ("wide").
      hide?: "phone" | "wide";
      marks?: MarkSpec[];
      notes?: NoteSpec[];
    }
  // Lines left out, as GitHub folds them; the first fold of a hunk carries
  // its header.
  | { fold: readonly [number, number]; hunk?: string }
  // A non-code row of the same 1.75 em height in the same grid (story 3's
  // label, the agent's quote, a spacer).
  | { custom: ReactNode; key: string };

const KEYWORDS = /\b(export|interface|function|return|const|async|await|import|type)\b/;

// Keywords in weight 500, `//` comments in ink-3; the text is untouched, so
// the row's <code> holds exactly the recorded line.
function Highlighted({ text }: { text: string }) {
  const comment = text.indexOf("//");
  const code = comment < 0 ? text : text.slice(0, comment);
  const parts = code.split(KEYWORDS);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: a fixed recorded line
          <b key={i}>{part}</b>
        ) : (
          part
        ),
      )}
      {comment >= 0 && <i>{text.slice(comment)}</i>}
    </>
  );
}

function noteCol(text: string, note: NoteSpec): number {
  const { col, n } = span(text, note.token, note.nth);
  if (!note.end) return col + n / 2;
  return col + n + (text[col + n] === " " ? 0.5 : 0);
}

// Lines of a changed file as GitHub shows them in a pull request, read from
// the recording at build time (recordedLine; a missing line or token fails
// the build), with the pen's marks and notes in each row's ink overlay (a
// sibling of <code>, aria-hidden) and, with `reader`, a rail of reader eyes:
// "parked" shows only the anchored row's eyes (the finished state); "sweep"
// renders the same cells for a clock to play (13-hero-run.css). Rows carry
// `data-n` and `--r` (their index) for per-row animation; `overlay` holds
// marks that span rows (an Arrow), positioned in em of the code from the
// block's top-left. A focusable, labelled group that scrolls sideways.
export function CodeRows({
  path,
  label,
  rows,
  reader = false,
  foldLabel,
  overlay,
  className,
}: {
  path: string;
  label: string;
  rows: readonly Row[];
  reader?: "sweep" | "parked" | false;
  // A fold row's label, fill()ed with { from, to }: copy window.pr.fold.
  foldLabel?: string;
  overlay?: ReactNode;
  className?: string;
}) {
  const last = recordedLines(path).length;
  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of code lines, not form controls (fieldset)
    <div
      className={className ? `code ${className}` : "code"}
      data-reader={reader || undefined}
      role="group"
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: code that scrolls sideways must take focus to scroll by keyboard
      tabIndex={0}
    >
      {rows.map((row, r) => {
        if ("custom" in row) {
          return (
            <div key={row.key} className="ln ln-custom">
              <div className="ln-c">{row.custom}</div>
            </div>
          );
        }
        if ("fold" in row) {
          const [from, to] = row.fold;
          if (to > last) throw new Error(`CodeRows: ${path} ends at line ${last}, not ${to}`);
          return (
            <div key={`fold-${from}`} className="ln-fold">
              <span className="fold-hunk">{row.hunk ?? "⋮"}</span>
              <span className="fold-range">
                {foldLabel ? fill(foldLabel, { from, to }) : `${from}–${to}`}
              </span>
            </div>
          );
        }
        const text = recordedLine(path, row.n);
        const anchored = row.anchor !== undefined;
        return (
          <div
            key={row.n}
            className="ln"
            data-n={row.n}
            data-hot={row.hot || undefined}
            data-anchor={anchored || undefined}
            data-hide={row.hide}
            style={{ "--r": r } as CSSProperties}
          >
            {reader && (
              <span className="ln-rail" aria-hidden="true">
                <span className="rd">
                  {anchored ? (
                    <LookingEyes size={32} className="is-reader" />
                  ) : (
                    <EyesMark size={32} />
                  )}
                </span>
                {row.anchor !== undefined && <Bar at={row.anchor} />}
              </span>
            )}
            <span className="ln-n" aria-hidden="true">
              {row.n}
            </span>
            <span className="ln-s" aria-hidden="true">
              {isAdded(path, row.n) ? "+" : ""}
            </span>
            <code>
              <Highlighted text={text} />
            </code>
            {(row.marks?.length ?? 0) + (row.notes?.length ?? 0) > 0 && (
              <span className="ln-ink" aria-hidden="true">
                {row.marks?.map((m) => (
                  <CodeMark key={`${m.kind}-${m.token}-${m.nth ?? 1}`} {...m} text={text} />
                ))}
                {row.notes?.map((note) => (
                  <Note
                    key={note.text}
                    col={noteCol(text, note)}
                    at={note.at}
                    place={note.place}
                    mono={note.mono}
                  >
                    {note.text}
                  </Note>
                ))}
              </span>
            )}
          </div>
        );
      })}
      {overlay && (
        <span className="code-ink" aria-hidden="true">
          {overlay}
        </span>
      )}
    </div>
  );
}

// A piece of Maple text that the pen marks (a path in a file list, a chip, a
// tier): the text in <code> with an ink overlay over it, at line-height 1.75
// so CodeMark's geometry holds. It never wraps.
export function InkCode({
  text,
  marks,
  className,
}: {
  text: string;
  marks: readonly MarkSpec[];
  className?: string;
}) {
  return (
    <span className={className ? `ink-code ${className}` : "ink-code"}>
      <code>{text}</code>
      <span className="ln-ink" aria-hidden="true">
        {marks.map((m) => (
          <CodeMark key={`${m.kind}-${m.token}-${m.nth ?? 1}`} {...m} text={text} />
        ))}
      </span>
    </span>
  );
}
