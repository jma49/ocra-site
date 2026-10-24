import { LookingEyes } from "@/components/brand/eyes-mark";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath } from "@/lib/shared";
import { ArrowGlyph, Lines, Section } from "./section";

const INSTALL = "npm install -g @open-cr-agent/cli";

// Act: the second night band, the eye row at its largest, looking back at
// the reader (sections.md §11). Stub from package F; C builds the layout
// and the Copy button.
export function Final({ copy, locale }: { copy: Copy["final"]; locale: Locale }) {
  return (
    <Section id="final" ground="night" className="final">
      <div className="wrap final-grid">
        <LookingEyes size={560} className="final-eyes" />
        <div className="final-text">
          <h2 className="t-final">
            <Lines lines={copy.lines} />
          </h2>
          <div className="final-cta">
            <a className="btn btn-primary" href={cloudUrl}>
              {copy.cloud}
              <ArrowGlyph />
            </a>
            <a className="btn btn-quiet" href={localePath(locale, "/docs")}>
              {copy.manual}
            </a>
          </div>
          <figure className="prompt" aria-label={copy.install.label}>
            <span className="prompt-sign" aria-hidden="true">
              $
            </span>
            <code>{INSTALL}</code>
          </figure>
        </div>
      </div>
    </Section>
  );
}
