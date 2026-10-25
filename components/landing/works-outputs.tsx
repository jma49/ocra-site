import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import { exampleRun, terminalLines } from "@/lib/landing/example-run";
import { BotAvatar } from "./comment";

type WorksCopy = Copy["works"];
const { finding, summaryHeading } = exampleRun;

// The terminal's last words: the verdict block and the finding's line under
// it, verbatim (terminalLines; recorded.ts checks them against the
// transcript). A recording without them fails the build.
const verdictAt = terminalLines.findIndex(([text]) => text.startsWith("Verdict:"));
const verdict = terminalLines[verdictAt]?.[0];
const critical = terminalLines[verdictAt + 1];
if (!verdict || critical?.[1] !== "w") throw new Error("works: no verdict and finding line");
const TERMINAL = [
  ...verdict.split("\n").map((text) => ({ text, warn: false })),
  {
    text: critical[0],
    warn: true,
  },
];

// The summary's heading as the engine writes it (render.ts: "## ocra review
// · 🛑 Significant concerns"), the octagon drawn by the pen.
function Heading() {
  return (
    <span className="wo-head">
      <span>ocra review ·</span>
      <span className="sev-octagon" />
      <strong>{summaryHeading}</strong>
    </span>
  );
}

// The inline comment's first line (inlineBody): the severity dot, the
// title, the severity (left to the dot where the paper is narrow).
function Title() {
  return (
    <span className="wo-title">
      <span className="sev-dot" />
      <strong>{finding.title}</strong>
      <span className="wo-sev">{` · ${finding.severity}`}</span>
    </span>
  );
}

function ResolveIcon() {
  return (
    <svg className="wo-resolve" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M5.4 8.2 7.2 10l3.4-3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// GitHub: the hero's summary card laid over the inline comment's corner,
// as the review leaves them on the pull request.
function GitHub({ copy }: { copy: WorksCopy }) {
  return (
    <>
      <span className="chip wo-chip wo-chip-example">{copy.example}</span>
      <span className="wo-pill">
        <BotAvatar />
        <Heading />
        <span className="wo-label">{copy.leaves.github[0]}</span>
      </span>
      <span className="wo-paper wo-comment">
        <span className="wo-who">
          <BotAvatar />
          <strong>github-actions</strong>
          <span className="cm-bot">bot</span>
          <span className="wo-on">{copy.onLine}</span>
        </span>
        <Title />
        <span className="wo-body">{finding.body}</span>
      </span>
    </>
  );
}

// GitLab: the same two things as a note and a thread under it, with the
// thread's resolve mark and reply field. Drawn, not recorded: the run was
// posted to GitHub.
function GitLab({ copy }: { copy: WorksCopy }) {
  return (
    <>
      <span className="chip wo-chip">{copy.illustration}</span>
      <span className="wo-paper wo-note">
        <span className="wo-av" />
        <Heading />
        <span className="wo-label">{copy.leaves.gitlab[0]}</span>
      </span>
      <span className="wo-paper wo-thread">
        <span className="wo-who">
          <span className="wo-av" />
          <span>{copy.onLine}</span>
          <ResolveIcon />
        </span>
        <Title />
        <span className="wo-reply">{copy.reply}</span>
      </span>
    </>
  );
}

// Local: the terminal left open after the run, at its verdict; a long
// line wraps at its own indent, as the hero's terminal does.
function Local({ copy }: { copy: WorksCopy }) {
  return (
    <>
      <span className="chip wo-chip wo-chip-example">{copy.example}</span>
      <span className="wo-paper wo-term">
        <span className="wo-bar">
          {exampleRun.repo} · {exampleRun.command}
        </span>
        {TERMINAL.map(({ text, warn }) => (
          <span
            key={text}
            className={warn ? "wo-line wo-warn" : "wo-line"}
            style={{ "--in": text.length - text.trimStart().length } as CSSProperties}
          >
            {text}
          </span>
        ))}
      </span>
    </>
  );
}

const OUTPUTS = { github: GitHub, gitlab: GitLab, git: Local } as const;

// What lands on the platform, in miniature: the hero's own objects at about
// 0.8 of their size on a small night plane, cut off by its foot as papers
// run off a desk (21-works-outputs.css). A picture of the tile's caption,
// so it is hidden from assistive tech.
export function WorksOutput({
  platform,
  copy,
}: {
  platform: keyof typeof OUTPUTS;
  copy: WorksCopy;
}) {
  const Output = OUTPUTS[platform];
  return (
    <span className="wo-plane" aria-hidden="true">
      <Output copy={copy} />
    </span>
  );
}
