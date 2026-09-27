// The mascot as voxels: a squat sitting frog, generated in code rather than
// loaded from a model file. Units are voxels; y is up and +z faces the viewer.
// The shape comes first; the face is then painted on the front-most layer
// only, so features read cleanly instead of colouring the inside.

export interface Voxel {
  x: number;
  y: number;
  z: number;
  color: number;
}

const SKIN = 0x7fffd4;
const LIMB = 0x55dcb2;
const BELLY = 0xe6fff6;
const EYE = 0xffffff;
const INK = 0x0c3b30;
const CHEEK = 0xff9c9c;

type Point = [number, number, number];

const EYES: Point[] = [
  [-3, 8, 1.5],
  [3, 8, 1.5],
];

function inEllipsoid(p: Point, c: Point, r: Point): boolean {
  const dx = (p[0] - c[0]) / r[0];
  const dy = (p[1] - c[1]) / r[1];
  const dz = (p[2] - c[2]) / r[2];
  return dx * dx + dy * dy + dz * dz <= 1;
}

function part(p: Point): "body" | "eye" | "limb" | undefined {
  const mirrored: Point = [Math.abs(p[0]), p[1], p[2]];
  if (EYES.some((eye) => inEllipsoid(p, eye, [2.3, 2.1, 2]))) return "eye";
  if (inEllipsoid(p, [0, 4, 0], [6.2, 3.9, 4.8])) return "body";
  if (
    inEllipsoid(mirrored, [3.4, 0.6, 4.2], [1.4, 0.8, 1.3]) ||
    inEllipsoid(mirrored, [5.6, 1.4, -0.8], [1.5, 1.5, 2.6]) ||
    inEllipsoid(mirrored, [6, 0.4, 1.8], [1.3, 0.6, 1.6])
  )
    return "limb";
  return undefined;
}

// The face, drawn on the front-most voxel of each column.
function paint(x: number, y: number, kind: "body" | "eye" | "limb"): number {
  if (kind === "limb") return LIMB;
  if (kind === "eye") {
    const eye = EYES.find((e) => Math.abs(x - e[0]) <= 2.5) ?? EYES[0];
    const dx = x - (eye as Point)[0];
    const dy = y - (eye as Point)[1];
    if (Math.abs(dx) <= 0.5 && dy === 0) return INK;
    if (Math.abs(dx) <= 1.5 && Math.abs(dy) <= 1) return EYE;
    return SKIN;
  }
  if (y === 4 && Math.abs(x) <= 2) return INK;
  if (y === 5 && Math.abs(x) === 3) return INK;
  if (y === 5 && Math.abs(x) >= 4 && Math.abs(x) <= 5) return CHEEK;
  if (y <= 3 && Math.abs(x) <= 3) return BELLY;
  return SKIN;
}

export function voxelFrog(): Voxel[] {
  const cells = new Map<string, "body" | "eye" | "limb">();
  const frontZ = new Map<string, number>();
  for (let y = 0; y <= 11; y++) {
    for (let x = -8; x <= 8; x++) {
      for (let z = -6; z <= 6; z++) {
        const kind = part([x, y, z]);
        if (!kind) continue;
        cells.set(`${x},${y},${z}`, kind);
        const column = `${x},${y}`;
        frontZ.set(column, Math.max(frontZ.get(column) ?? -Infinity, z));
      }
    }
  }
  const voxels: Voxel[] = [];
  for (const [key, kind] of cells) {
    const [x, y, z] = key.split(",").map(Number) as Point;
    const front = frontZ.get(`${x},${y}`) === z;
    const base = front ? paint(x, y, kind) : kind === "limb" ? LIMB : SKIN;
    voxels.push({ x, y, z, color: vary(base, jitter(x, y, z)) });
  }
  return voxels;
}

// Deterministic per-voxel variation, so the skin reads as voxels without
// changing between renders.
function jitter(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

// Nudges a colour's brightness by up to ±5%, except the face's ink and whites.
function vary(color: number, shade: number): number {
  if (color === INK || color === EYE) return color;
  const factor = 0.95 + shade * 0.1;
  const r = Math.min(255, Math.round(((color >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.round(((color >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.round((color & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}
