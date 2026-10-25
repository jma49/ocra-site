import type { CSSProperties } from "react";
import { type InkMark, strokeMs } from "@/lib/landing/ink/marks";

// The ink: one filter for every pen mark on the page (A's ink engine).
// fibre: the edge torn by the paper's fibre; halo: a soft bleed into the
// paper; density: the ink's uneven load along the stroke; rim: where it
// pools darker at the edge. Colours come from CSS (08-ink.css). Rendered
// once per page, before the first mark.
export function InkDefs() {
  return (
    <svg className="ink-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id="ink"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={4}
            result="fibre"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fibre"
            scale={1.9}
            xChannelSelector="R"
            yChannelSelector="G"
            result="edge"
          />
          <feGaussianBlur in="edge" stdDeviation={0.9} result="soft" />
          <feComponentTransfer in="soft" result="halo">
            <feFuncA type="linear" slope={0.32} />
          </feComponentTransfer>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.11"
            numOctaves={3}
            seed={11}
            result="blot"
          />
          <feColorMatrix
            in="blot"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.26"
            result="density"
          />
          <feComposite in="edge" in2="density" operator="in" result="body" />
          <feMorphology in="edge" operator="erode" radius={0.9} result="inner" />
          <feComposite in="edge" in2="inner" operator="out" result="rimShape" />
          <feFlood className="ink-rim" />
          <feComposite in2="rimShape" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="body" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* The bleed: the ink creeping into the fibre once the nib has passed. */}
        <filter id="ink-bleed" x="-20%" y="-30%" width="140%" height="160%">
          <feMorphology operator="dilate" radius={0.7} />
          <feGaussianBlur stdDeviation={1.1} />
          <feComponentTransfer>
            <feFuncA type="linear" slope={0.28} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

export type NamedMark = { name: string; mark: InkMark };

// When each stroke starts and how long it draws, for marks drawn in order
// with `gap` ms between strokes (the pen lifting and travelling).
export function inkTimes(marks: readonly NamedMark[], { gap = 110, pace = 0.55, start = 0 } = {}) {
  let t = start;
  return marks.map(({ mark }) =>
    mark.strokes.map((s) => {
      const at = { delay: Math.round(t), duration: Math.round(strokeMs(s, pace)) };
      t += at.duration + gap;
      return at;
    }),
  );
}

// A layer of ink over its host, in the host's px (width × height). Each
// stroke is its outline (the ink, through the filter) revealed by its
// centreline (the mask): drawing a stroke is moving that centreline's dash,
// which the pen's tip follows. Server-rendered drawn; 08-ink.css holds the
// undrawn state before play. `data-ink="once"` draws the layer's strokes in
// order the first time it is 45 % in view (motion.tsx adds `.on`); a pen
// timeline (the hero) draws them itself and leaves `data-ink` off.
export function InkLayer({
  id,
  width,
  height,
  marks,
  once = false,
  gap,
  pace,
  className,
  style,
}: {
  id: string;
  width: number;
  height: number;
  marks: readonly NamedMark[];
  once?: boolean;
  gap?: number;
  pace?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const times = inkTimes(marks, { gap, pace });
  return (
    <svg
      className={["ink-layer", className].filter(Boolean).join(" ")}
      data-ink={once ? "once" : undefined}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {marks.map(({ name, mark }, m) => (
        <g key={name} className="ink-m" data-mark={name}>
          {mark.strokes.map((s, i) => {
            const mid = `${id}-${name}-${i}`;
            const at = times[m]?.[i] ?? { delay: 0, duration: 0 };
            return (
              <g
                // biome-ignore lint/suspicious/noArrayIndexKey: a mark's strokes are fixed
                key={i}
                className="ink-s"
                style={{ "--d": `${at.delay}ms`, "--t": `${at.duration}ms` } as CSSProperties}
              >
                <mask id={mid} maskUnits="userSpaceOnUse">
                  <path
                    className="ink-run"
                    d={s.centre}
                    pathLength={1}
                    strokeWidth={s.width * 2.6 + 4}
                  />
                </mask>
                <path
                  className="ink-bleed"
                  d={s.outline}
                  filter="url(#ink-bleed)"
                  mask={`url(#${mid})`}
                />
                <path className="ink-body" d={s.outline} filter="url(#ink)" mask={`url(#${mid})`} />
                <path className="ink-shine" d={s.centre} />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}
