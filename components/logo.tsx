// The mascot: an aquamarine frog reading code. Original artwork; outlines are
// drawn as a thick dark stroke under the fills, so overlapping shapes merge
// into one silhouette without SVG ids (the layout renders the logo twice).
const INK = "#0c3b30";
const SKIN = "#7fffd4";

function FrogHead() {
  const shapes = (
    <>
      <ellipse cx="32" cy="39" rx="26" ry="19" />
      <circle cx="19" cy="21" r="11" />
      <circle cx="45" cy="21" r="11" />
    </>
  );
  return (
    <>
      <g fill={INK} stroke={INK} strokeWidth="5">
        {shapes}
      </g>
      <g fill={SKIN}>{shapes}</g>
      <circle cx="19" cy="21" r="7" fill="#ffffff" />
      <circle cx="45" cy="21" r="7" fill="#ffffff" />
      <circle cx="20.5" cy="23" r="3.6" fill={INK} />
      <circle cx="46.5" cy="23" r="3.6" fill={INK} />
      <circle cx="21.6" cy="21.7" r="1.2" fill="#ffffff" />
      <circle cx="47.6" cy="21.7" r="1.2" fill="#ffffff" />
      <ellipse
        cx="14"
        cy="41"
        rx="4.5"
        ry="2.6"
        fill="#ff8f8f"
        fillOpacity=".55"
      />
      <ellipse
        cx="50"
        cy="41"
        rx="4.5"
        ry="2.6"
        fill="#ff8f8f"
        fillOpacity=".55"
      />
      <path
        d="M24 41.5q8 6.5 16 0"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </>
  );
}

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <FrogHead />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="text-[1.1rem] font-semibold lowercase tracking-[-0.04em]">
        ocra
      </span>
    </span>
  );
}
