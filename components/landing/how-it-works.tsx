"use client";

import { useEffect, useRef, useState } from "react";
import type { Copy, StepId } from "@/lib/copy";
import { SplitHead, withCode } from "./heading";
import { howFigures } from "./how-figures";

const STEPS: StepId[] = ["select", "bundle", "review", "verify"];

// The four steps of a review. On wide screens the picture for the step in
// the middle of the viewport sits in a sticky panel; on narrow ones each
// picture follows its step.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const figures = howFigures(copy.figures);

  // The active step is the one whose middle is nearest the viewport's
  // middle, computed from layout on scroll and resize. Unlike an
  // IntersectionObserver it is a pure function of the layout, so it never
  // flips between two identical frames (a full-page screenshot stretches the
  // viewport and used to catch it mid-switch).
  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      const mid = innerHeight / 2;
      let best = 0;
      let dist = Number.POSITIVE_INFINITY;
      steps.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

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
        <div className="sync">
          <div className="steps">
            {STEPS.map((id, i) => {
              const step = copy.steps[id];
              return (
                <div
                  key={id}
                  ref={(el) => {
                    steps.current[i] = el;
                  }}
                  data-i={i}
                  className={i === active ? "step on" : "step"}
                >
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
              <div key={id} className={i === active ? "vis on" : "vis"}>
                {figures[id]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
