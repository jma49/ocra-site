import type { ReactNode } from "react";
import { exampleRun } from "@/lib/landing/example-run";

const { finding } = exampleRun;
const KEYWORDS = /(export function|return)/;
const INDENT = /^\s*/;

function Highlighted({ text }: { text: string }) {
  return text.split(KEYWORDS).map((part, i) =>
    KEYWORDS.test(part) ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: fixed line of code
      <span key={i} className="kw">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// The finding's suggestion as ocra posts it for this run: one plain line
// after the reason (`**Suggestion:** …`, inlineBody in the engine's
// packages/vcs-platform/src/render.ts). The engine adds a committable
// suggestion block only for a structured fix, which this recording's
// scripted model does not give. The label is the engine's own and is English
// in every language.
function Suggestion() {
  return (
    <p>
      <strong>Suggestion:</strong>
      {` ${finding.suggestion}`}
    </p>
  );
}

// The GitHub Action posts as github-actions[bot]; its avatar is the Actions
// mark, drawn here as a plain play glyph in a ring.
export function BotAvatar({ small }: { small?: boolean }) {
  return (
    <span className={small ? "av av-sm" : "av"} aria-hidden="true">
      <svg viewBox="0 0 16 16" width={small ? 10 : 13} height={small ? 10 : 13} aria-hidden="true">
        <path d="M5.5 3.8v8.4L12 8z" fill="currentColor" />
      </svg>
    </span>
  );
}

// The example bug around the line the agent quoted, from the recorded run.
// `tip` is shown on the quoted line. With `withFix`, the suggestion follows
// the quoted line as the line that replaces it, shown only in the fixed state
// of the lifecycle (data-in).
export function SessionCode({ tip, withFix }: { tip?: ReactNode; withFix?: boolean }) {
  return (
    <figure
      className="code"
      aria-label={finding.path}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: code that scrolls sideways must take focus to scroll by keyboard
      tabIndex={0}
    >
      {finding.code.map((text, i) => {
        const n = finding.firstLine + i;
        const quoted = n === finding.line;
        const line = (
          <div key={n} className={quoted ? "l q" : "l"}>
            <span className="n">{n}</span>
            <span className="src">
              <Highlighted text={text} />
              {quoted && tip}
            </span>
          </div>
        );
        if (!quoted || !withFix) return line;
        return [
          line,
          <div key={`${n}-fix`} className="l add" data-in="fixed">
            <span className="n">{n}</span>
            <span className="src">
              <Highlighted text={`${INDENT.exec(text)?.[0] ?? ""}${finding.suggestion}`} />
            </span>
          </div>,
        ];
      })}
    </figure>
  );
}

// ocra's inline comment on the finding, as the engine writes it (inlineBody
// in packages/vcs-platform/src/render.ts): the severity icon, the title,
// severity, verification and reviewer on one line, the reason, then the
// suggestion. GitHub shows the commented lines above it. In the pull request
// it folds open as the replay reaches it.
export function FindingComment({
  variant,
  title,
  body,
  onLine,
  tip,
  withFix,
}: {
  variant: "pr" | "thread";
  title: string;
  body: string;
  onLine?: string;
  tip?: ReactNode;
  withFix?: boolean;
}) {
  const content = (
    <>
      <SessionCode tip={tip} withFix={withFix} />
      <div className="cmt-row">
        <BotAvatar />
        <div className="md">
          <p className="cmt-who">
            <strong>github-actions</strong> <span className="bot">bot</span>
          </p>
          <p>
            🔴 <strong>{title.replace(/[.。]$/, "")}</strong> · {finding.severity} · verified ·{" "}
            {finding.reviewer}
          </p>
          <div className="cmt-detail">
            <p>{body}</p>
            <Suggestion />
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      <header className="cmt-h file-h">
        <code>{finding.path}</code>
        {onLine && (
          <span>
            {onLine} {finding.line}
          </span>
        )}
      </header>
      {variant === "pr" ? (
        <div className="fold">
          <div className="fold-in">{content}</div>
        </div>
      ) : (
        content
      )}
    </>
  );
}
