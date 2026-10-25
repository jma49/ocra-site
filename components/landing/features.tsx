import { DeskGround } from "@/components/landing/desk/ground";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { BillSheet } from "./features-bill";
import { FeaturesPlay } from "./features-play";
import { Section, withCode } from "./section";

// You set the limits (concept C, D2): back on the desk, one arrangement.
// The copy on the left, the bill leading; on the right the example run's
// bill printed on one sheet, which the pen totals in ink. Painted finished;
// FeaturesPlay prints the rows, brings the pen in and types the footnote.
export function Features({ copy, locale }: { copy: Copy["features"]; locale: Locale }) {
  const items = [copy.bill, copy.rules, copy.fallback];
  return (
    <Section id="features" ground="desk" className="features" labelledBy="features-title">
      <DeskGround />
      <div className="wrap feat-grid">
        <div className="feat-copy">
          <p className="feat-eyebrow">{copy.eyebrow}</p>
          <h2 className="feat-h" id="features-title">
            {copy.lines.map((line, i) => (
              <span key={line} className="feat-hl">
                <span>
                  {line}
                  {i < copy.lines.length - 1 && locale === "en" ? " " : null}
                </span>
              </span>
            ))}
          </h2>
          <ol className="feat-list">
            {items.map((item, i) => (
              <li key={item.title} className={i === 0 ? "feat-item feat-lead" : "feat-item"}>
                <h3>{item.title}</h3>
                <p>{withCode(item.body)}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="feat-scene">
          <BillSheet s={copy.sheet} />
        </div>
      </div>
      <FeaturesPlay />
    </Section>
  );
}
