import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { localePath } from "@/lib/shared";
import { InkCode } from "./code";
import { Marked, Tick } from "./pen/marks";
import { ArrowGlyph, Lines, Section } from "./section";

const REFUSED = [".env", "*.pem", "id_rsa", ".git/"];
// OpenCode's built-in tools, every one disabled for ocra's agents (ocra's
// packages/runtime-opencode/src/opencode-config.ts, OPENCODE_BUILTIN_TOOLS,
// for the pinned OpenCode version); four are shown by name.
const BUILTINS_OFF = ["bash", "edit", "write", "webfetch"];
const BUILTINS_TOTAL = 14;

// Built for code you do not trust: the stone band and its gate (sections.md
// §8). Every mark here is drawn at rest (standing policy), and only on
// sheets: the pen never writes on stone. Stub from package F; L builds it.
export function Security({ copy, locale }: { copy: Copy["security"]; locale: Locale }) {
  const f = copy.flow;
  return (
    <Section id="security" ground="stone" className="security">
      <div className="wrap">
        <h2 className="t-band">
          <Lines lines={copy.lines} />
        </h2>
        <div className="sec-intro">
          <p className="t-body">{copy.body}</p>
          <a className="link sec-link" href={localePath(locale, "/docs/threat-model")}>
            {copy.link}
            <ArrowGlyph />
          </a>
        </div>
        <ol className="sec-gate">
          <li className="sec-tile quiet">
            <p className="t-h4">{f.repo}</p>
            <p className="t-small">{f.repoNote}</p>
          </li>
          <li className="sec-tile sheet">
            <p className="t-h4">
              <code>ReviewContext</code> · {f.gate}
            </p>
            <p className="t-small sec-label">{f.refused}</p>
            <p className="sec-chips">
              <span className="sr-only">{f.refusedSr}</span>
              {REFUSED.map((p) => (
                <InkCode
                  key={p}
                  className="sec-chip"
                  text={p}
                  marks={[{ kind: "strike", token: p, at: 0 }]}
                />
              ))}
              <span className="sec-chip">
                <Marked kind="strike" at={0}>
                  {f.outside}
                </Marked>
              </span>
            </p>
          </li>
          <li className="sec-tile sheet">
            <p className="t-h4">{f.agents}</p>
            <p className="t-small sec-label">{f.tools}</p>
            <ul className="sec-tools">
              {exampleRun.toolsCalled.map((tool) => (
                <li key={tool}>
                  <Tick at={0} />
                  <code>{tool}</code>
                  <span className="sr-only">{f.on}</span>
                </li>
              ))}
            </ul>
            <p className="t-small sec-label">{f.builtins}</p>
            <p className="sec-chips">
              {BUILTINS_OFF.map((tool) => (
                <span key={tool}>
                  <InkCode
                    className="sec-chip"
                    text={tool}
                    marks={[{ kind: "strike", token: tool, at: 0 }]}
                  />
                  <span className="sr-only">{f.off}</span>
                </span>
              ))}
              <span className="t-small">
                {fill(f.more, { n: BUILTINS_TOTAL - BUILTINS_OFF.length })}
              </span>
            </p>
          </li>
          <li className="sec-tile quiet">
            <p className="t-h4">{f.provider}</p>
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
      </div>
    </Section>
  );
}
