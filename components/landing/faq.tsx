import { Fragment } from "react";
import { DeskGround } from "@/components/landing/desk/ground";
import { InkUnderline } from "@/components/landing/desk/hover-ink";
import { InkLayer } from "@/components/landing/desk/ink";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { tick } from "@/lib/landing/ink/marks";
import { localePath } from "@/lib/shared";
import { FaqFile } from "./faq-file";
import { ArrowGlyph, Section } from "./section";

// FAQ, on the desk (concept C, D4): a file of index cards beside a sticky
// head. Each card is a question; one pulls out of the file to answer, and
// the pen ticks a question once it has been read. The ticks are drawn here
// (the ink engine stays on the server) and handed to the file.
export function Faq({ copy, locale }: { copy: Copy["faq"]; locale: Locale }) {
  const ticks = copy.items.map((item, i) => (
    <InkLayer
      key={item.q}
      id={`faq-tick-${i}`}
      className="fq-tick"
      width={40}
      height={40}
      marks={[{ name: "tick", mark: tick(9, 15, { size: 18, width: 2.6, seed: 5 + i * 3 }) }]}
    />
  ));
  return (
    <Section id="faq" ground="desk" className="faq" labelledBy="faq-title">
      <DeskGround />
      <div className="fq-drop" aria-hidden="true" />
      <div className="wrap fq-in">
        <div className="fq-head">
          <h2 className="t-h2 fq-h" id="faq-title">
            {copy.lines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && locale === "en" ? " " : null}
                <span className="fq-hl">
                  <span className="fq-hli">{line}</span>
                </span>
              </Fragment>
            ))}
          </h2>
          <a className="ink-link fq-more" href={localePath(locale, "/docs/faq")}>
            {copy.more}
            <ArrowGlyph />
            <InkUnderline />
          </a>
        </div>
        <FaqFile items={copy.items} ticks={ticks} />
      </div>
      {/* Without JavaScript the buttons cannot open a card: show every answer. */}
      <noscript>
        <style>{".home .fq-a{grid-template-rows:1fr}.home .fq-a p{opacity:1}"}</style>
      </noscript>
    </Section>
  );
}
