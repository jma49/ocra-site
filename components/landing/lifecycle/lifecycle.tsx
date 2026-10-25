import type { Copy } from "@/lib/copy";
import { KeyGlyph } from "../pen/marks";
import { Kicker, Lines, Section } from "../section";
import { LifecycleStates } from "./lifecycle-states";
import { ThreadComment, ThreadFile, ThreadLine, threadEvents } from "./thread";

// The anatomy's legend glyphs, in the order of `keys`: the margin bar (the
// quoted line it anchored), the tick (verified), the underline (why it is
// wrong), the caret (the fix). They describe the comment the hero showed.
const KEYS = ["bar", "tick", "under", "caret"] as const;

// One finding, after you push (sections.md §7): a GitHub conversation
// thread on the example run's finding, in three states, beside the head,
// the state's note and the comment's anatomy. The thread's pushes and
// replies are an illustration, labelled as one: they are not in the
// recording.
export function Lifecycle({ copy, onLine }: { copy: Copy["lifecycle"]; onLine: string }) {
  return (
    <Section ground="paper-2" className="lifecycle" labelledBy="life-h">
      <div className="wrap">
        <LifecycleStates
          copy={{
            tabs: copy.tabs,
            tablist: copy.tablist,
            pause: copy.pause,
            status: copy.status,
            outdated: copy.outdated,
            notes: copy.notes,
          }}
          head={
            <div className="life-head">
              <Kicker>{copy.label}</Kicker>
              <h2 className="t-h2" id="life-h">
                <Lines lines={copy.lines} />
              </h2>
              <p className="t-body">{copy.body}</p>
            </div>
          }
          chip={
            <span className="chip chip-illustration life-chip" aria-describedby="life-cap">
              {copy.illustration}
            </span>
          }
          file={<ThreadFile onLine={onLine} />}
          line={<ThreadLine onLine={onLine} />}
          comment={<ThreadComment />}
          events={threadEvents(copy)}
          caption={
            <p className="t-small life-cap" id="life-cap">
              {copy.caption}
            </p>
          }
          anatomy={
            <ul className="life-anatomy">
              {copy.keys.map((key, i) => (
                <li key={key.title}>
                  <KeyGlyph kind={KEYS[i] ?? "tick"} />
                  <h3 className="t-h4">{key.title}</h3>
                  <p className="t-small">{key.body}</p>
                </li>
              ))}
            </ul>
          }
        />
      </div>
    </Section>
  );
}
