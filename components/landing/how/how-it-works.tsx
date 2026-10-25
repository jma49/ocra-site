import { type CSSProperties, Fragment, type ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import type { StepId } from "@/lib/copy/sections/how";
import { exampleRun } from "@/lib/landing/example-run";
import { Kicker, Lines, Section, withCode } from "../section";
import { FigureBundle } from "./figure-bundle";
import { FigureReview } from "./figure-review";
import { FigureSelect } from "./figure-select";
import { FigureVerify } from "./figure-verify";
import { Meter } from "./meter";
import { Story } from "./story";

type F = Copy["how"]["figures"];
type Stage = Copy["how"]["steps"][StepId]["stages"][number];

const STEPS: readonly StepId[] = ["select", "bundle", "review", "verify"];
const FIGURES: Record<StepId, (props: { f: F }) => ReactNode> = {
  select: FigureSelect,
  bundle: FigureBundle,
  review: FigureReview,
  verify: FigureVerify,
};
const { pr } = exampleRun;

function Chips({ stages }: { stages: readonly Stage[] }) {
  return stages.map((stage) => (
    <span key={stage.name} className="chip chip-stage" data-kind={stage.kind}>
      {stage.name}
    </span>
  ));
}

// A figure's stages as a label: each name after its kind's shape.
function StageNames({ stages }: { stages: readonly Stage[] }) {
  return (
    <span className="fig-stages">
      {stages.map((stage) => (
        <span key={stage.name}>
          <i className="k" data-kind={stage.kind} aria-hidden="true" />
          {stage.name}
        </span>
      ))}
    </span>
  );
}

// One story figure: a complete desk with the sheet bar of the example's pull
// request and the Example run chip (described by the caption under the
// heading), then the figure's own body under a head naming its stages.
// `data-pen="on"`: its marks draw when the story island gives it `.on`.
function Figure({
  n,
  id,
  stages,
  count,
  chip,
  f,
}: {
  n: number;
  id: StepId;
  stages: readonly Stage[];
  count: ReactNode;
  chip: string;
  f: F;
}) {
  const Body = FIGURES[id];
  return (
    <figure
      className={n === 1 ? "fig is-on" : "fig"}
      id={`fig-${n}`}
      data-i={n}
      data-fig={id}
      data-pen="on"
      aria-labelledby={`step-${n}-h`}
      style={{ "--i": n } as CSSProperties}
    >
      <div className="desk">
        <div className="sheet">
          <div className="sheet-bar">
            <span className="url">
              pull request #{pr.number}
              <span className="url-branch">
                {" "}
                · {pr.head} → {pr.base}
              </span>
            </span>
            <span className="chip chip-example" aria-describedby="how-example">
              {chip}
            </span>
          </div>
          <div className="fig-body">
            <p className="fig-head">
              <StageNames stages={stages} />
              <span className="fig-meta">{count}</span>
            </p>
            <Body f={f} />
          </div>
        </div>
      </div>
    </figure>
  );
}

// How it works (sections.md §4): one pull request walked through the
// pipeline. In reading order, step n then figure n. Pinned (≥ 1200 × 760,
// with motion) the figures share one sticky place beside the steps and the
// meter row sticks above them; otherwise step and figure flow together
// (30-how.css). The island plays it; the server renders it finished.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const f = copy.figures;
  const counts: Record<StepId, ReactNode> = {
    select: f.files,
    bundle: f.tasks,
    review: (
      <>
        <span>{f.agentRun}</span>
        <span className="fig-cap">{f.readOnly}</span>
      </>
    ),
    verify: f.candidates,
  };
  return (
    <Section id="how" ground="paper-2" className="how">
      <div className="wrap">
        <div className="how-head">
          <div className="how-title">
            <Kicker>{copy.label}</Kicker>
            <h2 className="t-h2">
              <Lines lines={copy.lines} />
            </h2>
          </div>
          <div className="how-aside">
            <p className="t-body">{copy.body}</p>
            <ul className="how-legend">
              <li data-kind="code">code · {copy.legend.code}</li>
              <li data-kind="model">model · {copy.legend.model}</li>
            </ul>
            <p className="t-small how-example" id="how-example">
              {copy.example}
            </p>
          </div>
        </div>
        <Story pass={f.pass}>
          <Meter
            groups={STEPS.map((id) => copy.steps[id].stages)}
            label={f.meter}
            pass={fill(f.pass, { n: 1 })}
          />
          <div className="story" data-step="1">
            {STEPS.map((id, i) => {
              const step = copy.steps[id];
              const n = i + 1;
              return (
                <Fragment key={id}>
                  <div
                    className={n === 1 ? "step is-on" : "step"}
                    id={`step-${n}`}
                    data-i={n}
                    style={{ "--i": n } as CSSProperties}
                  >
                    <h3 className="step-h" id={`step-${n}-h`}>
                      <button type="button" className="step-go" data-go={n}>
                        <span className="step-n">{n}</span>
                        <span className="step-t t-h3">{step.title}</span>
                      </button>
                    </h3>
                    <p className="step-stages">
                      <Chips stages={step.stages} />
                    </p>
                    <p className="t-body step-text">{withCode(step.text)}</p>
                  </div>
                  <Figure
                    n={n}
                    id={id}
                    stages={step.stages}
                    count={counts[id]}
                    chip={copy.exampleChip}
                    f={f}
                  />
                </Fragment>
              );
            })}
          </div>
        </Story>
      </div>
    </Section>
  );
}
