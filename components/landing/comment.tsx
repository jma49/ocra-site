import { exampleRun } from "@/lib/landing/example-run";

const { finding } = exampleRun;
// The engine's own words in its inline comment (packages/vcs-platform/src/
// render.ts, inlineBody): English in every language.
const VERIFIED = "verified";
const SUGGESTION = "Suggestion:";

// The GitHub Action posts as github-actions[bot]; its avatar is the Actions
// mark, drawn as a play glyph in a ring.
export function BotAvatar() {
  return (
    <span className="bot-avatar" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
        <path d="M5.5 3.8v8.4L12 8z" fill="currentColor" />
      </svg>
    </span>
  );
}

// ocra's inline comment on the example run's finding, as the engine writes
// it (inlineBody): the severity mark (🔴, drawn as the pen dot), the title,
// severity, verification and reviewer on one line, the reason, then the
// suggestion with what it inserts on the pen wash. Every word of it is the
// recording's; `onLine` ("line 42") and `label` (the article's name) are
// copy.
export function Comment({ onLine, label }: { onLine: string; label: string }) {
  const cut = finding.suggestion.indexOf(
    finding.insert,
    finding.suggestion.indexOf(finding.insertAfter),
  );
  return (
    <article className="comment" aria-label={label}>
      <header className="cm-who">
        <BotAvatar />
        <strong>github-actions</strong>
        <span className="cm-bot">bot</span>
        <span className="cm-on">{onLine}</span>
      </header>
      <p className="cm-title">
        <span className="sev-dot" aria-hidden="true" />
        <strong>{finding.title}</strong>
        {` · ${finding.severity} · ${VERIFIED} · ${finding.reviewer}`}
      </p>
      <p className="cm-body">{finding.body}</p>
      <p className="cm-sug">
        <strong>{SUGGESTION}</strong>{" "}
        <code>
          {finding.suggestion.slice(0, cut)}
          <ins>{finding.insert}</ins>
          {finding.suggestion.slice(cut + finding.insert.length)}
        </code>
      </p>
    </article>
  );
}
