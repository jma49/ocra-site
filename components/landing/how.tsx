import type { ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { exampleRun } from "@/lib/landing/example-run";
import { fileStat, recordedLine } from "@/lib/landing/recorded";
import { Lines } from "./parts";

const { files, bundles, tasks, skipped, claims, finding, toolsCalled } = exampleRun;
// The review panel lists the tools the agents called, in pipeline order;
// task_done ends every task and says nothing about the review.
const REVIEW_TOOLS = toolsCalled.filter((t) => t !== "task_done");
const ORDER = ["read_diff", "read_file", "code_search", "report_finding"];
const tools = [...REVIEW_TOOLS].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
const reviewTask = tasks.find((t) => t.id === "correctness-1");

// Four panels that stack as the page scrolls (30-how.css: sticky, each a
// little lower than the last). Each picture is the recorded run's own
// step, drawn as cards on an isometric grid that slide into place as their
// panel arrives; under Reduce motion, or without scroll-driven animations,
// they are simply in place.
export function How({ copy }: { copy: Copy["how"] }) {
  const s = copy.steps;
  return (
    <section id="how" className="sec" aria-labelledby="how-h">
      <div className="wrap">
        <div className="split-head">
          <h2 className="h2" id="how-h">
            <Lines lines={copy.lines} />
          </h2>
          <p className="lead">{copy.body}</p>
        </div>
        <ol className="stack">
          <Panel n={1} label={s.select.label} lines={s.select.lines} body={s.select.body}>
            {[...files]
              .sort((a, b) => Number(b.selected) - Number(a.selected))
              .filter((f) => f.id !== "docs")
              .map((f) => {
                const stat = f.selected ? fileStat(f.path) : undefined;
                return (
                  <div key={f.id} className={f.selected ? "iso-card slide" : "iso-card slide off"}>
                    <span className={f.selected ? "dot dot-ok" : "dot"} />
                    <span className={f.selected ? "mono" : "mono strike"}>{f.path}</span>
                    <span className="t3 end">
                      {stat ? `+${stat.additions} −${stat.deletions}` : copy.generated}
                    </span>
                  </div>
                );
              })}
          </Panel>
          <Panel n={2} label={s.bundle.label} lines={s.bundle.lines} body={s.bundle.body}>
            {bundles.map((b, i) => (
              <div key={b.label} className={`iso-panel slide bundle-${i}`}>
                <div className="ip-h">
                  <b>{b.label}</b>
                  <span className="t3">
                    {b.files.length === 1
                      ? copy.files.one
                      : fill(copy.files.other, { n: b.files.length })}
                  </span>
                </div>
                {(["correctness", "security", "performance"] as const).map((r) => {
                  const off = skipped.some((x) => x.bundle === b.label && x.reviewer === r);
                  return (
                    <div key={r} className={off ? "ip-row off" : "ip-row"}>
                      <span className={off ? "dot" : "dot dot-ok"} />
                      {off ? `${r} · ${copy.skipped}` : r}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="iso-chip slide">{copy.tasks}</div>
          </Panel>
          <Panel n={3} label={s.review.label} lines={s.review.lines} body={s.review.body}>
            <div className="iso-panel slide trace mono">
              <div className="ip-h">
                <b>{reviewTask?.id}</b>
                <span className="t3">{fill(copy.stepCount, { n: reviewTask?.steps ?? 0 })}</span>
              </div>
              {tools.map((t) => (
                <div key={t} className="ip-row">
                  <i>{t}</i>
                  {t === "report_finding" ? <span className="red">{finding.severity}</span> : null}
                </div>
              ))}
            </div>
            <div className="iso-panel slide quote mono">
              <div className="ip-row q">
                <span className="ln">{finding.line}</span>
                <span className="wavy">{recordedLine(finding.path, finding.line).trim()}</span>
              </div>
            </div>
          </Panel>
          <Panel n={4} label={s.verify.label} lines={s.verify.lines} body={s.verify.body}>
            {[...claims].reverse().map((c) => (
              <div
                key={c.id}
                className={c.outcome === "confirmed" ? "iso-card slide kept" : "iso-card slide off"}
              >
                <span className={c.severity === "critical" ? "tag tag-crit" : "tag tag-warn"}>
                  {copy.severity[c.severity]}
                </span>
                <span className={c.outcome === "disproved" ? "strike" : undefined}>{c.title}</span>
                <span className={c.outcome === "confirmed" ? "ok-text end" : "t3 end"}>
                  {copy.outcomes[c.outcome]}
                </span>
              </div>
            ))}
          </Panel>
        </ol>
      </div>
    </section>
  );
}

function Panel({
  n,
  label,
  lines,
  body,
  children,
}: {
  n: number;
  label: string;
  lines: Copy["how"]["steps"]["select"]["lines"];
  body: string;
  children: ReactNode;
}) {
  return (
    <li className={`stk stk-${n}`}>
      <div className="stk-text">
        <span className="step mono">{label}</span>
        <h3>
          <Lines lines={lines} />
        </h3>
        <p>{body}</p>
      </div>
      <div className="stk-art" aria-hidden="true">
        <div className="iso-plane">{children}</div>
      </div>
    </li>
  );
}
