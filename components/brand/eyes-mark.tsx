// The mark: the front eye row of a jumping spider, two large eyes between
// two small ones. A jumping spider looks before it moves; ocra reads before
// it comments. One path, drawn in currentColor, with the glints cut out
// (even-odd fill), so it needs no ids and takes any colour from CSS.
const n = (x: number) => Number(x.toFixed(2));
const circle = (cx: number, cy: number, r: number) =>
  `M${n(cx - r)} ${n(cy)}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0Z`;

const BIG = 5;
const SMALL = 2.2;
const GLINT = 1.45;

const EYES_PATH = [
  circle(2.6, 4.6, SMALL),
  circle(10.6, 8, BIG),
  circle(10.6 - 1.7, 8 - 1.8, GLINT),
  circle(21.4, 8, BIG),
  circle(21.4 - 1.7, 8 - 1.8, GLINT),
  circle(29.4, 4.6, SMALL),
].join("");

const EYES_VIEWBOX = "0 0 32 14";

export function EyesMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 14) / 32}
      viewBox={EYES_VIEWBOX}
      aria-hidden="true"
    >
      <path d={EYES_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
