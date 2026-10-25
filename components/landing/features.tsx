import type { CSSProperties, ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import type { BillRow } from "@/lib/copy/sections/features";
import { exampleRun, formatCount } from "@/lib/landing/example-run";
import { Marked, Tick } from "./pen/marks";
import { Lines, Section, withCode } from "./section";

// The real .ocra/rules.json shape (docs/manual/en/rules.mdx), its rules
// shortened.
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
const RULES_PATH = ".ocra/rules.json";
// The second rule's lines, which a phone leaves out.
const RULES_MORE = [6, 9] as const;

const { calls, tasks, usage } = exampleRun;
const round4 = (n: number) => Math.round(n * 1e4) / 1e4;
const dollars = (n: number) => `$${n.toFixed(4)}`;

// The bill's rows: each review task's call, then the helper calls (grouping,
// verification, the judge) on one line, in the order the run made them.
type Line = { id: string; bundle?: string; input: number; dollars: number };
const helpers = calls.filter((c) => c.role !== "review");
const LINES: Line[] = [
  ...tasks.map((task) => {
    const call = calls.find((c) => c.id === task.id);
    if (!call) throw new Error(`bill: no call for ${task.id}`);
    return { id: task.id, bundle: task.bundle, input: call.input, dollars: call.dollars };
  }),
  {
    id: "helpers",
    input: helpers.reduce((s, c) => s + c.input, 0),
    dollars: round4(helpers.reduce((s, c) => s + c.dollars, 0)),
  },
];
// The rows add up to the run's totals, or the build stops.
if (
  LINES.reduce((s, l) => s + l.input, 0) !== usage.input ||
  round4(LINES.reduce((s, l) => s + l.dollars, 0)) !== usage.dollars
) {
  throw new Error("bill: the rows do not add up to the run's usage");
}
const TOTALS: [Exclude<BillRow, "total">, number][] = [
  ["input", usage.input],
  ["cached", usage.cached],
  ["output", usage.output],
  ["reasoning", usage.reasoning],
];

// JSON in three tones: keys in ink, strings in ink-2, punctuation in ink-3.
function Tokens({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(/"[^"]*"(\s*:)?/g)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const colon = m[1];
    out.push(
      <span key={at} className={colon === undefined ? "j-s" : "j-k"}>
        {colon === undefined ? m[0] : m[0].slice(0, m[0].length - colon.length)}
      </span>,
    );
    if (colon !== undefined) out.push(colon);
    last = at + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

// One block per line, so a narrow sheet soft-wraps a long value under its
// own start (a hanging indent of `--h` characters) instead of hiding it.
// Below 600 px the file keeps its first rule only (`data-more` lines and
// the comma before them are hidden), still valid JSON.
function Json({ text, more }: { text: string; more: readonly [number, number] }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const key = line.match(/^\s*"[^"]*":\s*"?/);
        const hang = key ? key[0].length : line.length - line.trimStart().length;
        const extra = i >= more[0] && i <= more[1];
        const comma = i === more[0] - 1 && line.endsWith(",");
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: the lines of a constant
            key={i}
            className="jl"
            data-more={extra || undefined}
            style={{ "--h": hang } as CSSProperties}
          >
            <Tokens text={comma ? line.slice(0, -1) : line} />
            {comma && <span className="j-more">,</span>}
          </span>
        );
      })}
    </>
  );
}

function Ledger({ b }: { b: Copy["features"]["bill"] }) {
  return (
    <table className="feat-ledger">
      <thead>
        <tr className="t-small">
          <th scope="col">{b.cols.task}</th>
          <th scope="col" className="feat-c-bundle">
            {b.cols.bundle}
          </th>
          <th scope="col" className="feat-c-share">
            {b.cols.share}
          </th>
          <th scope="col" className="feat-num">
            {b.cols.input}
          </th>
          <th scope="col" className="feat-num">
            {b.cols.cost}
          </th>
        </tr>
      </thead>
      <tbody>
        {LINES.map((line, i) => (
          <tr key={line.id} style={{ "--r": i } as CSSProperties}>
            <th scope="row">
              {line.bundle ? (
                <>
                  <code>{line.id}</code>
                  <span className="feat-b-inline"> · {line.bundle}</span>
                </>
              ) : (
                <span className="feat-helpers">{b.helpers}</span>
              )}
            </th>
            <td className="feat-c-bundle">{line.bundle}</td>
            <td className="feat-c-share">
              <span className="feat-bar" aria-hidden="true">
                <i style={{ "--share": line.dollars / usage.dollars } as CSSProperties} />
              </span>
              <span className="sr-only">{Math.round((line.dollars / usage.dollars) * 100)}%</span>
            </td>
            <td className="feat-num">{formatCount(line.input)}</td>
            <td className="feat-num">{dollars(line.dollars)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The illustrated fallback chain: the first two models struck (the state
// under each says why), the third ticked. Drawn at rest: not a recorded event.
function Chain({ fb }: { fb: Copy["features"]["fallback"] }) {
  return (
    <ol className="feat-chain">
      {fb.chain.map((step, i) => {
        const last = i === fb.chain.length - 1;
        return (
          <li key={step.model} className={last ? "feat-go" : "feat-out"}>
            <span className="feat-model">
              {last ? (
                <>
                  <Tick at={0} />
                  {step.model}
                </>
              ) : (
                <Marked kind="strike" at={0}>
                  {step.model}
                </Marked>
              )}
            </span>
            <span className="t-small feat-state">{step.state}</span>
          </li>
        );
      })}
    </ol>
  );
}

// Your rules, your budget, your models (sections.md §6): the example run's
// bill carries the section, call by call; the rules file and the model
// chain sit beside it. The bars grow in the order the run made the calls,
// then the total is double-underlined, when the bill comes into view.
export function Features({ copy }: { copy: Copy["features"] }) {
  const b = copy.bill;
  const fb = copy.fallback;
  return (
    <Section ground="paper" className="features" labelledBy="features-title">
      <div className="wrap">
        <h2 className="t-h2 feat-title" id="features-title">
          <Lines lines={copy.lines} inline={1200} />
        </h2>
        <div className="feat-grid">
          <div className="feat-bill">
            <h3 className="t-h3">{b.title}</h3>
            <p className="t-body">{withCode(b.body)}</p>
            <div className="feat-book" data-pen="on" data-pen-once="0.8">
              <Ledger b={b} />
              <div className="feat-foot">
                <div className="feat-sums">
                  <dl className="feat-totals">
                    {TOTALS.map(([row, n]) => (
                      <div key={row}>
                        <dt className="t-small">{b.rows[row]}</dt>
                        <dd>{formatCount(n)}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="t-small feat-note">{b.note}</p>
                </div>
                <p className="feat-total">
                  <span className="t-small">{b.rows.total}</span>
                  <span className="t-figure dollar">
                    <Marked kind="double" at={700}>
                      {dollars(usage.dollars)}
                    </Marked>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="feat-side">
            <div className="feat-rules">
              <h3 className="t-h3">{copy.rules.title}</h3>
              <p className="t-body">{withCode(copy.rules.body)}</p>
              <div className="sheet feat-sheet">
                <div className="sheet-bar">
                  <span className="url">{RULES_PATH}</span>
                </div>
                <pre className="feat-json">
                  <code>
                    <Json text={RULES} more={RULES_MORE} />
                  </code>
                </pre>
              </div>
            </div>
            <div className="feat-fallback">
              <div className="feat-fb-head">
                <span className="chip chip-illustration">{fb.illustration}</span>
                <h3 className="t-h4">{fb.title}</h3>
              </div>
              <Chain fb={fb} />
              <p className="t-small feat-fb-body">{fb.body}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
