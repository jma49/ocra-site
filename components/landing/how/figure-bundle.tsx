import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { exampleRun, type Reviewer } from "@/lib/landing/example-run";
import { InkCode } from "../code";
import { Marked, Tick } from "../pen/marks";

const REVIEWERS: readonly Reviewer[] = ["correctness", "security", "performance"];
const PLAN = "$ ocra review --plan";
const { bundles, files, tasks, skipped } = exampleRun;
const pathOf = (id: string) => files.find((file) => file.id === id)?.path ?? id;

// Story figure 2, bundle · matrix: the two bundles the grouping call made,
// the reviewer × bundle matrix (a column per bundle, so each cell reads on
// one line) with its four tasks and two skipped pairs,
// and `--plan`, which lists them before any model is paid for. Its text,
// the command included, is whole from the first frame; the pen is done by
// 800 ms. Beats (ms after `.on`): the cells in reading order from 140, 60 ms
// apart, a tick by each task and a strike through each skipped pair;
// `--plan` underlined at 560.
export function FigureBundle({ f }: { f: Copy["how"]["figures"] }) {
  let cell = 0;
  return (
    <>
      <ul className="fig-bundles">
        {bundles.map((bundle) => (
          <li key={bundle.label}>
            <span className="fig-bundle">{bundle.label}</span>
            <span className="fig-count">
              {fill(f.bundleFiles[bundle.files.length === 1 ? "one" : "other"], {
                n: bundle.files.length,
              })}
            </span>
            <span className="fig-paths">{bundle.files.map(pathOf).join("  ")}</span>
          </li>
        ))}
      </ul>
      <table className="fig-matrix">
        <caption className="sr-only">{f.matrix}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">{f.reviewer}</span>
            </th>
            {bundles.map((bundle) => (
              <th key={bundle.label} scope="col">
                {bundle.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REVIEWERS.map((reviewer) => (
            <tr key={reviewer}>
              <th scope="row">{reviewer}</th>
              {bundles.map((bundle) => {
                const run = tasks.find((t) => t.bundle === bundle.label && t.reviewer === reviewer);
                const skips = skipped.some(
                  (s) => s.bundle === bundle.label && s.reviewer === reviewer,
                );
                const at = 140 + 60 * cell++;
                return (
                  <td key={bundle.label} data-skip={skips || undefined}>
                    {run && (
                      <span className="fig-task">
                        <span className="fig-task-k">
                          <Tick at={at} />
                          {f.task}
                        </span>
                        <code>{run.id}</code>
                      </span>
                    )}
                    {skips && (
                      <Marked kind="strike" at={at} dur={300}>
                        {f.skipDocs}
                      </Marked>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fig-foot fig-plan">
        <span className="fig-cmd">
          <InkCode text={PLAN} marks={[{ kind: "under", token: "--plan", at: 560 }]} />
        </span>
        <span className="fig-plan-note">{f.planNote}</span>
      </p>
    </>
  );
}
