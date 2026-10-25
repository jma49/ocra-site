import { Fragment, type ReactNode } from "react";
import { PaperBand } from "@/components/landing/desk/ground";
import { InkUnderline } from "@/components/landing/desk/hover-ink";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import {
  ALSO_REFUSED,
  accessDenied,
  BUILTINS_OFF,
  CLAUSE_SOURCES,
  MAX_AGENT_STEPS,
  OPENCODE_BUILTINS,
  REFUSED_RULES,
} from "@/lib/landing/engine-facts";
import { rng } from "@/lib/landing/ink/stroke";
import { measured } from "@/lib/landing/measured";
import { localePath, repoUrl } from "@/lib/shared";
import { Section } from "./section";
import { SecurityPlay } from "./security-play";

// Built for code you do not trust (D3, concept C), on a paper band. The
// poster: the four paths the gate refuses at poster size, each struck through
// by a black marker in two passes (the gate is code, not the reviewer's pen,
// so never cinnabar), with the rule that refuses it, and the refusal typed
// verbatim on the first. Then a printed page: the four properties, each
// citing where the engine enforces it, and the one measured result. The
// bars are drawn once, filtered once, and revealed by scroll through a
// sliding window (51-security.css), so scrubbing never re-rasterises them.

const ASKED = REFUSED_RULES[0].path;
// Maple Mono's advance, in em, the baseline of a line set solid, and the
// strike's centre: halfway up its x-height (0.56 em).
const ADVANCE = 0.6034;
const BASE = 86;
const STRIKE = BASE - 28;

// A chisel marker's stroke from x0 to x1 between yTop and yBot, in units of
// the type's size (100 = 1 em): wobbling edges, the ends cut at the
// chisel's angle, narrower where it lands.
function marker(x0: number, x1: number, yTop: number, yBot: number, seed: number, rise: number) {
  const r = rng(seed);
  const h = yBot - yTop;
  const n = 40;
  const wob = Array.from({ length: n + 1 }, () => (r() - 0.5) * h * 0.035);
  const wob2 = Array.from({ length: n + 1 }, () => (r() - 0.5) * h * 0.035);
  const smooth = (arr: number[], i: number) => arr[Math.min(n, i)] ?? 0;
  const slant = h * 0.11;
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = x0 + (x1 - x0) * u;
    const mid = (yTop + yBot) / 2 + (x1 - x0) * rise * u + Math.sin(u * Math.PI) * h * 0.04;
    const half = (h / 2) * Math.min(1, 0.82 + u * 6);
    top.push(`${(x + slant).toFixed(1)} ${(mid - half + smooth(wob, i)).toFixed(1)}`);
    bot.push(`${(x - slant).toFixed(1)} ${(mid + half + smooth(wob2, i)).toFixed(1)}`);
  }
  return `M${bot[0]}L${top.join("L")}L${bot.reverse().join("L")}Z`;
}

// One strike through a path of `chars` characters, a firm line across the
// x-height that leaves the word legible: two passes, the second laid a hair
// lower to firm the line's foot, each in its own window.
function Bar({ chars, i }: { chars: number; i: number }) {
  const w = chars * ADVANCE * 100;
  const x0 = -6;
  const x1 = w + 10;
  const passes = [
    marker(x0, x1, STRIKE - 6, STRIKE + 5, 3 + i * 7, -0.008),
    marker(x0 + 6, x1 - 5, STRIKE - 2, STRIKE + 6, 5 + i * 11, 0.005),
  ];
  const vw = x1 + 16 - (x0 - 16);
  return (
    <span className="sec-bar" aria-hidden="true">
      {passes.map((d, j) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: two fixed passes
          key={j}
          className="sec-win"
          data-pass={j + 1}
          style={{ width: `${vw / 100 + 0.4}em` }}
        >
          <span className="sec-win-in">
            <svg
              viewBox={`${x0 - 16} 0 ${vw} 120`}
              width={`${vw / 100}em`}
              height="1.2em"
              aria-hidden="true"
              focusable="false"
            >
              <path className="sec-ink" d={d} filter="url(#ink-black)" />
            </svg>
          </span>
        </span>
      ))}
    </span>
  );
}

// The black marker's ink: A's fibre edge, with streaks along the stroke and
// a darker rim. Its units are the bar's (1 em = 100).
function MarkerDefs() {
  return (
    <svg className="sec-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <filter
        id="ink-black"
        x="-4%"
        y="-30%"
        width="108%"
        height="160%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.98"
          numOctaves={2}
          seed={7}
          result="fibre"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="fibre"
          scale={1.7}
          xChannelSelector="R"
          yChannelSelector="G"
          result="edge"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.32"
          numOctaves={2}
          seed={19}
          result="streak"
        />
        <feColorMatrix
          in="streak"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.55 1.32"
          result="density"
        />
        <feComposite in="edge" in2="density" operator="in" result="body" />
        <feMorphology in="edge" operator="erode" radius={0.7} result="inner" />
        <feComposite in="edge" in2="inner" operator="out" result="rimShape" />
        <feFlood className="sec-rim" />
        <feComposite in2="rimShape" operator="in" result="rim" />
        <feMerge>
          <feMergeNode in="body" />
          <feMergeNode in="rim" />
        </feMerge>
      </filter>
    </svg>
  );
}

// A template's {name} placeholders as nodes.
function fillNodes(text: string, nodes: Record<string, ReactNode>): ReactNode {
  return text.split(/\{(\w+)\}/).map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: a fixed split of static copy
      <Fragment key={i}>{nodes[part]}</Fragment>
    ),
  );
}
const figure = (n: number) => (
  <b className="sec-n" data-count="0">
    {n}
  </b>
);
// A path that may break after its slashes.
const breakable = (path: string) =>
  path.split("/").map((seg, i, all) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed split
    <Fragment key={i}>
      {seg}
      {i < all.length - 1 ? (
        <>
          /<wbr />
        </>
      ) : null}
    </Fragment>
  ));

export function Security({ copy, locale }: { copy: Copy["security"]; locale: Locale }) {
  const p = copy.poster;
  return (
    <Section id="security" ground="paper-band" className="sec" labelledBy="sec-h">
      <PaperBand>
        <MarkerDefs />
        <div className="wrap sec-in">
          <header className="sec-head">
            <div>
              <p className="t-kicker sec-kicker">{copy.label}</p>
              <h2 className="t-h2 sec-h" id="sec-h">
                {copy.lines.map((line, i) => (
                  <span key={line} className="sec-hl">
                    <span className="sec-hli">
                      {line}
                      {i < copy.lines.length - 1 && locale === "en" ? " " : null}
                    </span>
                  </span>
                ))}
              </h2>
            </div>
            <p className="sec-lead">{copy.body}</p>
          </header>

          <figure className="sec-poster" aria-labelledby="sec-poster-cap">
            <figcaption className="sec-poster-cap" id="sec-poster-cap">
              {p.caption}
            </figcaption>
            <p className="sr-only">{p.refusedSr}</p>
            <ul className="sec-rows">
              {REFUSED_RULES.map((r, i) => (
                <li key={r.path} className="sec-row">
                  <span className="sec-path">
                    <span className="sec-path-t">{r.path}</span>
                    <Bar chars={r.path.length} i={i} />
                  </span>
                  {i === 0 ? (
                    <span className="sec-x">
                      <span className="sec-x-row">
                        <span className="sec-x-who">{p.agent}</span>
                        <code className="sec-x-say">{`read_file("${ASKED}")`}</code>
                      </span>
                      <span className="sec-x-row">
                        <span className="sec-x-who">{p.gate}</span>
                        <code className="sec-x-say">{accessDenied(ASKED)}</code>
                        <span className="sec-caret" aria-hidden="true" />
                      </span>
                      <span className="sec-rule">
                        <code>{r.rule}</code>
                        <span>
                          {p.kinds[r.kind]} · {p.verbatim}
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span className="sec-rule">
                      <code>{r.rule}</code>
                      <span>{p.kinds[r.kind]}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </figure>

          <p className="sec-also">
            <span className="sec-also-h">{p.also}</span>{" "}
            {ALSO_REFUSED.map((name) => (
              <Fragment key={name}>
                <code>{name}</code>{" "}
              </Fragment>
            ))}
            <span className="sec-also-t">{p.alsoRest}</span>
          </p>

          <div className="sec-page">
            <div className="sec-clauses">
              {copy.props.map((prop, i) => {
                const src = CLAUSE_SOURCES[i] ?? "";
                return (
                  <article key={prop.title} className="sec-clause">
                    <h3>{prop.title}</h3>
                    <p>{prop.body}</p>
                    <p className="sec-src">
                      <span className="sr-only">{copy.source} </span>
                      <a href={`${repoUrl}/blob/main/${src}`} className="ink-link">
                        <code>{breakable(src)}</code>
                        <InkUnderline />
                      </a>
                    </p>
                  </article>
                );
              })}
            </div>
            <aside className="sec-proof">
              <p className="sec-proof-k">{copy.proof.label}</p>
              <p className="sec-proof-t">
                {fillNodes(copy.proof.text, {
                  changes: figure(measured.changes),
                  known: figure(measured.known),
                  found: figure(measured.found),
                })}
              </p>
              <p className="sec-links">
                <a className="ink-link" href={localePath(locale, "/docs/quality")}>
                  {copy.proof.link}
                  <InkUnderline />
                </a>
                <a className="ink-link" href={localePath(locale, "/docs/threat-model")}>
                  {copy.link}
                  <InkUnderline />
                </a>
              </p>
            </aside>
          </div>

          <p className="sec-foot">
            {fillNodes(copy.footnote, {
              steps: figure(MAX_AGENT_STEPS),
              tools: BUILTINS_OFF.map((t, i) => (
                <Fragment key={t}>
                  {i > 0 ? " " : null}
                  <code>{t}</code>
                </Fragment>
              )),
              n: OPENCODE_BUILTINS - BUILTINS_OFF.length,
            })}
          </p>
        </div>
      </PaperBand>
      <SecurityPlay />
    </Section>
  );
}
