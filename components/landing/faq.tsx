import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/shared";
import { FaqPhones } from "./faq-phones";
import { ArrowGlyph, Lines, Section } from "./section";

// Plain answers (sections.md §10): a sticky head beside six native
// disclosures, one open at a time (the first, from 1024 px: FaqPhones
// closes it in one column); the manual has the rest.
export function Faq({ copy, locale }: { copy: Copy["faq"]; locale: Locale }) {
  return (
    <Section ground="paper-2" className="faq" labelledBy="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 className="t-h2" id="faq-title">
            <Lines lines={copy.lines} />
          </h2>
          <a className="link faq-more" href={localePath(locale, "/docs/faq")}>
            {copy.more}
            <ArrowGlyph />
          </a>
        </div>
        <div className="faq-list">
          {copy.items.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0}>
              <summary>
                <span className="t-h4">{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p className="t-body">{item.a}</p>
            </details>
          ))}
        </div>
        <FaqPhones />
      </div>
    </Section>
  );
}
