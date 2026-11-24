import type { Copy } from "@/lib/copy";
import { Themed } from "./parts";

// Why the reviewer is quiet: a white panel with the mark, extruded, and the
// run's tally of candidates to reported findings.
export function Quiet({ copy }: { copy: Copy["quiet"] }) {
  return (
    <section className="sec" aria-labelledby="quiet-h">
      <div className="wrap">
        <div className="meet">
          <div className="meet-text">
            <h2 className="h2" id="quiet-h">
              {copy.title}
            </h2>
            <p className="lead">{copy.body}</p>
            <ul className="strike-row">
              {copy.out.map((item) => (
                <li key={item}>
                  <s>{item}</s>
                </li>
              ))}
            </ul>
            <p className="small t3">{copy.outNote}</p>
          </div>
          <div className="meet-art">
            <Themed name="mark" ext="svg" width={600} height={340} />
            <p className="tally float">
              <b>{copy.tally.candidates}</b>
              <span aria-hidden="true">→</span>
              <b className="red">{copy.tally.reported}</b>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
