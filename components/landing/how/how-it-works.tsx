import { Fragment, type ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import type { StepId } from "@/lib/copy/sections/how";
import { type ClaimOutcome, exampleRun, type Reviewer } from "@/lib/landing/example-run";
import { CodeRows, InkCode } from "../code";
import { Arrow, Band, Marked, Ringed, Tick } from "../pen/marks";
import { Kicker, Lines, Section, withCode } from "../section";

// How it works: one pull request walked through the pipeline (sections.md
// §4). Stub from package F, every figure in its finished state and in
// reading order (step n, then figure n), unpinned; S builds the meter, the
// pinned story, the figures' beats and the kinetic verdict.

type F = Copy["how"]["figures"];
const STEPS: readonly StepId[] = ["select", "bundle", "review", "verify"];
const REVIEWERS: readonly Reviewer[] = ["correctness", "security", "performance"];
const { files, bundles, tasks, skipped, claims, finding, pr } = exampleRun;

function Desk({ chip, children }: { chip: string; children: ReactNode }) {
  return (
    <div className="desk">
      <div className="sheet">
        <div className="sheet-bar">
          <span className="url">
            pull request #{pr.number} · {pr.head} → {pr.base}
          </span>
          <span className="chip chip-example" aria-describedby="how-example">
            {chip}
          </span>
        </div>
        <div className="fig-body">{children}</div>
      </div>
    </div>
  );
}

function FigureSelect({ f }: { f: F }) {
  return (
    <>
      <p className="fig-head t-mono">select · triage · {f.files}</p>
      <ul className="fig-files">
        {files.map((file, i) => (
          <li key={file.id}>
            <span className="fig-tick">{file.selected && <Tick at={400 + i * 90} />}</span>
            <InkCode
              text={file.path}
              marks={
                !file.selected
                  ? [{ kind: "strike", token: file.path, at: 800 }]
                  : file.path.includes("auth/")
                    ? [{ kind: "ring", token: "auth/", at: file.id === "session" ? 1050 : 1350 }]
                    : []
              }
            />
            <span className="t-small fig-why">{f.why[file.id]}</span>
          </li>
        ))}
      </ul>
      <p className="fig-tier">
        <span>{f.tier}</span>
        <InkCode
          text={exampleRun.tier}
          marks={[{ kind: "box", token: exampleRun.tier, at: 1700 }]}
        />
        <span className="t-small">{f.tierWhy}</span>
      </p>
    </>
  );
}

function FigureBundle({ f }: { f: F }) {
  const plan = "$ ocra review --plan";
  return (
    <>
      <p className="fig-head t-mono">bundle · matrix · {f.tasks}</p>
      <table className="fig-matrix">
        <thead>
          <tr>
            <th />
            {REVIEWERS.map((r) => (
              <th key={r} className="t-mono">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bundles.map((bundle) => (
            <tr key={bundle.label}>
              <th className="t-mono">
                {bundle.label}
                <span className="t-small">
                  {fill(f.bundleFiles[bundle.files.length === 1 ? "one" : "other"], {
                    n: bundle.files.length,
                  })}
                </span>
              </th>
              {REVIEWERS.map((r, i) => {
                const task = tasks.find((t) => t.bundle === bundle.label && t.reviewer === r);
                const skip = skipped.some((s) => s.bundle === bundle.label && s.reviewer === r);
                return (
                  <td key={r}>
                    {task && (
                      <>
                        <Tick at={400 + i * 90} /> {f.task} <code>{task.id}</code>
                      </>
                    )}
                    {skip && (
                      <Marked kind="strike" at={900 + i * 120}>
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
      <p className="fig-plan">
        <InkCode text={plan} marks={[{ kind: "under", token: "--plan", at: 2100 }]} />
        <span className="t-small">{f.planNote}</span>
      </p>
    </>
  );
}

function FigureReview({ f }: { f: F }) {
  return (
    <>
      <p className="fig-head t-mono">review · anchor · {f.agentRun}</p>
      <p className="fig-l42">
        <Ringed at={1700} w={1.16} h={0.9} className="t-figure l42">
          L{finding.line}
        </Ringed>
        <span className="t-note fig-found">{f.found}</span>
        <span className="t-mono">{finding.path}</span>
      </p>
      <CodeRows
        path={finding.path}
        label={finding.path}
        reader="parked"
        rows={[
          { key: "label", custom: <span className="t-small">{f.quotes}</span> },
          { key: "quote", custom: <span className="fig-quote">{finding.quote}</span> },
          { key: "gap", custom: null },
          { n: 40 },
          { n: 41 },
          { n: finding.line, anchor: 1150 },
          { n: 43 },
        ]}
        overlay={<Arrow from={{ x: 9, y: 1.4 }} to={{ x: 20, y: 9.2 }} at={1350} />}
      />
    </>
  );
}

const OUTCOME_MARK: Record<ClaimOutcome, "tick" | "strike" | "none"> = {
  confirmed: "tick",
  remembered: "strike",
  merged: "tick",
  disproved: "strike",
};

function FigureVerify({ f }: { f: F }) {
  return (
    <>
      <p className="fig-head t-mono">filter · verify · judge · verdict · {f.candidates}</p>
      <ol className="fig-claims">
        {claims.map((claim, i) => (
          <li key={claim.id}>
            <span className="fig-tick">
              {OUTCOME_MARK[claim.outcome] === "tick" && <Tick at={800 + i * 100} />}
            </span>
            <span className="t-mono">#{i + 1}</span>
            <span className="fig-claim">
              {OUTCOME_MARK[claim.outcome] === "strike" ? (
                <>
                  <span className="wide-only">
                    <Marked kind="strike" at={claim.outcome === "remembered" ? 400 : 1200}>
                      {claim.title}
                    </Marked>
                  </span>
                  <span className="phone-only">
                    <Band
                      kind="strike"
                      lines={[claim.title]}
                      at={claim.outcome === "remembered" ? 400 : 1200}
                    />
                  </span>
                </>
              ) : (
                claim.title
              )}
              {f.claimGloss[claim.id] && <span className="t-small">{f.claimGloss[claim.id]}</span>}
              {"reason" in claim && <code className="fig-reason">{claim.reason}</code>}
            </span>
            <span className="t-small">{f.ledger[claim.outcome]}</span>
          </li>
        ))}
        <Arrow from={{ x: 1.1, y: 9.4 }} to={{ x: 1.1, y: 1.9 }} dir="up" at={1600} />
      </ol>
      <p className="fig-verdict t-verdict">
        <Marked kind="double" at={2950}>
          {f.ledger.verdict}
        </Marked>
      </p>
      <p className="fig-critical t-small">{f.ledger.critical}</p>
    </>
  );
}

const FIGURES: Record<StepId, (props: { f: F }) => ReactNode> = {
  select: FigureSelect,
  bundle: FigureBundle,
  review: FigureReview,
  verify: FigureVerify,
};

export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  return (
    <Section id="how" ground="paper-2" className="how">
      <div className="wrap">
        <div className="how-head">
          <div>
            <Kicker>{copy.label}</Kicker>
            <h2 className="t-h2">
              <Lines lines={copy.lines} />
            </h2>
          </div>
          <div className="how-aside">
            <p className="t-body">{copy.body}</p>
            <p className="how-legend t-mono">
              <span className="chip chip-stage" data-kind="code">
                code · {copy.legend.code}
              </span>
              <span className="chip chip-stage" data-kind="model">
                model · {copy.legend.model}
              </span>
            </p>
            <p className="t-small how-example" id="how-example">
              {copy.example}
            </p>
          </div>
        </div>
        <div className="story">
          {STEPS.map((id, i) => {
            const step = copy.steps[id];
            const Figure = FIGURES[id];
            return (
              <Fragment key={id}>
                <div className="step" id={`step-${i + 1}`}>
                  <h3 className="t-h3">
                    <span className="step-n">{i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="step-stages">
                    {step.stages.map((s) => (
                      <span key={s.name} className="chip chip-stage" data-kind={s.kind}>
                        {s.name}
                      </span>
                    ))}
                  </p>
                  <p className="t-body">{withCode(step.text)}</p>
                </div>
                <figure className="fig" id={`fig-${i + 1}`}>
                  <Desk chip={copy.exampleChip}>
                    <Figure f={copy.figures} />
                  </Desk>
                </figure>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
