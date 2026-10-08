import { Fragment } from "react";
import type { Copy, StepId } from "@/lib/copy";
import { SplitHead, withCode } from "./heading";
import { howFigures } from "./how-figures";
import { Pipeline } from "./pipeline";

const STEPS: StepId[] = ["select", "bundle", "review", "verify"];

// The four steps of a review on one thread, with the picture of the step in
// focus beside it; the same example change throughout.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const figures = howFigures(copy.figures);
  return (
    <section className="chapter" id="how">
      <div className="wrap">
        <SplitHead title={copy.title} emphasis={copy.emphasis} body={copy.body} />
        <div className="legend">
          <span>
            <span className="node-key" aria-hidden="true" />
            <span className="chip">code</span>
            {copy.legend.code}
          </span>
          <span>
            <span className="node-key m" aria-hidden="true" />
            <span className="chip m">model</span>
            {copy.legend.model}
          </span>
        </div>
        <Pipeline
          steps={STEPS.map((id) => ({
            id,
            title: copy.steps[id].title,
            text: <Fragment key={id}>{withCode(copy.steps[id].text)}</Fragment>,
            stages: copy.steps[id].stages,
          }))}
          figures={STEPS.map((id) => <Fragment key={id}>{figures[id]}</Fragment>)}
        />
      </div>
    </section>
  );
}
