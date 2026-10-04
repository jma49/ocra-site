// Corner orb webs for the dark sections, generated once at build time.
// A real orb: a hub off the corner, radials that end on the two walls or on
// an outer frame, a capture spiral of sagging segments with a free zone
// around the hub, a few drops of dew and one broken strand. Seeded, so the
// server and the client draw the same web.

export type Corner = "tl" | "tr" | "bl" | "br";

export interface Web {
  size: number;
  corner: Corner;
  hub: [number, number];
  frame: string;
  radials: string;
  hubMesh: string;
  spiral: string;
  loose: string;
  dew: { x: number; y: number; r: number; pink: boolean }[];
}

// mulberry32: small, fast, good enough for a drawing.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (v: number) => v.toFixed(1);

export function orbWeb(
  size: number,
  corner: Corner,
  seed: number,
  hubAt: [number, number],
  count: number,
): Web {
  const rand = rng(seed);
  const between = (lo: number, hi: number) => lo + rand() * (hi - lo);
  const hx = size * hubAt[0];
  const hy = size * hubAt[1];
  // The web is drawn for the top-left corner; other corners mirror it.
  const radials = Array.from({ length: count }, (_, i) => {
    const angle = ((i + between(-0.28, 0.28)) * 2 * Math.PI) / count;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const reach = between(0.74, 0.92) * size;
    let length = reach;
    if (dx < 0) length = Math.min(length, hx / -dx);
    if (dy < 0) length = Math.min(length, hy / -dy);
    return { angle, length, wall: length < reach };
  }).sort((a, b) => a.angle - b.angle);
  const at = (i: number, r: number): [number, number] => [
    hx + r * Math.cos(radials[i].angle),
    hy + r * Math.sin(radials[i].angle),
  ];

  let frame = "";
  const free = radials.flatMap((r, i) => (r.wall ? [] : [i]));
  for (let k = 0; k < free.length - 1; k++) {
    const i = free[k];
    const j = free[k + 1];
    if (j - i > 3) continue;
    const [x1, y1] = at(i, radials[i].length);
    const [x2, y2] = at(j, radials[j].length);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    frame += `M${f(x1)} ${f(y1)}Q${f(mx + (hx - mx) * 0.06)} ${f(my + (hy - my) * 0.06)} ${f(x2)} ${f(y2)}`;
  }

  const radialPath = radials
    .map((r, i) => {
      const [x, y] = at(i, r.length);
      return `M${f(hx)} ${f(hy)}L${f(x)} ${f(y)}`;
    })
    .join("");

  let hubMesh = "";
  for (let turn = 0, r = 4; turn < 3; turn++, r += 5) {
    for (let i = 0; i <= count; i++) {
      const [x, y] = at(i % count, r + between(-0.8, 0.8));
      hubMesh += `${i ? "L" : "M"}${f(x)} ${f(y)}`;
    }
  }

  let spiral = "";
  const dew: Web["dew"] = [];
  let r = 30;
  let step = 10.5;
  let prev: [number, number] | null = null;
  while (r < size * 0.95) {
    for (let i = 0; i < count; i++) {
      const rr = r + between(-1.2, 1.2);
      r += step / count;
      const [x, y] = at(i, rr);
      if (rr > radials[i].length * 0.96 || x < 1 || y < 1) {
        prev = null;
        continue;
      }
      if (!prev) spiral += `M${f(x)} ${f(y)}`;
      else {
        const mx = (prev[0] + x) / 2;
        const my = (prev[1] + y) / 2;
        const sag = 0.05 + rand() * 0.05;
        spiral += `Q${f(mx + (hx - mx) * sag)} ${f(my + (hy - my) * sag)} ${f(x)} ${f(y)}`;
        if (rand() < 0.03) {
          dew.push({
            x: mx + (hx - mx) * sag * 0.5,
            y: my + (hy - my) * sag * 0.5,
            r: [1.2, 1.5, 1.9][Math.floor(rand() * 3)],
            pink: rand() < 0.3,
          });
        }
      }
      prev = [x, y];
    }
    step = Math.min(step * 1.07, 24);
  }

  const broken = Math.floor(rand() * count);
  const [lx, ly] = at(broken, radials[broken].length * 0.55);
  const loose = `M${f(lx)} ${f(ly)}q10 14 -4 26`;

  return {
    size,
    corner,
    hub: [hx, hy],
    frame,
    radials: radialPath,
    hubMesh,
    spiral,
    loose,
    dew,
  };
}

// Four different webs, so no two corners mirror each other.
export const heroWebs = [
  orbWeb(500, "tl", 11, [0.36, 0.22], 23),
  orbWeb(300, "tr", 12, [0.2, 0.38], 17),
];
export const finalWebs = [
  orbWeb(340, "bl", 13, [0.26, 0.3], 19),
  orbWeb(520, "br", 14, [0.4, 0.2], 24),
];
