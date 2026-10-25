import { LookingEyes } from "@/components/brand/eyes-mark";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { cloudUrl, localePath } from "@/lib/shared";
import { CopyCommand } from "./copy-command";
import { ArrowGlyph, Lines, Section } from "./section";

// Two unbreakable halves: where the line is too narrow, it breaks once,
// before the package name, never inside a flag or the name.
const RUN = "npm install -g";
const PACKAGE = "@open-cr-agent/cli";
const INSTALL = `${RUN} ${PACKAGE}`;

// Act: the second night band, the eye row at its largest beside the last
// call to action, so the page ends looking back at the reader (sections.md
// §11). The eyes follow the pointer (motion.tsx); they open as they scroll
// into view, widen when a hand reaches for an action and blink once when the
// command is copied (62-final.css, copy-command.tsx).
export function Final({ copy, locale }: { copy: Copy["final"]; locale: Locale }) {
  return (
    <Section id="final" ground="night" className="final" labelledBy="final-title">
      <div className="wrap final-grid">
        <LookingEyes size={560} className="final-eyes" />
        <div className="final-text">
          <h2 className="t-final" id="final-title">
            <Lines lines={copy.lines} />
          </h2>
          <div className="final-act">
            <div className="final-cta">
              <a className="btn btn-primary" href={cloudUrl}>
                {copy.cloud}
                <ArrowGlyph />
              </a>
              <a className="btn btn-quiet" href={localePath(locale, "/docs")}>
                {copy.manual}
              </a>
            </div>
            {/* biome-ignore lint/a11y/useSemanticElements: a command and its Copy button, not a form; a fieldset would announce a form group */}
            <div className="prompt" role="group" aria-labelledby="final-install">
              <div className="prompt-bar">
                <span className="prompt-label" id="final-install">
                  {copy.install.label}
                </span>
                <span className="prompt-meta">{copy.install.requires}</span>
                <CopyCommand text={INSTALL} label={copy.install.copy} done={copy.install.copied} />
              </div>
              <p className="prompt-line">
                <span className="prompt-sign" aria-hidden="true">
                  $
                </span>
                <code>
                  <span className="prompt-word">{RUN}</span>{" "}
                  <span className="prompt-word">{PACKAGE}</span>
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
