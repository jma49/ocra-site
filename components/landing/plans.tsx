import type { Copy } from "@/lib/copy";
import type { PlanId } from "@/lib/copy/sections/plans";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { ArrowGlyph, Lines, Section, withCode } from "./section";

const PLANS: readonly PlanId[] = ["self", "cloud", "team"];

// Open core, hosted when you want it: a ledger of plans beside a three-line
// head (sections.md §9). Stub from package F; C builds it out.
export function Plans({ copy, locale }: { copy: Copy["plans"]; locale: Locale }) {
  const links: Record<PlanId, string> = {
    self: localePath(locale, "/docs/quickstart"),
    cloud: cloudUrl,
    team: `${repoUrl}/blob/main/docs/roadmap.md`,
  };
  return (
    <Section id="plans" ground="paper" className="plans">
      <div className="wrap plans-grid">
        <div className="plans-head">
          <h2 className="t-h2">
            <Lines lines={copy.lines} />
          </h2>
          <p className="t-body">{copy.body}</p>
        </div>
        <div className="plans-ledger">
          {PLANS.map((id) => {
            const p = copy.items[id];
            return (
              <article key={id} className={id === "cloud" ? "plan sheet" : "plan"} data-plan={id}>
                <p className="plan-state t-small">
                  <span className="plan-shape" aria-hidden="true" />
                  {p.state}
                </p>
                <h3 className="t-h3">{p.name}</h3>
                <p className="plan-price">
                  <span className="t-figure price">{p.price}</span>
                  <span className="t-small">{p.unit}</span>
                </p>
                <a
                  className={id === "cloud" ? "btn btn-primary" : "btn btn-quiet"}
                  href={links[id]}
                >
                  {p.cta}
                  {id === "cloud" && <ArrowGlyph />}
                </a>
                <ul className="plan-points">
                  {p.points.map((point) => (
                    <li key={point}>{withCode(point)}</li>
                  ))}
                </ul>
              </article>
            );
          })}
          <p className="t-small plans-fine" id="plans-fine">
            {copy.fine}
          </p>
        </div>
      </div>
    </Section>
  );
}
