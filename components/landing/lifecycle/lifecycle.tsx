import type { Copy } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { CodeRows } from "../code";
import { BotAvatar } from "../comment";
import { KeyGlyph } from "../pen/marks";
import { Kicker, Lines, Section } from "../section";
import { inactive } from "../tabs";

const { finding } = exampleRun;
const KEYS = ["bar", "tick", "under", "caret"] as const;

// One finding after you push (sections.md §7). Stub from package F: the
// thread shows its Fixed state, line 42 struck as GitHub shows an outdated
// line; L builds the tabs, the three states and their clock.
export function Lifecycle({ copy, onLine }: { copy: Copy["lifecycle"]; onLine: string }) {
  return (
    <Section ground="paper-2" className="lifecycle">
      <div className="wrap life-grid">
        <div className="life-object">
          <div className="sheet life-thread">
            <div className="life-thread-head">
              <BotAvatar />
              <strong>github-actions</strong>
              <code>{finding.path}</code>
              <span className="t-small">{onLine}</span>
              <span className="chip chip-illustration" aria-describedby="life-cap">
                {copy.illustration}
              </span>
              <span className="life-status t-small">{copy.status.resolved}</span>
            </div>
            <CodeRows
              path={finding.path}
              label={finding.path}
              rows={[
                { n: finding.line, marks: [{ kind: "strike", token: finding.quote, at: 400 }] },
              ]}
            />
            <p className="life-title">
              <span className="sev-dot" aria-hidden="true" />
              <strong>{finding.title}</strong> · {finding.severity} · verified
            </p>
            {/* The three states' events, stacked: the thread never changes height. */}
            <div className="stack life-events">
              <div {...inactive(true)}>
                <p className="life-event t-small">{copy.pushed}</p>
              </div>
              <div {...inactive(false)}>
                <p className="life-event t-small">{copy.pushed}</p>
                <p className="life-event t-small">{copy.resolvedBot}</p>
              </div>
              <div {...inactive(true)}>
                <p className="life-event t-small">
                  <strong>{copy.maintainer}</strong> {copy.reply}
                </p>
                <p className="life-event t-small">{copy.resolvedMaintainer}</p>
              </div>
            </div>
          </div>
          <p className="t-small life-cap" id="life-cap">
            {copy.caption}
          </p>
        </div>
        <div className="life-text">
          <Kicker>{copy.label}</Kicker>
          <h2 className="t-h2">
            <Lines lines={copy.lines} />
          </h2>
          <p className="t-body">{copy.body}</p>
          <p className="t-lede life-note">{copy.notes.fixed}</p>
          <ul className="life-anatomy">
            {copy.keys.map((key, i) => (
              <li key={key.title}>
                <KeyGlyph kind={KEYS[i] ?? "tick"} />
                <h3 className="t-h4">{key.title}</h3>
                <p className="t-small">{key.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
