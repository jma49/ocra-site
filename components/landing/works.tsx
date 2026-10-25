import { Fragment } from "react";
import { PaperBand } from "@/components/landing/desk/ground";
import { Pen } from "@/components/landing/desk/objects";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { PROVIDER_IDS, PROVIDERS } from "@/lib/landing/engine-facts";
import { Section } from "./section";
import { WorksPlay } from "./works-play";
import { WorksSpread } from "./works-spread";

// Works where you work (concept C, D2): the camera's first full-bleed paper.
// A poster headline, then one finding printed three times, as GitHub,
// GitLab and a terminal put it, the pen ringing line 42 in each; under it
// the providers ocra Cloud reaches, as an index of their ids. Painted
// finished; WorksPlay prints, types, rings and counts it once in view.
export function Works({ copy, locale }: { copy: Copy["works"]; locale: Locale }) {
  return (
    <Section id="product" ground="paper-band" className="works" labelledBy="works-title">
      <PaperBand>
        <div className="wrap works-in">
          <header className="works-head">
            <p className="t-kicker works-eyebrow">{copy.eyebrow}</p>
            <h2 className="t-h2 works-h" id="works-title">
              {copy.lines.map((line, i) => (
                <span key={line} className="works-hl">
                  <span>
                    {line}
                    {i < copy.lines.length - 1 && locale === "en" ? " " : null}
                  </span>
                </span>
              ))}
            </h2>
            <p className="works-lede">{copy.body}</p>
          </header>
          <WorksSpread copy={copy} locale={locale} />
          <div className="works-prov">
            <h3 className="works-count">
              <span className="works-num">{PROVIDERS}</span>
              <span className="works-gauge">{copy.gauge}</span>
            </h3>
            <div className="works-ids-at">
              <p className="works-ids">
                {PROVIDER_IDS.map((id, i) => (
                  <Fragment key={id}>
                    <span className="works-it">
                      <span className="works-id">{id}</span>
                      {i < PROVIDER_IDS.length - 1 ? <span className="works-sep"> ·</span> : null}
                    </span>{" "}
                  </Fragment>
                ))}
              </p>
              <p className="works-more">{copy.more}</p>
            </div>
            <div className="works-pen-at">
              <Pen className="works-pen" rest={{ x: 0, y: 0, r: -6 }} />
            </div>
          </div>
        </div>
      </PaperBand>
      <WorksPlay />
    </Section>
  );
}
