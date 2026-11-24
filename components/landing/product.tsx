import type { Copy } from "@/lib/copy";
import { Lines, Themed } from "./parts";

// The console: the inbox on a tinted stage, and four things a pull
// request's page does.
export function Product({ copy }: { copy: Copy["product"] }) {
  return (
    <section id="product" className="sec" aria-labelledby="product-h">
      <div className="wrap">
        <div className="split-head">
          <h2 className="h2" id="product-h">
            <Lines lines={copy.lines} />
          </h2>
          <p className="lead">{copy.body}</p>
        </div>
        <figure className="stage-panel">
          <div className="shot shot-app">
            <Themed name="inbox" ext="webp" width={1080} height={700} alt={copy.alt} />
          </div>
          <figcaption className="caption">{copy.note}</figcaption>
        </figure>
        <ul className="four">
          {copy.features.map((f) => (
            <li key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
