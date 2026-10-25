import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import { exampleRun, terminalLines } from "@/lib/landing/example-run";
import { ExampleChip } from "./review";

// The run's own pacing, read from the recording at build time: when each
// block's first line was printed, in ms after the command started. Read here
// rather than through recorded.ts, which checks the lines but keeps the
// transcript to itself; a block whose line is missing fails the build.
function printedAt(): number[] {
  const source = readFileSync(join(process.cwd(), "scripts/demo-video/transcript.js"), "utf8");
  const { lines } = JSON.parse(source.slice(source.indexOf("{"), source.lastIndexOf("}") + 1)) as {
    lines: { t: number; text?: string }[];
  };
  return terminalLines.slice(1).map(([text]) => {
    const first = text.split("\n")[0]?.trimEnd() ?? "";
    const hit = lines.find((line) => (line.text ?? "").trimEnd() === first);
    if (!hit) throw new Error(`terminal: "${first}" is not in transcript.js`);
    return hit.t;
  });
}

// Where a wrapped line continues: under its own indent, or after the
// CLI's "[ocra] " prefix.
const PREFIX = "[ocra] ";
const hang = (line: string) =>
  line.startsWith(PREFIX) ? PREFIX.length : line.length - line.trimStart().length;

// The pane opens with the command and its first block (the run's setup,
// printed in its first three seconds) already on screen; each later block
// follows at its recorded time after that block, compressed 80 times, from
// a short beat (12-terminal.css plays it). The whole run is in by about
// 1.3 s.
const BEAT = 200;
const COMPRESS = 80;
const [setupAt = 0, ...laterAt] = printedAt();
const blockAt = laterAt.map((t) => Math.round(BEAT + (t - setupAt) / COMPRESS));

// The terminal pane: the same run as the CLI printed it, verbatim
// (terminalLines; recorded.ts checks every line), one row per printed line
// so a wrapped line hangs at its own indent, as a terminal would show it.
// The whole text is rendered and only clipped while it plays, so the pane
// never changes size.
export function Terminal({ copy }: { copy: Copy["window"] }) {
  const [, setup, ...later] = terminalLines;
  return (
    <div className="term-pane">
      <div className="sheet-bar">
        <span className="url" id="term-url">
          {copy.urls.terminal}
        </span>
        <ExampleChip label={copy.exampleChip} />
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: printed output, named by its bar, not a set of form controls (fieldset) */}
      <pre
        className="term"
        role="group"
        aria-labelledby="term-url"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: output that scrolls must take focus to scroll by keyboard
        tabIndex={0}
      >
        <span className="term-line term-c">
          <span className="term-sign">$ </span>
          {exampleRun.command}
        </span>
        {setup && <Block block={setup} />}
        {later.map((block, i) => (
          <Block key={block[0]} block={block} at={blockAt[i]} />
        ))}
      </pre>
    </div>
  );
}

// One printed block; with `at`, it wipes in at that time once the pane opens.
function Block({
  block: [text, tone],
  at,
}: {
  block: (typeof terminalLines)[number];
  at?: number;
}) {
  return (
    <span
      className={`term-line${tone ? ` term-${tone}` : ""}${at === undefined ? "" : " term-later"}`}
      style={at === undefined ? undefined : ({ "--t": `${at}ms` } as CSSProperties)}
    >
      {text.split("\n").map((line, n) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed recorded lines, never reordered
          key={n}
          className="term-row"
          style={{ "--in": hang(line) } as CSSProperties}
        >
          {line}
        </span>
      ))}
    </span>
  );
}
