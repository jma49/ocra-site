// Draws public/hero-field.svg, the pixel field behind the landing hero: three
// minimap panes of code that dissolve into scattered pixels, with one
// reviewed hunk and, in it, the line a finding points at. Seeded, so the
// output only changes when this script does. Run: node scripts/hero-field.mjs
import { writeFileSync } from "node:fs";

const W = 1440;
const H = 836;
const CELL = 8;
const SQ = 6;
const COLS = W / CELL;
const ROWS = Math.ceil(H / CELL);

const GRAYS = ["#181f1d", "#242d2a", "#37423e", "#54615c", "#788680"];
const HUNK = ["#163a31", "#215c4d", "#308c73"];
const FROG = "#7fffd4";

const PANES = [
  { start: 2, width: 56 },
  { start: 62, width: 56 },
  { start: 122, width: 56 },
];
const HUNK_PANE = 1;
const HUNK_ROWS = { from: 30, to: 44 };
const FINDING_ROW = 38;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(42);
const between = (lo, hi) => lo + Math.floor(random() * (hi - lo + 1));
const smooth = (t) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};
const blob = (x, y, cx, cy, rx, ry) =>
  Math.exp(-(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) * 1.6);

// Dense across the top, clear in the lower left (the headline) and the
// lower right (the call to action).
function density(c, r) {
  const x = c / COLS;
  const y = r / ROWS;
  let d =
    0.95 * blob(x, y, 0.3, 0.2, 0.34, 0.26) +
    0.9 * blob(x, y, 0.7, 0.32, 0.36, 0.3) +
    0.55 * blob(x, y, 0.95, 0.12, 0.22, 0.2) +
    0.35 * blob(x, y, 0.05, 0.45, 0.14, 0.22) +
    0.12 * Math.sin(c * 0.11 + r * 0.05) +
    0.08 * Math.sin(r * 0.21 - c * 0.04);
  d *= 1 - 0.95 * smooth((y - 0.52) / 0.3) * smooth((0.62 - x) / 0.25);
  d *= 1 - 0.97 * smooth((y - 0.56) / 0.16) * smooth((x - 0.6) / 0.08);
  return Math.max(0, Math.min(1, d));
}

// One line of code as cells: an indent, then words separated by one cell.
function codeLine(width, depth, force) {
  const cells = new Array(width).fill(false);
  if (!force && random() < 0.12) return cells;
  const indent = Math.min(depth * 2, Math.floor(width / 3));
  const length = force
    ? between(28, 40)
    : between(6, Math.max(8, width - indent - 4));
  const end = Math.min(width, indent + length);
  for (let i = indent; i < end; ) {
    const word = between(2, 9);
    for (let k = i; k < Math.min(end, i + word); k++) cells[k] = true;
    i += word + 1;
  }
  return cells;
}

const byColor = new Map();
function square(c, r, color) {
  const list = byColor.get(color) ?? [];
  list.push(`M${c * CELL} ${r * CELL}h${SQ}v${SQ}h-${SQ}z`);
  byColor.set(color, list);
}

PANES.forEach(({ start, width }, p) => {
  let depth = 0;
  for (let r = 0; r < ROWS; r++) {
    depth = Math.max(
      0,
      Math.min(5, depth + [-1, 0, 0, 0, 1, 1][between(0, 5)]),
    );
    const inHunk = p === HUNK_PANE && r >= HUNK_ROWS.from && r <= HUNK_ROWS.to;
    const finding = p === HUNK_PANE && r === FINDING_ROW;
    const cells = codeLine(width, finding ? 2 : depth, finding);
    cells.forEach((on, k) => {
      const c = start + k;
      const d = inHunk ? Math.max(density(c, r), 0.85) : density(c, r);
      if (on) {
        if (random() > d * 1.15) return;
        if (finding) square(c, r, FROG);
        else if (inHunk) square(c, r, HUNK[Math.min(2, Math.floor(d * 3))]);
        else
          square(
            c,
            r,
            GRAYS[Math.min(4, Math.floor(d * 4.6 + random() * 0.8))],
          );
      } else if (random() < d * 0.05) {
        square(c, r, GRAYS[0]);
      }
    });
    if (inHunk) square(start - 2, r, finding ? FROG : HUNK[1]);
  }
});

const groups = [...byColor]
  .map(([color, paths]) => `<path fill="${color}" d="${paths.join("")}"/>`)
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges" aria-hidden="true">${groups}</svg>\n`;
writeFileSync(new URL("../public/hero-field.svg", import.meta.url), svg);
console.log(`hero-field.svg: ${svg.length} bytes`);
