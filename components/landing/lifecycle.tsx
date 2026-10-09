import type { Copy } from "@/lib/copy";
import { SplitHead } from "./heading";
import { LifecycleStates } from "./lifecycle-states";
import { FindingComment } from "./session-code";

// One finding through its life: reported, fixed by the author, or declined
// by a maintainer.
export function Lifecycle({
  copy,
  finding,
}: {
  copy: Copy["lifecycle"];
  finding: Copy["window"]["pr"];
}) {
  return (
    <section className="chapter tight-top lifecycle">
      <div className="wrap">
        <SplitHead title={copy.title} emphasis={copy.emphasis} body={copy.body} />
        <LifecycleStates
          copy={{ tabs: copy.tabs, notes: copy.notes }}
          thread={
            <>
              <div className="caption" aria-hidden="true" data-in="reported fixed">
                {copy.caption}
              </div>
              <div className="cmt">
                <div className="main">
                  <FindingComment
                    variant="thread"
                    withFix
                    title={finding.findingTitle}
                    body={finding.findingBody}
                  />
                </div>
                <div className="extra reply" data-in="dismissed">
                  <strong>{copy.maintainer}</strong> {copy.reply}
                </div>
                <div className="extra" data-in="dismissed">
                  {copy.resolvedMaintainer}
                </div>
                <div className="extra" data-in="fixed">
                  {copy.resolvedBot}
                </div>
              </div>
            </>
          }
          keys={
            <ol className="keys">
              {copy.keys.map((k, i) => (
                <li key={k.title}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <div>
                    <strong>{k.title}</strong>
                    <span>{k.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          }
        />
      </div>
    </section>
  );
}
