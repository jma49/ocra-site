import type { CSSProperties } from "react";
import { CELL, type PrintRow } from "@/components/landing/desk/sheet";

// The story's desk as data, shared by the server (which paints the last
// chapter) and the island (which plays each chapter and settles to any
// one). Everything is in the world's px: the session page's top-left corner
// is the origin, its code starts at CODE, the other printouts are stacked
// behind it with their heads showing. Each object has one pose per chapter
// (0 is before the first), so jumping or scrolling back settles at once.

export const SHEET_W = 690;
export const SESSION_H = 1500;
export const STACK_H = 940;
export const COLS = 54;
export const CODE = { x: 44 + 5 * CELL.ch, y: 78 };
export const FIRST_LINE = 27;

export type Pose = { x: number; y: number; r?: number; o?: number; k?: number; z?: number };
export type Layout = "wide" | "narrow";
export type ObjectId =
  | "lock"
  | "docs"
  | "login"
  | "token"
  | "session"
  | "task"
  | "bite"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "pin";
export const CARDS = ["c1", "c2", "c3", "c4"] as const;

// A pose as inline style: the individual transform properties compose with
// each primitive's own transform (its hover tilt), and never touch layout.
// An object off the desk is not drawn at all.
export function posed(p: Pose): CSSProperties {
  return {
    translate: `${p.x}px ${p.y}px`,
    rotate: `${p.r ?? 0}deg`,
    scale: String(p.k ?? 1),
    opacity: p.o ?? 1,
    visibility: p.o === 0 ? "hidden" : undefined,
    zIndex: p.z,
  };
}

const at = (x: number, y: number, r = 0, z?: number, o = 1, k = 1): Pose => ({ x, y, r, z, o, k });
const off = (p: Pose, dx: number, dy: number, dr: number): Pose => ({
  ...p,
  x: p.x + dx,
  y: p.y + dy,
  r: (p.r ?? 0) + dr,
  o: 0,
});

// Where line `n` sits on the session page: its first and last printed rows.
export function rowsOf(rows: readonly PrintRow[], n: number) {
  const first = rows.findIndex((r) => r.n === n);
  let last = first;
  while (rows[last + 1]?.n === n) last++;
  return { first, last };
}

// The survivor's size once the others are gone: it is the one card left,
// so it is read larger (its 16 px type at about 17).
const GROW = 1.08;
// A card holder's box (31-figures.css) and the point its scale is about.
const CARD = { w: 520, h: 178, ox: 260, oy: 71.2 };
// Where a point of a card (in its unscaled px) lands once it is scaled.
const onCard = (c: Pose, px: number, py: number) => ({
  x: c.x + CARD.ox + (px - CARD.ox) * (c.k ?? 1),
  y: c.y + CARD.oy + (py - CARD.oy) * (c.k ?? 1),
});

// The poses, per layout. Wide: the camera is near world scale 1 beside the
// copy. Narrow (phones): the desk is cropped to one thing at a time; the
// set-aside file comes forward over the stack instead of beside it.
export type Poses = Record<ObjectId, Pose>;
export function poses(layout: Layout, rows: readonly PrintRow[]) {
  const wide = layout === "wide";
  const end = CODE.y + (rowsOf(rows, 43).last + 1) * CELL.row;
  // The finding's place: under line 43, so line 42 and its ink stay clear.
  const spot = wide ? at(96, end + 22, -1, 46) : at(70, end + 22, -1, 46);
  // A candidate being judged lies on the survivor's lower half, on top.
  const judged = (r: number, z: number) => at(spot.x + 30, spot.y + 52, r, z);
  const s0: Poses = {
    lock: at(-6, -208, -1.4, 1),
    docs: at(8, -156, 1, 2),
    login: at(-4, -104, -0.6, 3),
    token: at(6, -52, 0.7, 4),
    session: at(0, 0, -0.5, 5),
    task: at(1020, -420, 16, 30, 0),
    bite: at(372, -60, 0, 32, 0),
    c1: off(spot, 900, -160, 22),
    c2: off(judged(1.4, 48), 900, -160, 22),
    c3: off(judged(-0.8, 48), 900, -160, 22),
    c4: off(judged(1.1, 49), 900, -160, 22),
    pin: at(spot.x + 228, spot.y - 40, 0, 47, 0),
  };
  // The generated file is drawn out and struck: beside the stack (wide),
  // in front of its lower half (narrow, the other heads still showing),
  // its blank page under the pen.
  const s1 = { ...s0, lock: wide ? at(700, -250, 2.2, 8) : at(40, 150, 1.6, 8) };
  const s2 = {
    ...s1,
    lock: off(s1.lock, 520, 420, 14),
    docs: wide ? at(724, -150, 4, 2) : at(520, -170, 5, 2),
    login: at(-3, -4, -1.1, 3),
    token: at(3, -2, 0.6, 4),
    task: at(132, -168, -1.6, 30),
    bite: at(372, 4, 0, 32),
  };
  // Reading starts: the docs bundle is put away, one page stays in view.
  const s3 = { ...s2, docs: off(s2.docs, 360, 60, 6), c1: spot };
  const c1 = { ...spot, k: GROW };
  const jaw = onCard(c1, 228, 2);
  const s4 = {
    ...s3,
    c1,
    c2: off(judged(1.4, 48), 940, -120, -14),
    c3: { ...at(spot.x + 12, spot.y + 14, -3.2, 45), k: GROW },
    c4: off(judged(1.1, 49), 940, 220, 18),
    pin: at(jaw.x, jaw.y, 0, 47),
  };
  return { poses: [s0, s1, s2, s3, s4, s4] as const satisfies readonly Poses[], judged, spot };
}

// What the camera frames per chapter, in world px: [x0, y0, x1, y1]. The
// island fits each into the stage beside the copy (never above scale 1).
// Wide, chapter 0 frames the stack in the lower right, under the head.
export function shots(layout: Layout, rows: readonly PrintRow[]) {
  const l42 = CODE.y + rowsOf(rows, 42).first * CELL.row;
  type Shot = readonly [number, number, number, number];
  if (layout === "wide")
    return [
      [-20, -240, 720, 300],
      [30, -330, 980, 440],
      [-10, -250, 940, 520],
      [-10, 70, 940, 820],
      [-10, l42 - 250, 940, l42 + 450],
      [-10, l42 - 110, 940, BILL.y + 250],
    ] as const satisfies readonly Shot[];
  return [
    [-10, -240, 560, 310],
    [-10, -240, 560, 310],
    [100, -200, 640, 60],
    [30, l42 - 216, 600, l42 + 264],
    [30, l42 - 130, 600, l42 + 350],
    [60, l42 - 30, 660, BILL.y + 224],
  ] as const satisfies readonly Shot[];
}

// Where the pen lies between its acts, never across print: on the struck
// file's blank page, on the desk beside the cards, under the bill.
export function pens(layout: Layout) {
  const wide = layout === "wide";
  return {
    away: wide ? { x: 1320, y: -60, r: 40 } : { x: 900, y: -60, r: 40 },
    struck: wide ? { x: 852, y: 30, r: 76 } : { x: 190, y: 262, r: 6 },
    cards: wide ? { x: 760, y: 700, r: 78 } : { x: 900, y: 700, r: 40 },
    rest: wide ? { x: 118, y: BILL.y + 232, r: -4 } : { x: 118, y: BILL.y + 202, r: -2 },
  };
}

// The scroll, as fractions of the pinned run (its length in screens sits in
// 30-how.css; 0 is the stage reaching the top): where each chapter starts,
// and the push into the paper.
export const TIMING = {
  wide: { at: [0.09, 0.24, 0.39, 0.545, 0.7], push: [0.85, 1] },
  // Phones have no head over the stage: the first chapter plays as the
  // stage comes up, so its copy is never an empty screen of desk.
  narrow: { at: [-0.1, 0.18, 0.35, 0.52, 0.69], push: [0.85, 1] },
} as const;

// The bill, printed at the page's foot (sheet px): the footnote, then the
// total in 48 px Maple, right-aligned at the code's right edge.
export const BILL = { x: CODE.x, y: 860, right: 640, size: 48 };
// The total's box: seven characters of Maple (0.6034 em each).
export const totalBox = (text: string) => {
  const w = text.length * 0.6034 * BILL.size;
  return { x: BILL.right - w, y: BILL.y + 112, w, h: BILL.size };
};
// Where the camera pushes into the paper (the blank foot of the page).
export const PUSH_AT = { x: 350, y: 1290 };
