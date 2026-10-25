import { Fragment } from "react";
import { PaperBand } from "@/components/landing/desk/ground";
import { InkUnderline, PenTick } from "@/components/landing/desk/hover-ink";
import { InkLayer } from "@/components/landing/desk/ink";
import { Pen } from "@/components/landing/desk/objects";
import type { Copy } from "@/lib/copy";
import type { PlanId } from "@/lib/copy/sections/plans";
import type { Locale } from "@/lib/i18n";
import type { InkMark } from "@/lib/landing/ink/marks";
import { ring, stroke, wobble } from "@/lib/landing/ink/stroke";
import { cloudUrl, localePath, repoUrl } from "@/lib/shared";
import { PlansPlay } from "./plans-play";
import { ArrowGlyph, Section, withCode } from "./section";

const PLANS: readonly PlanId[] = ["self", "cloud", "team"];

// The ringed figure's ink, measured once in the browser (font-size 200 px,
// line height 1): the line box's width and the glyphs' ink box, in em. The
// ring is drawn round the ink in a layer sized from the line box in em
// (60-plans.css), so it scales with the figure, and a face that sets the
// word a few per cent wider keeps it centred.
const INK: Record<string, { w: number; x: number; y: number; iw: number; ih: number }> = {
  Free: { w: 2.051, x: 0.095, y: 0.145, iw: 1.942, ih: 0.699 },
  免费: { w: 2.08, x: 0.055, y: 0.04, iw: 1.9, ih: 0.92 },
};
// The layer's margin round the line box, in em; 100 units to the em.
const M = 0.45;

function priceRing(word: string, seed: number) {
  const plain = word.replace(/⁠/g, "");
  const m = INK[plain] ?? {
    w: 0.62 * plain.length,
    x: 0.05,
    y: 0.15,
    iw: 0.6 * plain.length,
    ih: 0.7,
  };
  const u = (em: number) => em * 100;
  // Han glyphs fill the em box: the ring needs more room round them.
  const han = /\p{Script=Han}/u.test(plain);
  const pts = ring({
    cx: u(M + m.x + m.iw / 2 + 0.02),
    cy: u(M + m.y + m.ih / 2),
    rx: u(m.iw / 2 + (han ? 0.26 : 0.2)),
    ry: u(m.ih / 2 + (han ? 0.17 : 0.1)),
    rot: -0.05,
    start: -2.55,
    sweep: Math.PI * 2 + 0.62,
    drift: 0.08,
    square: 2.25,
    seed,
  });
  const shape = stroke(wobble(pts, { amp: 1, wave: 150, seed }), {
    width: 4,
    tail: 0.38,
    lift: 0.16,
    start: 0.7,
    seed,
  });
  const mark: InkMark = { strokes: [{ ...shape, speed: 1 }] };
  return { mark, box: { w: u(m.w + 2 * M), h: u(1 + 2 * M) } };
}

// Plans, on paper (concept C, D4): a typed ledger of three rows between
// printed rules, the price column the image (Free, Free, Later). The pen
// rings the plan to start with, ocra Cloud, and lies down on the blank paper
// beside the footnote (PlansPlay). Painted finished: ringed, the pen at rest.
export function Plans({ copy, locale }: { copy: Copy["plans"]; locale: Locale }) {
  const links: Record<PlanId, string> = {
    self: localePath(locale, "/docs/quickstart"),
    cloud: cloudUrl,
    team: `${repoUrl}/blob/main/docs/roadmap.md`,
  };
  return (
    <Section id="plans" ground="paper-band" className="plans" labelledBy="plans-title">
      <PaperBand>
        <div className="wrap pl-in">
          <header className="pl-head">
            <h2 className="pl-h" id="plans-title">
              {copy.lines.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && locale === "en" ? " " : null}
                  <span className="pl-hl">
                    <span className="pl-hli">{line}</span>
                  </span>
                </Fragment>
              ))}
            </h2>
            <p className="pl-lede">{copy.body}</p>
          </header>
          <ol className="pl-ledger" aria-labelledby="plans-title">
            {PLANS.map((id) => {
              const p = copy.items[id];
              const ringed = id === "cloud";
              const ink = ringed ? priceRing(p.price, 7) : null;
              return (
                <li
                  key={id}
                  className={["pl-row", p.planned && "planned"].filter(Boolean).join(" ")}
                  data-plan={id}
                  aria-labelledby={`plan-${id}`}
                >
                  <div className="pl-name">
                    <p className="pl-state">{p.state}</p>
                    <h3 id={`plan-${id}`}>
                      {p.name}
                      {ringed ? (
                        <span className="pl-ref" aria-hidden="true">
                          *
                        </span>
                      ) : null}
                    </h3>
                  </div>
                  <p className="pl-price">
                    <span className="pl-fig">
                      <span className="pl-word">{p.price}</span>
                      {ink ? (
                        <InkLayer
                          id={`plan-${id}`}
                          className="pl-ring"
                          width={ink.box.w}
                          height={ink.box.h}
                          marks={[{ name: "ring", mark: ink.mark }]}
                        />
                      ) : null}
                    </span>
                    <span className="pl-unit">{p.unit}</span>
                  </p>
                  <ul className="pl-points">
                    {p.points.map((point) => (
                      <li key={point}>{withCode(point)}</li>
                    ))}
                  </ul>
                  <div className="pl-act">
                    {ringed ? (
                      <a className="btn btn-desk pl-cta" href={links[id]}>
                        {p.cta}
                        <span className="cta-arrow">
                          <ArrowGlyph />
                          <PenTick />
                        </span>
                      </a>
                    ) : (
                      <a className="ink-link pl-cta" href={links[id]}>
                        {p.cta}
                        <ArrowGlyph />
                        <InkUnderline />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="pl-foot">
            <p className="pl-fine" id="plans-fine">
              <span className="pl-star" aria-hidden="true">
                *
              </span>
              {copy.fine}
            </p>
            <div className="pl-pen-spot">
              <Pen className="pl-pen" rest={{ x: 0, y: 0, r: 4 }} />
            </div>
          </div>
        </div>
      </PaperBand>
      <PlansPlay />
    </Section>
  );
}
