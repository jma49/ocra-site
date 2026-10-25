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
type Layout = "wide" | "narrow";
export type ObjectId =
  | "lock"
  | "docs"
  | "login"
  | "token"
  | "session"
  | "note"
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
export function posed(p: Pose): CSSProperties {
  return {
    translate: `${p.x}px ${p.y}px`,
    rotate: `${p.r ?? 0}deg`,
    scale: String(p.k ?? 1),
    opacity: p.o ?? 1,
    zIndex: p.z,
  };
}

const at = (x: number, y: number, r = 0, z?: number, o = 1, k = 1): Pose => ({ x, y, r, z, o, k });
const gone = (p: Pose, dx: number, dy: number, dr: number): Pose => ({
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

// The poses, per layout. Wide: the camera is at world scale 1 beside the
// copy. Narrow (phones): the desk is cropped, and the findings are dealt
// onto one place, so one card shows at a time.
export type Poses = Record<ObjectId, Pose>;
export function poses(layout: Layout, rows: readonly PrintRow[]) {
  const wide = layout === "wide";
  const end = CODE.y + (rowsOf(rows, 43).last + 1) * CELL.row;
  const deal = (i: number) =>
    wide
      ? at(150 + (i % 2) * 12, 56 + i * 92, [-1.2, 1.4, -0.8, 1.1][i], 41 + i)
      : at(118 + (i % 2) * 6, 170 + i * 10, [-1.2, 1.4, -0.8, 1.1][i], 41 + i);
  const s0: Poses = {
    lock: at(-6, -208, -1.4, 1),
    docs: at(8, -156, 1, 2),
    login: at(-4, -104, -0.6, 3),
    token: at(6, -52, 0.7, 4),
    session: at(0, 0, -0.5, 5),
    note: at(712, -236, 0, 6, 0),
    task: at(1020, -420, 16, 30, 0),
    bite: at(372, -60, 0, 32, 0),
    c1: gone(deal(0), 900, -140, 22),
    c2: gone(deal(1), 900, -140, 22),
    c3: gone(deal(2), 900, -140, 22),
    c4: gone(deal(3), 900, -140, 22),
    pin: at(338, end + 60, 0, 47, 0),
  };
  const s1 = { ...s0, lock: at(1180, 380, 16, 1, 1), note: { ...s0.note, o: wide ? 1 : 0 } };
  const s2 = {
    ...s1,
    docs: wide ? at(724, -150, 4, 2) : at(560, -170, 5, 2),
    login: at(-3, -4, -1.1, 3),
    token: at(3, -2, 0.6, 4),
    task: at(132, -168, -1.6, 30),
    bite: at(372, 4, 0, 32),
  };
  const s3 = { ...s2, c1: deal(0), c2: deal(1), c3: deal(2), c4: deal(3) };
  const c1 = wide ? at(110, end + 40, -1, 46) : at(70, end + 34, -1, 46);
  const s4 = {
    ...s3,
    c4: gone(deal(3), 980, 260, 18),
    c2: gone(deal(1), 980, -120, -14),
    c1,
    c3: at(c1.x + 12, c1.y + 14, -3.2, 45),
    pin: at(c1.x + 228, c1.y + 2, 0, 47),
  };
  return [s0, s1, s2, s3, s4, s4] as const satisfies readonly Poses[];
}

// What the camera frames per chapter, in world px: [x0, y0, x1, y1]; the
// fifth chapter starts on line 42 (the fourth's shot) and dollies to the
// bill. The island fits it into the stage beside the copy (never above
// scale 1).
export function shots(layout: Layout, rows: readonly PrintRow[]) {
  const l42 = CODE.y + rowsOf(rows, 42).first * CELL.row;
  type Shot = readonly [number, number, number, number];
  if (layout === "wide") {
    const desk: Shot = [-20, -250, 940, 520];
    return [
      [-20, -330, 940, 440],
      desk,
      [0, -250, 960, 520],
      [-20, 30, 940, 700],
      [-20, l42 - 330, 940, l42 + 380],
      [-20, BILL.y - 380, 940, BILL.y + 300],
    ] as const satisfies readonly Shot[];
  }
  const desk: Shot = [-14, -230, 590, 190];
  return [
    desk,
    desk,
    desk,
    [40, 30, 640, 500],
    [40, l42 - 120, 640, l42 + 360],
    [70, BILL.y - 220, 670, BILL.y + 230],
  ] as const satisfies readonly Shot[];
}

// The bill, printed at the page's foot (sheet px): the footnote, then the
// total in 48 px Maple, right-aligned at the code's right edge.
export const BILL = { x: CODE.x, y: 920, right: 640, size: 48 };
// The total's box: seven characters of Maple (0.6034 em each).
export const totalBox = (text: string) => {
  const w = text.length * 0.6034 * BILL.size;
  return { x: BILL.right - w, y: BILL.y + 112, w, h: BILL.size };
};
// Where the camera pushes into the paper (the blank foot of the page).
export const PUSH_AT = { x: 350, y: 1330 };
