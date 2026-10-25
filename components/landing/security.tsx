import type { ReactNode } from "react";
import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import type { Locale } from "@/lib/i18n";
import { accessDenied, BUILTINS_OFF, OPENCODE_BUILTINS, REFUSED } from "@/lib/landing/engine-facts";
import { exampleRun } from "@/lib/landing/example-run";
import { measured } from "@/lib/landing/measured";
import { localePath } from "@/lib/shared";
import { InkCode } from "./code";
import { Marked, Tick } from "./pen/marks";
import { ArrowGlyph, Lines, Section } from "./section";

// The refusal the gate tile shows: an agent asks for the first refused path.
const ASKED = REFUSED[0];
const DENIED = accessDenied(ASKED);

// A tile title in two set lines, "what · how": the separator is read, not
// shown, so a narrow tile never breaks the title next to it.
function TileTitle({ what, how }: { what: ReactNode; how: string }) {
  return (
    <h3 className="t-h4 sec-title">
      <span className="sec-what">{what}</span>
      <span className="sr-only"> · </span>
      <span className="sec-how">{how}</span>
    </h3>
  );
}
const split = (title: string) => {
  const at = title.indexOf(" · ");
  return at < 0 ? { what: title, how: "" } : { what: title.slice(0, at), how: title.slice(at + 3) };
};

// The measured result's sentence with its numbers set apart (fill's
// placeholders, each a figure from measured.ts).
function Figures({ text }: { text: string }) {
  return text.split(/\{(\w+)\}/).map((part, i) => {
    if (i % 2 === 0) return part;
    const value = measured[part as keyof typeof measured];
    if (value === undefined) throw new Error(`security: no measured value for {${part}}`);
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: a fixed split of static copy
      <span key={i} className="sec-n">
        {value}
      </span>
    );
  });
}

// Between two tiles of the gate: an arrow in the gap beside the tiles, a
// Maple ↓ above a tile where they stack (phones).
function Flow() {
  return (
    <span className="sec-flow" aria-hidden="true">
      <ArrowGlyph />
      <span className="sec-down">↓</span>
    </span>
  );
}

// Built for code you do not trust: a night band and the gate that enforces
// it (sections.md §8), led by the gate rather than a statement head, so it
// does not open like Quiet, the night band before it. The gate is standing
// policy, so its marks are drawn at rest, and only on the two sheets laid on
// the band. The tools ticked are the ones the example run's agents called
// (recorded.ts checks them against the transcript). The band closes on the
// one measured result, with its sample size.
export function Security({ copy, locale }: { copy: Copy["security"]; locale: Locale }) {
  const f = copy.flow;
  return (
    <Section id="security" ground="night" className="security" labelledBy="sec-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="t-h2 sec-h" id="sec-h">
            <Lines lines={copy.lines} inline={1200} />
          </h2>
          <div className="sec-intro">
            <p className="t-body">{copy.body}</p>
            <a className="link sec-link" href={localePath(locale, "/docs/threat-model")}>
              {copy.link}
              <ArrowGlyph />
            </a>
          </div>
        </div>
        <ol className="sec-gate">
          <li className="sec-tile sec-end">
            <h3 className="t-h4">{f.repo}</h3>
            <p className="t-small">{f.repoNote}</p>
          </li>
          <li className="sec-tile sheet sec-core">
            <Flow />
            <TileTitle what={<code>ReviewContext</code>} how={f.gate} />
            <p className="sec-label">{f.refused}</p>
            <p className="sr-only">{f.refusedSr}</p>
            <ul className="sec-list">
              {REFUSED.map((path) => (
                <li key={path}>
                  <InkCode
                    className="sec-chip"
                    text={path}
                    marks={[{ kind: "strike", token: path, at: 0 }]}
                  />
                </li>
              ))}
              <li>
                <span className="sec-chip sec-chip-text">
                  <Marked kind="strike" at={0}>
                    {f.outside}
                  </Marked>
                </span>
              </li>
            </ul>
            <p className="sec-answer">
              <code className="sec-ask">
                read_file <span>{ASKED}</span>
              </code>
              <code className="sec-denied">{DENIED}</code>
            </p>
          </li>
          <li className="sec-tile sheet sec-agents">
            <Flow />
            <TileTitle {...split(f.agents)} />
            <p className="sec-label">{f.tools}</p>
            <ul className="sec-list sec-tools">
              {exampleRun.toolsCalled.map((tool) => (
                <li key={tool}>
                  <Tick at={0} />
                  <code>{tool}</code>
                  <span className="sr-only"> {f.on}</span>
                </li>
              ))}
            </ul>
            <p className="sec-label">{f.builtins}</p>
            <ul className="sec-off">
              {BUILTINS_OFF.map((tool) => (
                <li key={tool}>
                  <InkCode
                    className="sec-chip"
                    text={tool}
                    marks={[{ kind: "strike", token: tool, at: 0 }]}
                  />
                  <span className="sr-only"> {f.off}</span>
                </li>
              ))}
              <li className="sec-more">
                {fill(f.more, { n: OPENCODE_BUILTINS - BUILTINS_OFF.length })}
              </li>
            </ul>
          </li>
          <li className="sec-tile sec-end">
            <Flow />
            <h3 className="t-h4">{f.provider}</h3>
            <p className="t-small">{f.providerNote}</p>
          </li>
        </ol>
        <ul className="sec-props">
          {copy.props.map((p) => (
            <li key={p.title}>
              <h3 className="t-h4">{p.title}</h3>
              <p className="t-small">{p.body}</p>
            </li>
          ))}
        </ul>
        <div className="sec-proof">
          <h3 className="t-h4">{copy.proof.label}</h3>
          <p className="t-statement-body sec-proof-text">
            <Figures text={copy.proof.text} />
          </p>
          <a className="link sec-link" href={localePath(locale, "/docs/quality")}>
            {copy.proof.link}
            <ArrowGlyph />
          </a>
        </div>
      </div>
    </Section>
  );
}
