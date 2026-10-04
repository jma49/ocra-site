import type { Copy } from "@/lib/copy";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { SplitHead, withCode } from "./heading";

export function Plans({
  copy,
  locale,
}: {
  copy: Copy["plans"];
  locale: string;
}) {
  const links = [
    localePath(locale, "/docs/quickstart"),
    cloudUrl,
    `${repoUrl}/blob/main/docs/roadmap.md`,
  ];
  return (
    <section className="chapter tight-top" id="plans">
      <div className="wrap">
        <SplitHead
          title={copy.title}
          emphasis={copy.emphasis}
          body={copy.body}
        />
        <div className="plans">
          {copy.items.map((p, i) => (
            <article key={p.name} className={i === 1 ? "plan feat" : "plan"}>
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
                className={i === 1 ? "btn btn-brand" : "btn btn-soft"}
                href={links[i]}
              >
                {p.cta}
                {i === 1 && <i>&rarr;</i>}
              </a>
            </article>
          ))}
        </div>
        <p className="fine">{copy.fine}</p>
      </div>
    </section>
  );
}
