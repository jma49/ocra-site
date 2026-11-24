import type { Copy } from "@/lib/copy";
import { exampleRun, formatCount } from "@/lib/landing/example-run";
import { Inline, Lines } from "./parts";

const { calls, tasks, usage } = exampleRun;
const reviews = calls.filter((c) => c.role === "review");
const helpers = calls.filter((c) => c.role !== "review");
const helperTotal = {
  input: helpers.reduce((s, c) => s + c.input, 0),
  dollars: Math.round(helpers.reduce((s, c) => s + c.dollars, 0) * 1e4) / 1e4,
};
const money = (n: number) => `$${n.toFixed(4)}`;

// Your model, your limits: four promises beside the recorded run's bill,
// every number from the run (lib/landing/example-run.ts).
export function Limits({ copy }: { copy: Copy["limits"] }) {
  const rows = [
    ...reviews.map((c) => ({
      id: c.id,
      bundle: tasks.find((t) => t.id === c.id)?.bundle,
      input: c.input,
      dollars: c.dollars,
    })),
    { id: copy.bill.helpers, bundle: undefined, ...helperTotal },
  ];
  return (
    <section className="sec" aria-labelledby="limits-h">
      <div className="wrap">
        <div className="bill-wrap">
          <div className="bill-text">
            <h2 className="h2" id="limits-h">
              <Lines lines={copy.lines} />
            </h2>
            <ul className="rows">
              {copy.rows.map((r) => (
                <li key={r.title}>
                  <h3>{r.title}</h3>
                  <p>
                    <Inline text={r.body} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="bill float">
            <div className="bill-top t3 small">
              <span>{copy.bill.label}</span>
              <span>{copy.bill.example}</span>
            </div>
            <div className="bill-total">
              <span className="t3">{copy.bill.total}</span>
              <b>{money(usage.dollars)}</b>
            </div>
            <table className="bt">
              <thead className="t3">
                <tr>
                  <th scope="col">{copy.bill.task}</th>
                  <th scope="col">{copy.bill.input}</th>
                  <th scope="col">{copy.bill.cost}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <th scope="row" className={r.bundle ? "mono" : "t2"}>
                      {r.id} {r.bundle ? <i>{r.bundle}</i> : null}
                    </th>
                    <td>{formatCount(r.input)}</td>
                    <td>{money(r.dollars)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bar" aria-hidden="true">
              {rows.map((r) => (
                <span key={r.id} style={{ flexGrow: r.dollars }} />
              ))}
            </div>
            <figcaption className="t3 small">{copy.bill.note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
