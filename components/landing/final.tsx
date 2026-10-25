import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { tick } from "@/lib/landing/ink/marks";
import { recordedLine } from "@/lib/landing/recorded";
import { cloudUrl, localePath } from "@/lib/shared";
import { CopyCommand } from "./copy-command";
import { DeskGround } from "./desk/ground";
import { InkUnderline, PenTick } from "./desk/hover-ink";
import { InkLayer } from "./desk/ink";
import { Pen } from "./desk/objects";
import { CELL, Sheet } from "./desk/sheet";
import { FinalPlay } from "./final-play";
import { ArrowGlyph, Section } from "./section";

// Two unbreakable halves: where the line is too narrow, it breaks once,
// before the package name, never inside a flag or the name.
const RUN = "npm install -g";
const PACKAGE = "@open-cr-agent/cli";
const INSTALL = `${RUN} ${PACKAGE}`;

// The fix, printed: line 42 as recorded with the suggestion's insert in
// place, between the lines around it.
const { finding } = exampleRun;
const [before = "", after = ""] = recordedLine(finding.path, finding.line).split(
  finding.insertAfter,
);
const fixed = `${before}${finding.insertAfter}${finding.insert}${after}`;
const CODE_LINES = [
  { n: finding.line - 1, text: recordedLine(finding.path, finding.line - 1) },
  { n: finding.line, text: fixed },
  { n: finding.line + 1, text: recordedLine(finding.path, finding.line + 1) },
];
// Where a printer breaks a line too long for the phone's narrower sheet
// (62-final.css): after the last space that leaves the head within 36
// columns; the rest hangs four columns in. Wide, it reads as one line.
function printed(text: string) {
  const k = text.lastIndexOf(" ", 36);
  return text.length <= 48 || k < 0 ? [text, ""] : [text.slice(0, k), text.slice(k + 1)];
}
// The pen's tick after the corrected line, in the code's px.
const TICK = [
  { name: "tick", mark: tick((fixed.length + 2) * CELL.ch, CELL.row + 3, { size: 16, seed: 29 }) },
];

function Printed({ text }: { text: string }) {
  const [head, rest] = printed(text);
  return (
    <code>
      {head}
      {rest ? (
        <span className="final-wrap">
          <span className="final-sp"> </span>
          {rest}
        </span>
      ) : null}
    </code>
  );
}

// The close: the evening desk. The room light falls as the band enters, the
// lamp clicks on over the last sheet, the fix is typed into line 42 in the
// pen's ink, the pen ticks it and lies down off the print, and the install
// command is typed under it (final-play.tsx).
export function Final({ copy, locale }: { copy: Copy["final"]; locale: Locale }) {
  const s = copy.sheet;
  return (
    <Section id="final" ground="desk-evening" className="final" labelledBy="final-title">
      <DeskGround evening />
      <div className="final-dusk" aria-hidden="true" />
      <div className="final-lamp" aria-hidden="true" />
      <div className="wrap final-in">
        <div className="final-copy">
          <h2 className="t-h2 final-h" id="final-title">
            {copy.lines.map((line, i) => (
              <span key={line} className="final-hl">
                <span className="final-hli">
                  {line}
                  {locale === "en" && i < copy.lines.length - 1 ? " " : null}
                </span>
              </span>
            ))}
          </h2>
          <div className="final-cta">
            <a className="btn btn-desk" href={cloudUrl}>
              {copy.cloud}
              <span className="cta-arrow">
                <ArrowGlyph />
                <PenTick />
              </span>
            </a>
            <a className="ink-link" href={localePath(locale, "/docs")}>
              {copy.manual}
              <InkUnderline />
            </a>
          </div>
        </div>
        <div className="final-desk">
          <Sheet
            className="final-sheet"
            path={finding.path}
            meta={s.meta}
            rows={[]}
            over={
              <InkLayer
                id="final-tick"
                className="final-ink"
                width={600}
                height={90}
                marks={TICK}
              />
            }
          >
            <ol className="final-code" aria-label={s.label}>
              {CODE_LINES.map((l) => (
                <li key={l.n} className={l.n === finding.line ? "is-fixed" : undefined}>
                  <span className="final-ln" aria-hidden="true">
                    {l.n}
                  </span>
                  {l.n === finding.line ? (
                    <code>
                      {before}
                      {finding.insertAfter}
                      <span className="final-fix">{finding.insert}</span>
                      {after}
                    </code>
                  ) : (
                    <Printed text={l.text} />
                  )}
                </li>
              ))}
            </ol>
            {/* biome-ignore lint/a11y/useSemanticElements: a command and its Copy button, not a form */}
            <div className="final-install" role="group" aria-labelledby="final-install">
              <p className="final-install-label" id="final-install">
                {copy.install.label}
              </p>
              <p className="final-cmd">
                <span className="final-prompt" aria-hidden="true">
                  $
                </span>
                <code>
                  <span className="final-word">{RUN}</span>{" "}
                  <span className="final-word">{PACKAGE}</span>
                </code>
              </p>
              <p className="final-row">
                <span>{copy.install.requires}</span>
                <CopyCommand text={INSTALL} label={copy.install.copy} done={copy.install.copied} />
              </p>
            </div>
            <p className="final-foot">
              <span>{s.foot}</span>
              <span>{s.example}</span>
            </p>
            <div className="final-warm" aria-hidden="true" />
            <div className="final-shade" aria-hidden="true" />
            <Pen className="final-pen" rest={{ x: 120, y: 474, r: -4 }} />
          </Sheet>
        </div>
      </div>
      <FinalPlay />
    </Section>
  );
}
