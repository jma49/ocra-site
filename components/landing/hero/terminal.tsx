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

// The typed command at 38 ms a character after a short beat, then each block
// at the recorded time compressed 20 times (12-terminal.css plays it).
const TYPE_AT = 160;
const PER_CHAR = 38;
const COMPRESS = 20;
const typed = exampleRun.command.length;
const outputAt = TYPE_AT + typed * PER_CHAR + 180;
const blockAt = printedAt().map((t) => Math.round(outputAt + t / COMPRESS));

// The terminal pane: the same run as the CLI printed it, verbatim
// (terminalLines; recorded.ts checks every line), one row per printed line
// so a wrapped line hangs at its own indent, as a terminal would show it.
// The whole text is rendered and only clipped while it plays, so the pane
// never changes size.
export function Terminal({ copy }: { copy: Copy["window"] }) {
  const [, ...blocks] = terminalLines;
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
        <span
          className="term-line term-c"
          style={
            { "--n": typed, "--t": `${TYPE_AT}ms`, "--d": `${typed * PER_CHAR}ms` } as CSSProperties
          }
        >
          <span className="term-sign">$ </span>
          <span className="cmd">{exampleRun.command}</span>
          <span className="cursor" aria-hidden="true" />
        </span>
        {blocks.map(([text, tone], i) => (
          <span
            key={text}
            className={tone ? `term-line term-${tone}` : "term-line"}
            style={{ "--t": `${blockAt[i]}ms` } as CSSProperties}
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
        ))}
      </pre>
    </div>
  );
}
