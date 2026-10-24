import type { Copy } from "@/lib/copy";
import type { BillRow } from "@/lib/copy/sections/features";
import { exampleRun, formatCount } from "@/lib/landing/example-run";
import { InkCode } from "./code";
import { Marked, Tick } from "./pen/marks";
import { ArrowGlyph, Lines, Section, withCode } from "./section";

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

const { calls, tasks, usage } = exampleRun;
const helpers = calls.filter((c) => c.role !== "review");
const TOTALS: [Exclude<BillRow, "total">, number][] = [
  ["input", usage.input],
  ["cached", usage.cached],
  ["output", usage.output],
  ["reasoning", usage.reasoning],
];
const dollars = (n: number) => `$${n.toFixed(4)}`;

// Your rules, your budget, your models: the example run's bill as the
// section's object (sections.md §6). Stub from package F; P builds it out.
export function Features({ copy }: { copy: Copy["features"] }) {
  const b = copy.bill;
  return (
    <Section ground="paper" className="features">
      <div className="wrap">
        <h2 className="t-h2 feat-title">
          <Lines lines={copy.lines} inline={1200} />
        </h2>
        <div className="feat-grid">
          <div className="feat-bill">
            <h3 className="t-h3">{b.title}</h3>
            <p className="t-body">{withCode(b.body)}</p>
            <div className="feat-ledger">
              <div className="ledger-row feat-head t-small">
                <span>{b.cols.task}</span>
                <span>{b.cols.bundle}</span>
                <span>{b.cols.input}</span>
                <span>{b.cols.cost}</span>
              </div>
              {tasks.map((task) => {
                const call = calls.find((c) => c.id === task.id);
                return (
                  <div key={task.id} className="ledger-row">
                    <code>{task.id}</code>
                    <span>{task.bundle}</span>
                    <span className="ledger-num">{formatCount(call?.input ?? 0)}</span>
                    <span className="ledger-num">{dollars(call?.dollars ?? 0)}</span>
                  </div>
                );
              })}
              <div className="ledger-row">
                <span>{b.helpers}</span>
                <span />
                <span className="ledger-num">
                  {formatCount(helpers.reduce((s, c) => s + c.input, 0))}
                </span>
                <span className="ledger-num">
                  {dollars(Math.round(helpers.reduce((s, c) => s + c.dollars, 0) * 1e4) / 1e4)}
                </span>
              </div>
              <dl className="feat-totals">
                {TOTALS.map(([row, n]) => (
                  <div key={row}>
                    <dt className="t-small">{b.rows[row]}</dt>
                    <dd className="ledger-num">{formatCount(n)}</dd>
                  </div>
                ))}
              </dl>
              <p className="feat-total" data-pen="on" data-pen-once="">
                <span className="t-small">{b.rows.total}</span>
                <span className="t-figure dollar">
                  <Marked kind="double" at={0}>
                    {dollars(usage.dollars)}
                  </Marked>
                </span>
              </p>
              <p className="t-small feat-note">{b.note}</p>
            </div>
            <div className="feat-fallback">
              <span className="chip chip-illustration">{copy.fallback.illustration}</span>
              <h3 className="t-h4">{copy.fallback.title}</h3>
              <p className="feat-chain">
                <InkCode
                  text={copy.fallback.chain[0]}
                  marks={[{ kind: "strike", token: copy.fallback.chain[0], at: 0 }]}
                />
                <ArrowGlyph />
                <InkCode
                  text={copy.fallback.chain[1]}
                  marks={[{ kind: "strike", token: copy.fallback.chain[1], at: 0 }]}
                />
                <ArrowGlyph />
                <Tick at={0} />
                <code>{copy.fallback.chain[2]}</code>
              </p>
              <p className="t-small">{copy.fallback.body}</p>
            </div>
          </div>
          <div className="feat-rules">
            <h3 className="t-h3">{copy.rules.title}</h3>
            <p className="t-body">{withCode(copy.rules.body)}</p>
            <pre
              className="sheet feat-json"
              // biome-ignore lint/a11y/noNoninteractiveTabindex: code that scrolls sideways must take focus to scroll by keyboard
              tabIndex={0}
            >
              <span className="feat-json-c">{"// .ocra/rules.json\n"}</span>
              {RULES}
            </pre>
          </div>
        </div>
      </div>
    </Section>
  );
}
