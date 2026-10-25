import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { InkCode } from "../code";
import { Tick } from "../pen/marks";

const { files, tier } = exampleRun;
// ocra's risk tiers, lowest first (../ocra packages/core/src/triage.ts).
const TIERS = ["trivial", "lite", "full"] as const;

// Story figure 1, select · triage: the five changed files in git's order,
// each read or set aside with its recorded reason, and the risk tier the
// change earned. Its text is whole from the first frame; only the pen plays,
// done by 800 ms so no still catches it half marked. Beats (ms after the
// figure's `.on`): down the list from 140, 60 ms apart, a tick before each
// read file and a strike through the lock file; rings round `auth/` at 420
// and 480; the change's tier boxed among the three at 500.
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
        <span className="fig-tier-row">
          <span className="fig-tier-k">{f.tier}</span>
          <span className="fig-tiers">
            {TIERS.map((t) =>
              t === tier ? (
                <InkCode
                  key={t}
                  text={t}
                  marks={[{ kind: "box", token: t, at: 500 }]}
                  className="fig-tier-v"
                />
              ) : (
                <code key={t}>{t}</code>
              ),
            )}
          </span>
        </span>
        <span className="fig-tier-why">{f.tierWhy}</span>
      </p>
    </>
  );
}
