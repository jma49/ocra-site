import type { Copy, StepId } from "@/lib/copy";
import { SplitHead, withCode } from "./heading";
import { howFigures } from "./how-figures";

const STEPS: StepId[] = ["select", "bundle", "review", "verify"];

// The four steps of a review side by side, each with its picture of the
// same example change, so the whole pipeline reads in one screen.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const figures = howFigures(copy.figures);
  return (
    <section className="chapter" id="how">
      <div className="wrap">
        <SplitHead title={copy.title} emphasis={copy.emphasis} body={copy.body} />
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
        <ol className="steps">
          {STEPS.map((id, i) => {
            const step = copy.steps[id];
            return (
              <li key={id} className="step">
                <div className="k">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  {step.stages.map((s) => (
                    <span key={s.name} className={s.kind === "model" ? "chip m" : "chip"}>
                      {s.name}
                    </span>
                  ))}
                </div>
                <h3>{step.title}</h3>
                <p>{withCode(step.text)}</p>
                <div className="step-fig">{figures[id]}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
