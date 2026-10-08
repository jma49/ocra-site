import { readFileSync } from "node:fs";
import { join } from "node:path";
import { exampleRun } from "@/lib/landing/example-run";

const { finding } = exampleRun;

// The recorded demo repository's file (scripts/demo-video/repo), read at
// build time. The build fails if the recording and this file disagree on the
// line the finding quotes, so the page never lights up the wrong line.
const LINES = readFileSync(
  join(process.cwd(), "scripts/demo-video/repo/head", finding.path),
  "utf8",
)
  .trimEnd()
  .split("\n");
const quoted = finding.code[finding.line - finding.firstLine];
if (LINES[finding.line - 1] !== quoted) {
  throw new Error(`${finding.path}:${finding.line} is not the line the recorded finding quotes`);
}

function Code({ title }: { title: string }) {
  return LINES.map((text, i) => {
    const n = i + 1;
    const hit = n === finding.line;
    return (
      <div key={n} className={hit ? "rl q" : "rl"}>
        <span className="rn">{n}</span>
        <span>{text || " "}</span>
        {hit && (
          <span className="rnote" title={title}>
            🔴 {finding.severity} · verified
          </span>
        )}
      </div>
    );
  });
}

// The hero's picture: the file ocra reviewed in the example run, dim, read
// by a light that follows the pointer (motion.tsx sets --lx and --ly), with
// the line it commented on lit throughout. Three copies of the same text:
// the dim page, the lit page shown only under the light, and the finding's
// line alone. Each copy sits in an untilted layer the size of the hero, so
// the light's mask is in the same coordinates as the pointer; the code
// inside is tilted.
export function Reading({ title }: { title: string }) {
  return (
    <div className="reading" aria-hidden="true">
      {(["dim", "lit", "bug"] as const).map((layer) => (
        <div key={layer} className={`rlayer ${layer}`}>
          <div className="rcode">
            <Code title={title} />
          </div>
        </div>
      ))}
      <div className="rbeam" />
    </div>
  );
}
