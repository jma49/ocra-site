import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/shared";
import { Arrow, Lines } from "./parts";

// Questions as native disclosures: the first open, the rest one at a time.
export function Faq({ copy, locale }: { copy: Copy["faq"]; locale: Locale }) {
  return (
    <section id="faq" className="sec" aria-labelledby="faq-h">
      <div className="wrap faq">
        <div>
          <h2 className="h2" id="faq-h">
            <Lines lines={copy.lines} />
          </h2>
          <a className="ulink" href={localePath(locale, "/docs/faq")}>
            {copy.more}
            <Arrow />
          </a>
        </div>
        <div className="qs">
          {copy.items.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="q">
              <summary>
                <span>{item.q}</span>
                <span className="acc-sign" aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
