import type { Copy, StepId } from "@/lib/copy";
import { SplitHead, withCode } from "./heading";
import { howFigures } from "./how-figures";
import { StepSync } from "./step-sync";

const STEPS: StepId[] = ["select", "bundle", "review", "verify"];

// The four steps of a review. On wide screens the picture for the step in
// the middle of the viewport sits in a sticky panel; on narrow ones each
// picture follows its step.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const figures = howFigures(copy.figures);
  return (
    <section className="chapter" id="how">
      <div className="wrap">
        <SplitHead
          title={copy.title}
          emphasis={copy.emphasis}
          body={copy.body}
        />
        <div className="legend">
          <span>
            <span className="chip">code</span>
            {copy.legend.code}
          </span>
          <span>
            <span className="chip m">model</span>
            {copy.legend.model}
          </span>
        </div>
        <StepSync>
          <div className="steps">
            {STEPS.map((id, i) => {
              const step = copy.steps[id];
              return (
                <div key={id} data-i={i} className={i ? "step" : "step on"}>
                  <div className="k">
                    {String(i + 1).padStart(2, "0")}
                    {step.stages.map((s) => (
                      <span
                        key={s.name}
                        className={s.kind === "model" ? "chip m" : "chip"}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{withCode(step.text)}</p>
                  <div className="inline-vis">{figures[id]}</div>
                </div>
              );
            })}
          </div>
          <div className="sticky" inert>
            {STEPS.map((id, i) => (
              <div key={id} className={i ? "vis" : "vis on"}>
                {figures[id]}
              </div>
            ))}
          </div>
        </StepSync>
      </div>
    </section>
  );
}
