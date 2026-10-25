import type { CSSProperties, ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { CodeRows } from "../code";
import { BotAvatar } from "../comment";

type LifeCopy = Copy["lifecycle"];
type LifeState = keyof LifeCopy["tabs"];

const { finding } = exampleRun;
// The engine's word for a finding its verifier confirmed (packages/
// vcs-platform/src/render.ts, inlineBody): engine output, English in every
// language, like the title and the severity.
const VERIFIED = "verified";
// The GitHub Action posts as github-actions[bot].
const BOT = "github-actions";

// The pieces of the lifecycle's conversation thread that never change with
// its state, rendered on the server: the file and line in its header, line
// 42 as GitHub shows a thread's line (the pen strikes it in the Fixed state,
// as the line is gone), and ocra's comment collapsed to its title row. The
// thread quotes the example run's finding; what happens to it after a push
// is an illustration (the chip and the caption say so).
export function ThreadFile({ onLine }: { onLine: string }) {
  return (
    <span className="lt-file">
      <code>{finding.path}</code>
      <span className="lt-on">{onLine}</span>
    </span>
  );
}

export function ThreadLine({ onLine }: { onLine: string }) {
  return (
    <CodeRows
      className="lt-code"
      path={finding.path}
      label={`${finding.path}, ${onLine}`}
      rows={[{ n: finding.line, marks: [{ kind: "strike", token: finding.quote, at: 400 }] }]}
    />
  );
}

export function ThreadComment() {
  return (
    <div className="lt-item lt-comment">
      <BotAvatar />
      <div className="lt-main">
        <p className="lt-who">
          <strong>{BOT}</strong> <span className="cm-bot">bot</span>
        </p>
        <p className="lt-title">
          <span className="sev-dot" aria-hidden="true" />
          <strong>{finding.title}</strong>
          <span className="lt-sep"> · </span>
          <span className="lt-meta">{`${finding.severity} · ${VERIFIED}`}</span>
        </p>
      </div>
    </div>
  );
}

// GitHub's timeline glyphs, in ink: a commit, a resolved conversation.
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const ICONS = {
  push: (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" {...STROKE}>
      <circle cx="8" cy="8" r="2.7" />
      <path d="M1.2 8h4.1M10.7 8h4.1" />
    </svg>
  ),
  resolved: (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" {...STROKE}>
      <path d="M3.6 8.4 6.7 11.4 12.5 4.8" />
    </svg>
  ),
} as const;

// One event in the thread's timeline; `at` is when it appears after its
// state is entered (motion.md §10), only with motion.
function Event({
  icon,
  at,
  className,
  children,
}: {
  icon: keyof typeof ICONS;
  at: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={className ? `lt-row lt-event ${className}` : "lt-row lt-event"}
      style={{ "--t": `${at}ms` } as CSSProperties}
    >
      <span className={`lt-badge lt-badge-${icon}`}>{ICONS[icon]}</span>
      <span className="lt-text">{children}</span>
    </p>
  );
}

// "github-actions resolved this conversation": the actor in bold, as GitHub
// sets it, when the sentence starts with the actor's name (it does in both
// languages).
function Actor({ name, sentence }: { name: string; sentence: string }) {
  if (!sentence.startsWith(name)) return sentence;
  return (
    <>
      <strong>{name}</strong>
      {sentence.slice(name.length)}
    </>
  );
}

// What happens after the comment, per state, as GitHub's timeline sets it
// under a thread: the stacked variants lifecycle-states.tsx shows one of. Reported: the author pushed and the
// line is unchanged, so the thread stays open. Fixed: the push removed the
// line; ocra resolves the thread. Dismissed: a maintainer declines it and
// resolves the thread.
export function threadEvents(copy: LifeCopy): Record<LifeState, ReactNode> {
  const initial = copy.maintainer.slice(0, 1).toUpperCase();
  return {
    reported: (
      <Event icon="push" at={200} className="lt-push">
        {copy.pushed}
      </Event>
    ),
    fixed: (
      <>
        <Event icon="push" at={200} className="lt-push">
          {copy.pushed}
        </Event>
        <Event icon="resolved" at={1000}>
          <Actor name={BOT} sentence={copy.resolvedBot} />
        </Event>
      </>
    ),
    dismissed: (
      <>
        <p className="lt-row lt-event lt-reply" style={{ "--t": "200ms" } as CSSProperties}>
          <span className="lt-avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="lt-text">
            <strong>{copy.maintainer}</strong> <span className="lt-said">{copy.reply}</span>
          </span>
        </p>
        <Event icon="resolved" at={700}>
          <Actor name={copy.maintainer} sentence={copy.resolvedMaintainer} />
        </Event>
      </>
    ),
  };
}
