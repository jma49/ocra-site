import type { CSSProperties, ReactNode } from "react";
import { LookingEyes } from "@/components/brand/eyes-mark";

// The desk's objects besides paper (07-objects.css). Each is placed by its
// caller in the px of what it lies on, and casts its shadow from the one
// light through `--lift` (0 resting, 1 held a few centimetres up).

type Place = { x: number; y: number; r?: number };
const placed = ({ x, y, r = 0 }: Place, extra?: CSSProperties): CSSProperties =>
  ({ "--x": `${x}px`, "--y": `${y}px`, "--r": `${r}deg`, ...extra }) as CSSProperties;

// The reading ruler: smoked acrylic with a printed scale, the eye row on its
// tab. It lies under the row being read (`row`, 0-based, of a sheet's
// printed rows); the eyes are alive (pupils through --px/--py, a blink on
// `.blink`).
export function Ruler({
  row,
  width,
  className,
}: {
  row: number;
  width: number;
  className?: string;
}) {
  return (
    <div
      className={["ruler", className].filter(Boolean).join(" ")}
      style={{ "--row": row, "--w": `${width}px` } as CSSProperties}
      data-row={row}
      data-depth="tool"
      aria-hidden="true"
    >
      <div className="ruler-glass" />
      <div className="ruler-scale" />
      <div className="ruler-tab">
        <LookingEyes size={46} className="ruler-eyes" />
      </div>
    </div>
  );
}

// The red pen, a crisp flat graphic: tip at the rig's origin, the barrel
// along +x. Flat tones with hard edges (light band, body, shade band), a
// steel clip with the eye row cut into it. Its shadow is two pre-blurred
// layers (tight and soft) that trade places as it lifts. The rig takes
// --pen-x, --pen-y, --pen-r (deg), --lift and --tilt (0 lying, 1 held to write).
const SILHOUETTE =
  "M0 0 L34 -6 L92 -11.5 L98 -12.5 L306 -12.5 L306 -13.5 L408 -13.5 Q420 -13.5 420 0 Q420 13.5 408 13.5 L306 13.5 L306 12.5 L98 12.5 L92 11.5 L34 6 Z";

// `narrow`: where it lies below 1024 px, where the desk is cropped tighter
// (HeroPlay moves it there; the server paints `rest`).
export function Pen({
  rest,
  narrow,
  className,
}: {
  rest: Place;
  narrow?: Place;
  className?: string;
}) {
  const style = {
    "--pen-x": `${rest.x}px`,
    "--pen-y": `${rest.y}px`,
    "--pen-r": `${rest.r ?? 0}deg`,
  } as CSSProperties;
  return (
    <div
      className={["pen-rig", className].filter(Boolean).join(" ")}
      style={style}
      data-rest={`${rest.x} ${rest.y} ${rest.r ?? 0}`}
      data-rest-narrow={narrow ? `${narrow.x} ${narrow.y} ${narrow.r ?? 0}` : undefined}
      data-depth="tool"
      aria-hidden="true"
    >
      <svg
        aria-hidden="true"
        className="pen-sh pen-sh-c"
        viewBox="-6 -20 432 40"
        width="432"
        height="40"
      >
        <path d={SILHOUETTE} />
      </svg>
      <svg
        aria-hidden="true"
        className="pen-sh pen-sh-a"
        viewBox="-6 -20 432 40"
        width="432"
        height="40"
      >
        <path d={SILHOUETTE} />
      </svg>
      <svg aria-hidden="true" className="pen" viewBox="-6 -20 432 40" width="432" height="40">
        <path className="p-steel-lo" d="M0 0 L34 -6 L34 6 Z" />
        <path className="p-steel-hi" d="M0 0 L34 -6 L34 -1.5 Z" />
        <path className="p-nib" d="M0 0 L5 -1.2 L5 1.2 Z" />
        <path className="p-grip" d="M34 -6 L92 -11.5 L92 11.5 L34 6 Z" />
        <path className="p-grip-hi" d="M34 -6 L92 -11.5 L92 -6.5 L34 -3.2 Z" />
        <rect className="p-steel" x="92" y="-12.5" width="6" height="25" />
        <rect className="p-steel-hi" x="92" y="-12.5" width="6" height="5" />
        <rect className="p-body" x="98" y="-12.5" width="208" height="25" />
        <rect className="p-body-hi" x="98" y="-9.5" width="208" height="4.5" />
        <rect className="p-body-lo" x="98" y="5.5" width="208" height="7" />
        <rect className="p-steel" x="300" y="-13.5" width="6" height="27" />
        <path
          className="p-body"
          d="M306 -13.5 L408 -13.5 Q420 -13.5 420 0 Q420 13.5 408 13.5 L306 13.5 Z"
        />
        <path className="p-body-hi" d="M306 -10.5 L410 -10.5 Q414 -9 415 -6 L306 -6 Z" />
        <path className="p-body-lo" d="M306 6 L415 6 Q414 11.5 408 13.5 L306 13.5 Z" />
        <path
          className="p-clip"
          d="M324 -6.5 Q316 -6.5 316 0 Q316 6.5 324 6.5 L414 6.8 L414 -6.8 Z"
        />
        <path className="p-clip-hi" d="M324 -6.5 L414 -6.8 L414 -4.2 L322 -3.8 Z" />
        <g className="p-eyes" transform="translate(352 -4.9) scale(0.7)">
          <path d="M0.4 4.6a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0ZM5.6 8a5 5 0 1 0 10 0a5 5 0 1 0 -10 0ZM16.4 8a5 5 0 1 0 10 0a5 5 0 1 0 -10 0ZM27.2 4.6a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z" />
        </g>
      </svg>
    </div>
  );
}

// An index card, typed: a head row (left, right), a title, a quoted line,
// a foot. `data-lift` makes it lift and tilt under the pointer.
export function Card({
  head,
  title,
  quote,
  foot,
  at,
  className,
  children,
}: {
  head: [ReactNode, ReactNode];
  title: ReactNode;
  quote?: ReactNode;
  foot?: ReactNode;
  at?: Place;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure
      className={["card", className].filter(Boolean).join(" ")}
      style={at ? placed(at) : undefined}
      data-lift=""
      data-depth="card"
    >
      <div className="sh sh-a" />
      <div className="sh sh-c" />
      <div className="card-face">
        <figcaption className="card-head">
          <span>{head[0]}</span>
          <span>{head[1]}</span>
        </figcaption>
        <p className="card-title">{title}</p>
        {quote ? <p className="card-quote">{quote}</p> : null}
        {foot ? <p className="card-foot">{foot}</p> : null}
        <div className="card-sheen" />
      </div>
      {children}
    </figure>
  );
}

// A binder clip biting the edge it sits on (`at`: the jaw's centre; or
// placed by the caller's CSS through --x, --y, --r).
export function Clip({ at, className }: { at?: Place; className?: string }) {
  return (
    <div
      className={["clip", className].filter(Boolean).join(" ")}
      style={at ? placed(at) : undefined}
      data-depth="card"
      aria-hidden="true"
    >
      <svg aria-hidden="true" viewBox="-40 -40 80 64" width="80" height="64">
        <path className="clip-sh" d="M-31 -2 L31 -2 L34 21 L-34 21 Z" />
        <path
          className="clip-wire"
          d="M-15 2 L-15 -26 Q-15 -33 -8 -33 L8 -33 Q15 -33 15 -26 L15 2"
        />
        <path className="clip-body" d="M-32 -4 L32 -4 L35 18 L-35 18 Z" />
        <path className="clip-hi" d="M-32 -4 L32 -4 L32.6 0 L-32.6 0 Z" />
      </svg>
    </div>
  );
}
