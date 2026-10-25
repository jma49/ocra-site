import type { CSSProperties } from "react";
import type { Copy } from "@/lib/copy";
import { ringAround, strike } from "@/lib/landing/ink/marks";
import { PaperBand } from "./desk/ground";
import { InkLayer } from "./desk/ink";
import { Pen } from "./desk/objects";
import { QuietPlay } from "./quiet-play";
import { ArrowGlyph, Section } from "./section";

// Quiet by design: the paper the story's camera pushed into (concept C with
// A's poster). The reviewers' out-of-scope list is set large and struck by
// the pen, each word ending in a dele loop; under a hairline, the example
// run's count, its one report ringed. Painted struck; with motion the pen
// writes the strikes when the poster is in view (quiet-play.tsx).

// Each word's width in em at the poster's face (Archivo 500, -0.02em), measured
// once in the browser; Chinese is set in full-width characters, one em each.
const WIDTH: Record<string, number> = {
  Style: 2.183,
  Speculation: 5.173,
  "Unchanged code": 7.406,
};
const han = (word: string) => [...word].filter((c) => /\p{Script=Han}/u.test(c)).length;

// A word's strike, in hundredths of an em over a box 0.1 em above the word.
function struck(word: string, i: number, zh: boolean) {
  const w = (zh ? han(word) : (WIDTH[word] ?? word.length * 0.55)) * 100;
  const y = zh ? 68 : 67;
  return {
    width: w + 80,
    marks: [{ name: "strike", mark: strike(2, w - 3, y, { width: zh ? 6 : 7, seed: 31 + i }) }],
  };
}

const RING = [{ name: "ring", mark: ringAround(20, 14, 60, 72, { width: 4.2, seed: 41 }) }];

type Count = Copy["statement"]["proof"]["from"];
function Side({ count, ring }: { count: Count; ring?: boolean }) {
  return (
    <span className="qp-side">
      {count.before ? <span className="qp-w">{count.before} </span> : null}
      <span className="qp-n" data-count={ring ? undefined : "0"}>
        {count.n}
        {ring ? (
          <InkLayer
            id="quiet-ring"
            className="qp-ring"
            width={100}
            height={100}
            marks={RING}
            once
          />
        ) : null}
      </span>
      <span className="qp-w"> {count.after}</span>
    </span>
  );
}

export function Statement({ copy }: { copy: Copy["statement"] }) {
  const zh = han(copy.outOfScope[0]) > 0;
  const proof = copy.proof;
  return (
    <Section id="quiet" ground="paper-band" className="quiet" labelledBy="quiet-title">
      <PaperBand>
        <div className="wrap quiet-in">
          <div className="quiet-head">
            <h2 className="t-h2 quiet-h" id="quiet-title">
              {copy.lines.map((line, i) => (
                <span key={line} className="quiet-hl">
                  <span className="quiet-hli">
                    {line}
                    {!zh && i < copy.lines.length - 1 ? " " : null}
                  </span>
                </span>
              ))}
            </h2>
            <p className="quiet-lead">{copy.lead}</p>
          </div>
          <div className="quiet-poster">
            <ul className="quiet-words" aria-label={copy.caption}>
              {copy.outOfScope.map((word, i) => {
                const s = struck(word, i, zh);
                return (
                  <li key={word}>
                    <span className="quiet-word">
                      <s className="quiet-s">{word}</s>
                      <InkLayer
                        id={`quiet-${i}`}
                        className="quiet-ink"
                        width={s.width}
                        height={120}
                        marks={s.marks}
                        style={{ "--w": `${s.width / 100}em` } as CSSProperties}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
            <Pen className="quiet-pen" rest={{ x: 0, y: 0, r: -24 }} />
          </div>
          <div className="quiet-foot">
            <p className="quiet-caption">{copy.caption}</p>
            <p className="quiet-proof">
              <span className="qp-label">
                {proof.label}
                <span className="sr-only">: </span>
              </span>
              <Side count={proof.from} />
              <span className="qp-arrow" aria-hidden="true">
                <ArrowGlyph />
              </span>
              <span className="sr-only">, </span>
              <Side count={proof.to} ring />
            </p>
          </div>
        </div>
      </PaperBand>
      <QuietPlay />
    </Section>
  );
}
