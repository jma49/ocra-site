import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { InkCode } from "../code";
import { Tick } from "../pen/marks";

const { files, tier } = exampleRun;

// Story figure 1, select · triage: the five changed files in git's order,
// each read or set aside with its recorded reason, and the risk tier the
// change earned. Its text is whole from the first frame; only the pen plays,
// done by 800 ms so no still catches it half marked. Beats (ms after the
// figure's `.on`): down the list from 140, 60 ms apart, a tick before each
// read file and a strike through the lock file; rings round `auth/` at 420
// and 480; the tier boxed at 500.
export function FigureSelect({ f }: { f: Copy["how"]["figures"] }) {
  let ring = 0;
  return (
    <>
      <ul className="fig-files">
        {files.map((file, i) => {
          const at = 140 + 60 * i;
          const marks = !file.selected
            ? [{ kind: "strike" as const, token: file.path, at }]
            : file.path.includes("auth/")
              ? [{ kind: "ring" as const, token: "auth/", at: 420 + 60 * ring++ }]
              : [];
          return (
            <li key={file.id} data-out={!file.selected || undefined}>
              <span className="fig-gut">{file.selected && <Tick at={at} />}</span>
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
          marks={[{ kind: "box", token: tier, at: 500 }]}
          className="fig-tier-v"
        />
        <span className="fig-tier-why">{f.tierWhy}</span>
      </p>
    </>
  );
}
