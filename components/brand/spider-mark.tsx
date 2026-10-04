import { useId } from "react";

// The mark: an original jumping spider, front view, printed slightly off
// register. Geometry is on a 64 grid; the ghosts and the glitch slice drop
// out at small sizes, where only the ink silhouette and the eyes read.
// Colours are tokens (app/tokens.css), set through style: SVG presentation
// attributes do not resolve var().
const AQUA = "var(--aqua)";
const PINK = "var(--pink)";
const INK = "var(--night)";
const INK_ON_DARK = "var(--spider-on-dark)";
const WHITE = "var(--white)";
const BLACK = "var(--black)";

type Point = [number, number];

// One leg on the left side: hip, knee, tip. The right side mirrors it.
const LEGS: [Point, Point, Point][] = [
  [
    [25, 22.5],
    [17, 11],
    [19.5, 2.5],
  ],
  [
    [22.5, 27],
    [9, 21],
    [2.5, 15.5],
  ],
  [
    [22.5, 31],
    [8, 34.5],
    [2.5, 41.5],
  ],
  [
    [25, 35.5],
    [14.5, 45.5],
    [11, 57],
  ],
];

const mirror = ([x, y]: Point): Point => [64 - x, y];

// The silhouette is drawn once per mark, in currentColor, and placed with
// <use> for the ink, the two colour plates and the glitch slice.
function SilhouetteDef({ id }: { id: string }) {
  return (
    <g id={id} fill="currentColor" stroke="currentColor">
      {LEGS.flatMap((leg, i) =>
        [leg, leg.map(mirror) as typeof leg].map(([hip, knee, tip], side) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed geometry
          <g key={`${i}-${side}`} fill="none" strokeLinecap="round">
            <path
              d={`M${hip.join(" ")} L${knee.join(" ")}`}
              strokeWidth={i ? 4.4 : 6}
            />
            <path
              d={`M${knee.join(" ")} L${tip.join(" ")}`}
              strokeWidth={i ? 2.8 : 4}
            />
          </g>
        )),
      )}
      <g stroke="none">
        <ellipse cx="32" cy="45.5" rx="11" ry="12.5" />
        <path d="M27 35.5 Q32 38 37 35.5 L36 33 L28 33 Z" />
        <circle cx="32" cy="26.5" r="11" />
      </g>
    </g>
  );
}

function Details({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern
          id={`${id}d`}
          width="2.6"
          height="2.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <circle cx="1.3" cy="1.3" r="0.62" style={{ fill: AQUA }} />
        </pattern>
        <radialGradient id={`${id}g`} cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" style={{ stopColor: WHITE }} />
          <stop offset="1" style={{ stopColor: WHITE }} stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}k`}>
          <ellipse cx="32" cy="45.5" rx="11" ry="12.5" fill={`url(#${id}g)`} />
        </mask>
      </defs>
      <ellipse
        cx="32"
        cy="45.5"
        rx="11"
        ry="12.5"
        fill={`url(#${id}d)`}
        mask={`url(#${id}k)`}
      />
      <circle cx="27" cy="25.5" r="4.7" style={{ fill: AQUA }} />
      <circle cx="37" cy="25.5" r="4.7" style={{ fill: AQUA }} />
      <circle cx="25.6" cy="23.8" r="1.3" style={{ fill: WHITE }} />
      <circle cx="35.6" cy="23.8" r="1.3" style={{ fill: WHITE }} />
      <circle cx="21.4" cy="20.2" r="1.45" style={{ fill: AQUA }} />
      <circle cx="42.6" cy="20.2" r="1.45" style={{ fill: AQUA }} />
    </>
  );
}

export function SpiderMark({
  size,
  dark = false,
  glitch = 2,
  slice = true,
  animated = false,
  className,
  label,
}: {
  size: number;
  // On a dark ground the body lifts slightly so the silhouette reads.
  dark?: boolean;
  // Offset of the aquamarine and pink plates; 0 prints one ink only.
  glitch?: number;
  slice?: boolean;
  // Adds the classes the glitch keyframes in app/landing/11-spider.css target.
  animated?: boolean;
  className?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  const ink = dark ? INK_ON_DARK : INK;
  const cls = (name: string) => (animated ? name : undefined);
  const Silhouette = ({ fill }: { fill: string }) => (
    <use href={`#${id}s`} style={{ color: fill }} />
  );
  const main = (
    <>
      <Silhouette fill={ink} />
      <Details id={id} />
    </>
  );
  return (
    <svg
      viewBox="-4 -4 72 72"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible", display: "block", flex: "none" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <SilhouetteDef id={`${id}s`} />
      </defs>
      {glitch > 0 && (
        <>
          <g transform={`translate(${glitch} ${glitch * 0.55})`}>
            <g className={cls("ghost-p")}>
              <Silhouette fill={PINK} />
            </g>
          </g>
          <g transform={`translate(${-glitch} ${-glitch * 0.55})`}>
            <g className={cls("ghost-a")}>
              <Silhouette fill={AQUA} />
            </g>
          </g>
        </>
      )}
      {slice && glitch > 0 ? (
        <>
          <defs>
            <mask id={`${id}m`}>
              <rect
                x="-10"
                y="-10"
                width="84"
                height="84"
                style={{ fill: WHITE }}
              />
              <rect
                x="-10"
                y="29.6"
                width="84"
                height="4.2"
                style={{ fill: BLACK }}
              />
            </mask>
            <clipPath id={`${id}c`}>
              <rect x="-10" y="29.6" width="84" height="4.2" />
            </clipPath>
          </defs>
          <g mask={`url(#${id}m)`}>{main}</g>
          <g clipPath={`url(#${id}c)`}>
            <g className={cls("slice")}>
              <g transform="translate(4 0)">
                <g transform={`translate(${glitch * 1.4} 0)`}>
                  <Silhouette fill={PINK} />
                </g>
                <Silhouette fill={ink} />
              </g>
            </g>
          </g>
        </>
      ) : (
        main
      )}
    </svg>
  );
}

// Size steps for small uses: the ghosts thin out, then drop, as the mark shrinks.
export function SmallSpider({
  size,
  dark,
  className,
}: {
  size: number;
  dark?: boolean;
  className?: string;
}) {
  const glitch = size >= 32 ? 2 : size >= 24 ? 1.4 : 0;
  return (
    <SpiderMark
      size={size}
      dark={dark}
      glitch={glitch}
      slice={size >= 32}
      className={className}
    />
  );
}
