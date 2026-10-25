import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import { type ClaimOutcome, exampleRun } from "@/lib/landing/example-run";
import { Arrow, Band, Marked, Tick } from "../pen/marks";

type F = Copy["how"]["figures"];
type Claim = (typeof exampleRun.claims)[number];
const { claims } = exampleRun;

// When the pen acts on each claim, in pipeline order (motion.md §6): the
// memory filter sets #2 aside, the verifier ticks #1 and #3 and strikes
// #4, the judge merges #3 into #1.
const AT: Record<ClaimOutcome, number> = {
  remembered: 400,
  confirmed: 800,
  merged: 1000,
  disproved: 1200,
};
const STRUCK: ReadonlySet<ClaimOutcome> = new Set(["remembered", "disproved"]);

// The claims grouped by the task that reported them, in the run's order.
const GROUPS = [...new Set(claims.map((c) => c.task))].map((task) => ({
  task,
  claims: claims.filter((c) => c.task === task),
}));

// Rows in em of the 16 px list (31-figures.css fixes these heights), so the
// judge's arrow from #3 to #1 is drawn to scale. A row centres its title, or
// its title and the gloss under it (zh), so a glossed title's line sits
// `GLOSS_LIFT` above the row's middle.
const TASK_ROW = 1.75;
const CLAIM_ROW = 3.75;
const GLOSS_LIFT = 0.58;
function titleMiddle(index: number, glossed: boolean): number {
  const claim = claims[index];
  const group = GROUPS.findIndex((g) => g.task === claim?.task);
  const middle = (group + 1) * TASK_ROW + index * CLAIM_ROW + CLAIM_ROW / 2;
  return glossed ? middle - GLOSS_LIFT : middle;
}
const merged = claims.findIndex((c) => c.outcome === "merged");
const into = claims.findIndex((c) => c.outcome === "confirmed");

// Below 600 px a struck title may wrap: the wrap-safe band, split where
// the narrowest phone breaks it.
function phoneLines(title: string): string[] {
  if (title.length <= 24) return [title];
  const cut = title.lastIndexOf(" ", 18);
  return [title.slice(0, cut), title.slice(cut + 1)];
}

function Title({ claim }: { claim: Claim }) {
  if (!STRUCK.has(claim.outcome)) return <span className="fig-claim-t">{claim.title}</span>;
  const at = AT[claim.outcome];
  return (
    <span className="fig-claim-t">
      <span className="fig-wide">
        <Marked kind="strike" at={at}>
          {claim.title}
        </Marked>
      </span>
      <span className="fig-narrow">
        <Band kind="strike" lines={phoneLines(claim.title)} at={at} />
      </span>
    </span>
  );
}

function Outcome({ f, outcome }: { f: F; outcome: ClaimOutcome }) {
  return (
    <span className="fig-outcome" data-outcome={outcome}>
      {f.ledger[outcome].split(" · ").map((part, i) => (
        <span key={part}>
          {i > 0 && <span className="fig-sep"> · </span>}
          {part}
        </span>
      ))}
    </span>
  );
}

// Story figure 4, filter · verify · judge · verdict: the four candidate
// findings and what became of each, then the verdict, computed in code. It
// tightens (font-stretch 100 % → 66 %) at 2100 ms and is double-underlined
// at 2950; "1 verified critical" stands under it.
export function FigureVerify({ f }: { f: F }) {
  const glossed = Object.values(f.claimGloss).some(Boolean);
  return (
    <>
      <div className="fig-claims" style={{ "--fs": 16 } as CSSProperties}>
        {GROUPS.map((group) => (
          <div key={group.task} className="fig-group">
            <p className="fig-group-k">{group.task}</p>
            <ol>
              {group.claims.map((claim) => {
                const n = claims.indexOf(claim) + 1;
                const gloss = f.claimGloss[claim.id];
                return (
                  <li key={claim.id} className="fig-claim" data-outcome={claim.outcome}>
                    <span className="fig-gut">
                      {!STRUCK.has(claim.outcome) && <Tick at={AT[claim.outcome]} />}
                    </span>
                    <span className="fig-n">#{n}</span>
                    <span className="fig-claim-main">
                      <Title claim={claim} />
                      {gloss && <span className="fig-gloss">{gloss}</span>}
                      {"reason" in claim && <code className="fig-reason">{claim.reason}</code>}
                    </span>
                    <Outcome f={f} outcome={claim.outcome} />
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        <Arrow
          from={{ x: 0.7, y: titleMiddle(merged, glossed) - 0.2 }}
          to={{ x: 0.75, y: titleMiddle(into, glossed) + 0.45 }}
          dir="up"
          at={1600}
        />
      </div>
      <div className="fig-foot fig-verdict">
        <div className="verdict-row t-verdict">
          <p className="verdict">
            <Marked kind="double" at={2950}>
              {f.ledger.verdict}
            </Marked>
          </p>
        </div>
        <p className="fig-critical">{f.ledger.critical}</p>
      </div>
    </>
  );
}
