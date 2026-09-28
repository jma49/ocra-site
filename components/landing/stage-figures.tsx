import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Copy, StageKind } from "@/lib/copy";

type Words = Copy["run"]["figures"];

// The example run behind the four pictures, the same one the manual's
// walk-through uses. File names, tiers, reviewers, tool names and the
// findings (ocra's own output) are identifiers and stay in English.
const FILES = [
  "src/auth/session.ts",
  "src/auth/token.ts",
  "src/api/login.ts",
  "docs/auth.md",
];
const REVIEWERS = ["correctness", "security", "performance"];
const TOOLS = [
  { name: "read_file", on: true },
  { name: "read_diff", on: true },
  { name: "code_search", on: true },
  { name: "edit", on: false },
  { name: "bash", on: false },
  { name: "webfetch", on: false },
];

export function KindMark({ kind }: { kind: StageKind }) {
  return kind === "code" ? (
    <span aria-hidden className="size-2 shrink-0 bg-fg-muted" />
  ) : (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full border-[1.5px] border-accent"
    />
  );
}

function Frame({
  stages,
  example,
  children,
}: {
  stages: { name: string; kind: StageKind }[];
  example: string;
  children: ReactNode;
}) {
  return (
    <figure className="m-0 flex h-[18.75rem] flex-col gap-4 overflow-hidden border border-border bg-bg-subtle px-5 py-4 font-mono text-xs">
      <figcaption className="flex items-center justify-between gap-3 text-fg-subtle">
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {stages.map((stage) => (
            <span key={stage.name} className="flex items-center gap-1.5">
              <KindMark kind={stage.kind} />
              {stage.name}
            </span>
          ))}
        </span>
        <span className="shrink-0">{example}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function Select({ w }: { w: Words }) {
  return (
    <>
      <ul className="m-0 flex list-none flex-col p-0 text-[0.8125rem]">
        {FILES.map((file) => (
          <li
            key={file}
            className="flex h-[1.875rem] items-center justify-between gap-3 border-b border-dashed border-border"
          >
            <span className="truncate">{file}</span>
            <span className="text-accent">{w.read}</span>
          </li>
        ))}
        <li className="flex h-[1.875rem] items-center justify-between gap-3 text-fg-subtle">
          <span className="truncate line-through">package-lock.json</span>
          <span className="shrink-0">{w.lockSetAside}</span>
        </li>
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        <span className="mr-1.5 text-fg-subtle">{w.tier}</span>
        {["trivial", "lite"].map((tier) => (
          <span
            key={tier}
            className="border border-dashed border-border-strong px-2.5 py-1 text-fg-subtle"
          >
            {tier}
          </span>
        ))}
        <span className="border border-accent px-2.5 py-1 text-accent">
          full
        </span>
        <span className="ml-auto text-fg-muted">{w.touches}</span>
      </div>
    </>
  );
}

function Cell({ runs, skip }: { runs: boolean; skip: string }) {
  return (
    <span
      className={cn(
        "flex h-9 items-center justify-center border border-dashed",
        runs ? "border-border-strong" : "border-border text-fg-subtle",
      )}
    >
      {runs ? <span className="size-3 bg-accent" /> : skip}
    </span>
  );
}

function Matrix({ w }: { w: Words }) {
  return (
    <>
      <div className="grid grid-cols-[6.5rem_repeat(2,minmax(0,1fr))] items-center gap-1.5">
        <span />
        <span className="flex flex-col items-center leading-tight">
          <span>{w.authCode}</span>
          <span className="text-fg-subtle">{w.threeFiles}</span>
        </span>
        <span className="flex flex-col items-center leading-tight">
          <span>{w.docs}</span>
          <span className="text-fg-subtle">{w.oneFile}</span>
        </span>
        {REVIEWERS.map((reviewer) => (
          <Row key={reviewer} reviewer={reviewer} skip={w.skip} />
        ))}
      </div>
      <div className="mt-auto flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-dashed border-border pt-3">
        <span>{w.tasks}</span>
        <span className="text-fg-muted">{w.skipped}</span>
      </div>
    </>
  );
}

function Row({ reviewer, skip }: { reviewer: string; skip: string }) {
  return (
    <>
      <span className="text-fg-muted">{reviewer}</span>
      <Cell runs skip={skip} />
      <Cell runs={reviewer === "correctness"} skip={skip} />
    </>
  );
}

function Review({ w }: { w: Words }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-fg-subtle">{w.agent} · correctness</span>
        <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-1 p-0">
          {TOOLS.map((tool) => (
            <li
              key={tool.name}
              className={cn(
                "flex justify-between gap-2",
                !tool.on && "text-fg-subtle",
              )}
            >
              <span className={cn(!tool.on && "line-through")}>
                {tool.name}
              </span>
              <span className={cn(tool.on && "text-accent")}>
                {tool.on ? w.on : w.off}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-fg-subtle">{w.quote}</span>
        <code className="block border border-border-strong bg-bg px-3 py-2 whitespace-pre text-fg">
          {"return session.expiresAt\n  < Date.now();"}
        </code>
        <span className="flex items-center gap-2 text-fg-subtle">
          <span
            aria-hidden
            className="h-4 border-l border-dashed border-accent"
          />
          {w.matched}
        </span>
        <span className="border border-accent px-3 py-2 text-accent">
          src/auth/session.ts:42
        </span>
      </div>
    </>
  );
}

const FINDINGS = [
  { title: "Every session is treated as expired", outcome: "confirmed" },
  { title: "Expiry compares seconds with milliseconds", outcome: "merged" },
  { title: "Token stays valid after logout", outcome: "disproved" },
  { title: "user may be undefined", outcome: "accepted" },
] as const;

function Settle({ w }: { w: Words }) {
  return (
    <>
      <ul className="m-0 flex list-none flex-col p-0 font-sans text-[0.8125rem]">
        {FINDINGS.map((finding, i) => {
          const kept = finding.outcome === "confirmed";
          return (
            <li
              key={finding.title}
              className={cn(
                "flex flex-col gap-0.5 border-b border-dashed border-border py-1.5 last:border-b-0",
                !kept && "text-fg-subtle",
              )}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span
                  className={cn(
                    "truncate",
                    kept ? "font-medium" : "line-through",
                  )}
                >
                  {finding.title}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-xs",
                    kept && "text-accent",
                  )}
                >
                  {w[finding.outcome]}
                </span>
              </span>
              {i === 0 ? (
                <span className="font-mono text-[11px] text-critical">
                  critical · session.ts:42
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto flex flex-wrap justify-between gap-x-4 gap-y-1 border border-border-strong px-3 py-2">
        <span>{w.verdict}</span>
        <span className="text-accent">{w.verifiedCritical}</span>
      </div>
    </>
  );
}

const PICTURES = [Select, Matrix, Review, Settle];

export function StageFigure({
  index,
  stages,
  example,
  words,
}: {
  index: number;
  stages: { name: string; kind: StageKind }[];
  example: string;
  words: Words;
}) {
  const Picture = PICTURES[index];
  return (
    <Frame stages={stages} example={example}>
      {Picture ? <Picture w={words} /> : null}
    </Frame>
  );
}
