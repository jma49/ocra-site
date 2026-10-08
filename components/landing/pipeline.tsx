"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

export type PipelineStep = {
  id: string;
  title: string;
  text: ReactNode;
  stages: { name: string; kind: "code" | "model" }[];
};

const DWELL_MS = 5200;

// The pipeline as one thread: four steps down a line, each a node (a square
// when only code runs, a ring when a model is asked), and beside it the
// picture of the step in focus. The steps advance on their own until the
// reader points at the section or picks a step; under Reduce motion they
// wait for the reader. Every step's text is always shown; only the picture
// changes.
export function Pipeline({ steps, figures }: { steps: PipelineStep[]; figures: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    setAuto(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!auto || held) return;
    const t = setTimeout(() => setActive((active + 1) % steps.length), DWELL_MS);
    return () => clearTimeout(t);
  }, [auto, held, active, steps.length]);

  const pick = (i: number) => {
    setActive(i);
    setAuto(false);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pausing the auto-advance is a convenience; the buttons are the controls
    <div
      className="pipe"
      data-running={auto && !held}
      style={{ "--dwell": `${DWELL_MS}ms` } as CSSProperties}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <ol className="pipe-steps">
        {steps.map((s, i) => {
          const model = s.stages.some((st) => st.kind === "model");
          return (
            <li
              key={s.id}
              className={i === active ? "on" : i < active ? "done" : undefined}
              data-kind={model ? "model" : "code"}
            >
              <span className="node" aria-hidden="true" />
              {i === active && (
                <span className="fill" key={`${active}-${auto}`} aria-hidden="true" />
              )}
              <h3>
                <button
                  type="button"
                  aria-pressed={i === active}
                  aria-controls="pipe-figure"
                  onClick={() => pick(i)}
                >
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </button>
              </h3>
              <div className="k">
                {s.stages.map((st) => (
                  <span key={st.name} className={st.kind === "model" ? "chip m" : "chip"}>
                    {st.name}
                  </span>
                ))}
              </div>
              <p>{s.text}</p>
            </li>
          );
        })}
      </ol>
      <section className="pipe-fig" id="pipe-figure" aria-label={steps[active]?.title}>
        {figures.map((f, i) => (
          <div key={steps[i]?.id} className={i === active ? "fig on" : "fig"} inert={i !== active}>
            {f}
          </div>
        ))}
      </section>
    </div>
  );
}
