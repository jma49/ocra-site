import type { Copy } from "@/lib/copy";
import { Heading, withCode } from "./heading";

// The real .ocra/rules.json shape (docs/manual/en/rules.mdx).
const RULES = `{
  "rules": [
    {
      "path": "services/billing/**",
      "rule": "Every write must carry an idempotency key."
    },
    {
      "path": ["**/*.sql", "db/migrations/**"],
      "rule": "Migrations stay backward compatible."
    }
  ]
}`;

// Numbers from the recorded example run.
const BILL = ["315,936", "209,152", "17,510", "$0.5134"];
const TOOLS: [string, boolean][] = [
  ["read", true],
  ["search", true],
  ["edit", false],
  ["shell", false],
  ["web", false],
];

function Json({ text }: { text: string }) {
  return (
    <pre className="snippet">
      <span className="c">{"// .ocra/rules.json\n"}</span>
      {text.split(/("[^"]*")/).map((part, i) =>
        part.startsWith('"') ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static sample
          <span key={i} className="s">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </pre>
  );
}

export function Features({ copy }: { copy: Copy["features"] }) {
  return (
    <section className="chapter tight-top features">
      <div className="wrap">
        <Heading
          title={copy.title}
          emphasis={copy.emphasis}
          className="narrow"
        />
        <div className="cards">
          <article className="card c-wide">
            <h3>{copy.rules.title}</h3>
            <p>{withCode(copy.rules.body)}</p>
            <div className="vis2">
              <Json text={RULES} />
            </div>
          </article>
          <article className="card c-narrow">
            <h3>{copy.write.title}</h3>
            <p>{copy.write.body}</p>
            <div className="vis2 toggles">
              {TOOLS.map(([name, on]) => (
                <div key={name}>
                  {name}
                  <span className={on ? "sw on" : "sw"} />
                </div>
              ))}
            </div>
          </article>
          <article className="card c-half">
            <h3>{copy.bill.title}</h3>
            <p>{withCode(copy.bill.body)}</p>
            <div className="vis2 bill">
              {copy.bill.rows.map((row, i) => (
                <div key={row}>
                  <span>{row}</span>
                  <span>{BILL[i]}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="card c-half">
            <h3>{copy.fallback.title}</h3>
            <p>{copy.fallback.body}</p>
            <div className="vis2 chain">
              <span className="x">{copy.fallback.chain[0]}</span>
              <span className="ar">&rarr;</span>
              <span className="x">{copy.fallback.chain[1]}</span>
              <span className="ar">&rarr;</span>
              <span className="go">{copy.fallback.chain[2]}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
