import type { Copy } from "@/lib/copy";
import { Lines, Themed } from "./parts";

// Every review in one history: an accordion of what the console does with
// it (one open at a time, native <details name>, no script) beside the
// Reviews page.
export function Record({ copy }: { copy: Copy["record"] }) {
  return (
    <section className="sec" aria-labelledby="record-h">
      <div className="wrap">
        <div className="split-head">
          <h2 className="h2" id="record-h">
            <Lines lines={copy.lines} />
          </h2>
          <p className="lead">{copy.body}</p>
        </div>
        <div className="where">
          <div className="acc">
            {copy.items.map((item, i) => (
              <details key={item.title} name="record" open={i === 0} className="acc-item">
                <summary>
                  <span>{item.title}</span>
                  <span className="acc-sign" aria-hidden="true" />
                </summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
          <figure className="where-art">
            <div className="shot shot-side">
              <Themed name="reviews" ext="webp" width={980} height={700} alt={copy.alt} />
            </div>
            <figcaption className="sr-only">{copy.note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
