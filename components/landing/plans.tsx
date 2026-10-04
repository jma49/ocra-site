import type { Copy, PlanId } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { SplitHead, withCode } from "./heading";

const PLANS: PlanId[] = ["self", "cloud", "team"];
const FEATURED: PlanId = "cloud";

export function Plans({
  copy,
  locale,
}: {
  copy: Copy["plans"];
  locale: Locale;
}) {
  const links: Record<PlanId, string> = {
    self: localePath(locale, "/docs/quickstart"),
    cloud: cloudUrl,
    team: `${repoUrl}/blob/main/docs/roadmap.md`,
  };
  return (
    <section className="chapter tight-top" id="plans">
      <div className="wrap">
        <SplitHead
          title={copy.title}
          emphasis={copy.emphasis}
          body={copy.body}
        />
        <div className="plans">
          {PLANS.map((id) => {
            const p = copy.items[id];
            const featured = id === FEATURED;
            return (
              <article key={id} className={featured ? "plan feat" : "plan"}>
                <div className={p.planned ? "st pl" : "st"}>
                  <i />
                  {p.state}
                </div>
                <h3>{p.name}</h3>
                <div className="price">
                  <b>{p.price}</b>
                  <span>{p.unit}</span>
                </div>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>
                      <span>{withCode(pt)}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className={featured ? "btn btn-brand" : "btn btn-soft"}
                  href={links[id]}
                >
                  {p.cta}
                  {featured && <i>&rarr;</i>}
                </a>
              </article>
            );
          })}
        </div>
        <p className="fine">{copy.fine}</p>
      </div>
    </section>
  );
}
