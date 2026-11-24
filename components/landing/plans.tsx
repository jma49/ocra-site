import type { Copy } from "@/lib/copy";
import type { PlanId } from "@/lib/copy/sections/plans";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { Inline, Lines } from "./parts";

const ORDER: PlanId[] = ["self", "cloud", "team"];

// Three plans: the open engine, the hosted console (the one dark card), and
// what is planned, drawn as an outline.
export function Plans({ copy, locale }: { copy: Copy["plans"]; locale: Locale }) {
  const hrefs: Record<PlanId, string> = {
    self: localePath(locale, "/docs/quickstart"),
    cloud: cloudUrl,
    team: `${repoUrl}/blob/main/docs/roadmap.md`,
  };
  return (
    <section id="plans" className="sec" aria-labelledby="plans-h">
      <div className="wrap">
        <div className="center-head">
          <h2 className="h2" id="plans-h">
            <Lines lines={copy.lines} />
          </h2>
          <p className="lead">{copy.body}</p>
        </div>
        <ul className="plans">
          {ORDER.map((id) => {
            const p = copy.items[id];
            return (
              <li key={id} className={`plan plan-${id}`}>
                <span className="small plan-state">{p.state}</span>
                <h3>{p.name}</h3>
                <p className="price">
                  {p.price}
                  <span>{p.unit}</span>
                </p>
                <ul>
                  {p.points.map((point) => (
                    <li key={point}>
                      <Inline text={point} />
                    </li>
                  ))}
                </ul>
                <a className={id === "cloud" ? "btn btn-ink" : "btn btn-line"} href={hrefs[id]}>
                  {p.cta}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="plans-fine" id="plans-fine">
          {copy.fine}
        </p>
      </div>
    </section>
  );
}
