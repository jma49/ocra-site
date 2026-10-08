import type { ReactNode } from "react";
import { EyesMark } from "@/components/brand/eyes-mark";
import { exampleRun } from "@/lib/landing/example-run";

const { finding } = exampleRun;
const KEYWORDS = /(export function|return)/;

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

// The finding's suggestion as ocra posts it in the inline comment today: one
// plain line after the reason (`**Suggestion:** …` in the engine's
// packages/vcs-platform/src/render.ts). The label is the engine's own and is
// English in every language. Committable suggestions are only on the roadmap.
function Suggestion() {
  return (
    <p className="sugg-line">
      <strong>Suggestion:</strong>
      {` ${finding.suggestion}`}
    </p>
  );
}

// The example bug around the line the agent quoted, from the recorded run.
// `tip` is shown on the quoted line.
export function SessionCode({ tip }: { tip?: ReactNode }) {
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
        return (
          <div key={n} className={quoted ? "l q" : "l"}>
            <span className="n">{n}</span>
            <span className="src">
              <Highlighted text={text} />
              {quoted && tip}
            </span>
          </div>
        );
      })}
    </figure>
  );
}

// ocra's inline comment on the finding. In the pull request it carries the
// line number and folds open as the replay reaches it; in the lifecycle
// thread it shows the fingerprint.
export function FindingComment({
  variant,
  title,
  body,
  onLine,
  tip,
}: {
  variant: "pr" | "thread";
  title: string;
  body: string;
  onLine?: string;
  tip?: ReactNode;
}) {
  const content = (
    <>
      <SessionCode tip={tip} />
      <div className="cmt-b">
        <div className="tags">
          <span className="tag t-crit">{finding.severity}</span>
          <span className="tag t-ok">verified</span>
          <span className="tag t-plain">
            {variant === "thread"
              ? `${finding.reviewer} · ${finding.fingerprint}`
              : finding.reviewer}
          </span>
        </div>
        <strong className="fg">{title}</strong> {body}
        <Suggestion />
      </div>
    </>
  );
  return (
    <>
      <div className="cmt-h">
        <span className="av">
          <EyesMark size={16} />
        </span>
        <span>
          <strong>ocra</strong> · <code>{finding.path}</code>
          {onLine && ` ${onLine} ${finding.line}`}
        </span>
      </div>
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
