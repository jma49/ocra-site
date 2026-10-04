"use client";

import { useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { SplitHead, withCode } from "./heading";
import { howFigures } from "./how-figures";

// The four steps of a review. On wide screens the picture for the step in
// the middle of the viewport sits in a sticky panel; on narrow ones each
// picture follows its step.
export function HowItWorks({ copy }: { copy: Copy["how"] }) {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const figures = howFigures(copy.figures);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of steps.current) if (el) io.observe(el);
    return () => io.disconnect();
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
            {copy.steps.map((step, i) => (
              <div
                key={step.title}
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
                <div className="inline-vis">{figures[i]}</div>
              </div>
            ))}
          </div>
          <div className="sticky" aria-hidden="true">
            {figures.map((fig, i) => (
              <div key={fig.key} className={i === active ? "vis on" : "vis"}>
                {fig}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
