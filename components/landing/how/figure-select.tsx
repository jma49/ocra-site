import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { InkCode } from "../code";
import { Tick } from "../pen/marks";

const { files, tier } = exampleRun;

// Story figure 1, select · triage: the five changed files in git's order,
// each read or set aside with its recorded reason, and the risk tier the
// change earned. Beats (ms after the figure's `.on`, motion.md §6): ticks
// before the four read files from 400, 90 ms apart; the strike through the
// lock file at 800; rings round `auth/` at 1050 and 1350; the tier boxed at
// 1700.
export function FigureSelect({ f }: { f: Copy["how"]["figures"] }) {
  let read = 0;
  let ring = 0;
  return (
    <>
      <ul className="fig-files">
        {files.map((file) => {
          const marks = !file.selected
            ? [{ kind: "strike" as const, token: file.path, at: 800 }]
            : file.path.includes("auth/")
              ? [{ kind: "ring" as const, token: "auth/", at: 1050 + 300 * ring++ }]
              : [];
          return (
            <li key={file.id} data-out={!file.selected || undefined}>
              <span className="fig-gut">{file.selected && <Tick at={400 + 90 * read++} />}</span>
              <InkCode text={file.path} marks={marks} className="fig-path" />
              <span className="fig-why">{f.why[file.id]}</span>
            </li>
          );
        })}
      </ul>
      <p className="fig-foot fig-tier">
        <span>{f.tier}</span>
        <InkCode
          text={tier}
          marks={[{ kind: "box", token: tier, at: 1700 }]}
          className="fig-tier-v"
        />
        <span className="fig-tier-why">{f.tierWhy}</span>
      </p>
    </>
  );
}
