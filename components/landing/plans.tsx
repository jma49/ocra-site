import type { Copy } from "@/lib/copy";
import type { PlanId } from "@/lib/copy/sections/plans";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { ArrowGlyph, Lines, Section, withCode } from "./section";

const PLANS: readonly PlanId[] = ["self", "cloud", "team"];

// A plan's state is a shape and a word, in ink: filled = available now,
// half-filled = early access, hollow = planned. A price is not ocra acting
// on a change, so the pen stays out of this section (DESIGN.md, The pen).
type State = "now" | "early" | "planned";
const STATE: Record<PlanId, State> = { self: "now", cloud: "early", team: "planned" };

// What a plan includes gets an ink tick; what is planned, an en dash.
function PointGlyph({ planned }: { planned: boolean }) {
  if (planned) return <span className="plan-dash" aria-hidden="true" />;
  return (
    <svg className="plan-tick" viewBox="0 0 16 14" width="16" height="14" aria-hidden="true">
      <path d="M1.5 7.5 6 12 14.5 1.5" />
    </svg>
  );
}

// Open core, hosted when you want it: a ledger of plans beside a three-line
// head (sections.md §9). Rows, not cards; ocra Cloud is the one row laid on
// a sheet. Each row reads in two lines: who it is for and what it costs,
// then what it includes; the action comes last in reading order and sits at
// the end of the first line from 600 px.
export function Plans({ copy, locale }: { copy: Copy["plans"]; locale: Locale }) {
  const links: Record<PlanId, string> = {
    self: localePath(locale, "/docs/quickstart"),
    cloud: cloudUrl,
    team: `${repoUrl}/blob/main/docs/roadmap.md`,
  };
  return (
    <Section id="plans" ground="paper" className="plans" labelledBy="plans-title">
      <div className="wrap plans-grid">
        <div className="plans-head">
          <h2 className="t-h2" id="plans-title">
            <Lines lines={copy.lines} />
          </h2>
          <p className="t-body">{copy.body}</p>
        </div>
        <div className="plans-ledger">
          {PLANS.map((id) => {
            const p = copy.items[id];
            const planned = p.planned === true;
            return (
              <article
                key={id}
                className={id === "cloud" ? "plan sheet" : "plan"}
                data-plan={id}
                data-state={STATE[id]}
                aria-labelledby={`plan-${id}`}
              >
                <div className="plan-id">
                  <p className="plan-state">
                    <span className="plan-shape" aria-hidden="true" />
                    {p.state}
                  </p>
                  <h3 className="t-h3" id={`plan-${id}`}>
                    {p.name}
                  </h3>
                </div>
                <p className="plan-price">
                  <span className="t-figure price">{p.price}</span>
                  <span className="plan-unit">{p.unit}</span>
                </p>
                <ul className="plan-points">
                  {p.points.map((point) => (
                    <li key={point}>
                      <PointGlyph planned={planned} />
                      <span>{withCode(point)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className={id === "cloud" ? "btn btn-primary" : "btn btn-quiet"}
                  href={links[id]}
                >
                  {p.cta}
                  <ArrowGlyph />
                </a>
              </article>
            );
          })}
        </div>
        <p className="t-small plans-fine" id="plans-fine">
          {copy.fine}
        </p>
      </div>
    </Section>
  );
}
