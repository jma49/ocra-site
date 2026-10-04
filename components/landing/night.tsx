import type { CSSProperties } from "react";
import { finalWebs, heroWebs, type Web } from "@/lib/landing/webs";

// The ink night behind the hero and the final call to action: two halftone
// screens printed off register, quiet in the middle where the text sits,
// with an orb web in two of the corners.
export function Night({ variant }: { variant: "hero" | "final" }) {
  const id = `night-${variant}`;
  const webs = variant === "hero" ? heroWebs : finalWebs;
  return (
    <div className={`night night-${variant}`} aria-hidden="true">
      <svg
        aria-hidden="true"
        className="night-dots"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
      >
        <defs>
          <pattern
            id={`${id}-p`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <circle cx="7" cy="7" r="2.4" style={{ fill: "var(--pink)" }} />
          </pattern>
          <pattern
            id={`${id}-a`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30) translate(4 3)"
          >
            <circle cx="7" cy="7" r="2" style={{ fill: "var(--aqua)" }} />
          </pattern>
          <radialGradient id={`${id}-g`} cx="0.5" cy={variant === "hero" ? "0.32" : "0.4"} r="0.75">
            <stop offset="0" style={{ stopColor: "var(--white)" }} stopOpacity=".06" />
            <stop offset=".55" style={{ stopColor: "var(--white)" }} stopOpacity=".18" />
            <stop offset="1" style={{ stopColor: "var(--white)" }} stopOpacity=".6" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect width="1440" height="900" fill={`url(#${id}-g)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-m)`}>
          <rect width="1440" height="900" fill={`url(#${id}-p)`} opacity=".5" />
          <rect width="1440" height="900" fill={`url(#${id}-a)`} opacity=".65" />
        </g>
      </svg>
      {webs.map((web) => (
        <CornerWeb key={web.corner} web={web} />
      ))}
    </div>
  );
}

function CornerWeb({ web }: { web: Web }) {
  const { size, corner, hub } = web;
  const flipX = corner === "tr" || corner === "br";
  const flipY = corner === "bl" || corner === "br";
  const gx = flipX ? size - hub[0] : hub[0];
  const gy = flipY ? size - hub[1] : hub[1];
  const mask = `web-${corner}`;
  return (
    <svg
      className={`web-box web-${corner}`}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ "--s": `${size}px` } as CSSProperties}
    >
      <defs>
        <radialGradient
          id={`${mask}-g`}
          gradientUnits="userSpaceOnUse"
          cx={gx}
          cy={gy}
          r={size * 0.95}
        >
          <stop offset="0" style={{ stopColor: "var(--white)" }} />
          <stop offset=".55" style={{ stopColor: "var(--white)" }} stopOpacity=".85" />
          <stop offset="1" style={{ stopColor: "var(--white)" }} stopOpacity="0" />
        </radialGradient>
        <mask id={mask}>
          <rect width={size} height={size} fill={`url(#${mask}-g)`} />
        </mask>
      </defs>
      <g className="web" mask={`url(#${mask})`} style={{ transformOrigin: `${gx}px ${gy}px` }}>
        <g
          transform={`translate(${flipX ? size : 0} ${flipY ? size : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`}
        >
          <path d={web.frame} className="w-frame" />
          <path d={web.radials} className="w-radial" />
          <path d={web.hubMesh} className="w-hub" />
          <path d={web.spiral} className="w-spiral" />
          <path d={web.loose} className="w-loose" />
          {web.dew.map((d) => (
            <circle
              key={`${d.x.toFixed(1)}-${d.y.toFixed(1)}`}
              cx={d.x}
              cy={d.y}
              r={d.r}
              className={d.pink ? "w-dew pink" : "w-dew"}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
