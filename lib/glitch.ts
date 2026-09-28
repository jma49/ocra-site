// Pixel glitch for the wordmark band: the pointer drags horizontal slices of
// the letters along its path, stretching their trailing edge into streaks;
// some slices pixelate or darken, then all settle back. Pressing drags
// harder. A canvas over the static SVG draws only the disturbed slices, so
// the page looks the same without JavaScript, and nothing runs while
// nothing moves.

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  born: number;
  life: number;
  kind: "smear" | "shift" | "pixel" | "tint";
  pixel: number;
}

interface Surface {
  width: number;
  height: number;
  dpr: number;
  unit: number;
  paper: string;
  ink: string;
  source: HTMLCanvasElement;
}

const HEIGHTS = [4, 8, 8, 12, 16, 16, 24, 32, 48];
const PIXELS = [6, 8, 12, 16];
const MAX_BLOCKS = 160;
const SPAWN_EVERY_MS = 16;

const pick = <T>(list: readonly T[]): T =>
  list[Math.floor(Math.random() * list.length)] as T;

// Paints the band and its letters, at device resolution, as the slices'
// source image.
function paint(
  band: HTMLElement,
  art: SVGSVGElement,
  canvas: HTMLCanvasElement,
): Surface | null {
  const box = band.getBoundingClientRect();
  const letters = art.getBoundingClientRect();
  const viewBox = art.viewBox.baseVal;
  if (!box.width || !box.height || !viewBox?.width) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(box.width * dpr);
  const height = Math.round(box.height * dpr);
  canvas.width = width;
  canvas.height = height;
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  const paper = getComputedStyle(band).backgroundColor;
  const ink = getComputedStyle(art).color;
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);
  const scale = (letters.width / viewBox.width) * dpr;
  ctx.setTransform(
    scale,
    0,
    0,
    scale,
    (letters.left - box.left) * dpr,
    (letters.top - box.top) * dpr,
  );
  ctx.fillStyle = ink;
  for (const path of art.querySelectorAll("path")) {
    ctx.fill(new Path2D(path.getAttribute("d") ?? ""));
  }
  const unit = (box.width / 1440) * dpr;
  return { width, height, dpr, unit, paper, ink, source };
}

export function attachGlitch(
  band: HTMLElement,
  canvas: HTMLCanvasElement,
  art: SVGSVGElement,
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx || typeof Path2D === "undefined") return () => {};
  const scratch = document.createElement("canvas");
  let surface: Surface | null = null;
  let blocks: Block[] = [];
  let frame = 0;
  let pressed = false;
  let last: { x: number; y: number; t: number } | null = null;
  let lastSpawn = 0;

  const locate = (event: PointerEvent) => {
    const box = band.getBoundingClientRect();
    const dpr = surface?.dpr ?? 1;
    return {
      x: (event.clientX - box.left) * dpr,
      y: (event.clientY - box.top) * dpr,
      t: performance.now(),
    };
  };

  const spawn = (
    s: Surface,
    x: number,
    y: number,
    vx: number,
    power: number,
  ) => {
    const speed = Math.min(power, 3);
    const count = Math.min(8, 2 + Math.round(speed * 2)) + (pressed ? 4 : 0);
    const boost = pressed ? 2.2 : 1;
    const along = vx >= 0 ? 1 : -1;
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const h = Math.max(
        2,
        Math.round(pick(HEIGHTS) * s.unit * (pressed ? 1.5 : 1)),
      );
      const w = Math.round(
        (40 + Math.random() * (pressed ? 420 : 260)) * s.unit,
      );
      const direction = Math.random() < 0.85 ? along : -along;
      const roll = Math.random();
      blocks.push({
        x: Math.max(
          0,
          Math.min(
            s.width - w,
            x - w / 2 + (Math.random() - 0.5) * 200 * s.unit,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            s.height - h,
            y - h / 2 + (Math.random() - 0.5) * 140 * s.unit,
          ),
        ),
        w,
        h,
        dx:
          direction *
          (16 + Math.random() * 72) *
          (0.6 + speed * 0.5) *
          boost *
          s.unit,
        born: now,
        life: (380 + Math.random() * 620) * (pressed ? 1.4 : 1),
        kind:
          roll < 0.4
            ? "smear"
            : roll < 0.65
              ? "shift"
              : roll < 0.9
                ? "pixel"
                : "tint",
        pixel: pick(PIXELS),
      });
    }
    if (blocks.length > MAX_BLOCKS) blocks = blocks.slice(-MAX_BLOCKS);
    if (!frame) frame = requestAnimationFrame(draw);
  };

  function draw() {
    const s = surface;
    if (!ctx || !s) return;
    const now = performance.now();
    ctx.clearRect(0, 0, s.width, s.height);
    blocks = blocks.filter((b) => now - b.born < b.life);
    for (const b of blocks) {
      const left = 1 - (now - b.born) / b.life;
      const amount = left < 0.35 ? left / 0.35 : 1;
      const jitter =
        Math.random() < 0.15 ? (Math.random() - 0.5) * 16 * s.unit : 0;
      const step = 4 * s.unit;
      const dx = Math.round((b.dx * amount + jitter) / step) * step;
      const x = Math.round(b.x);
      const y = Math.round(b.y);
      ctx.fillStyle = s.paper;
      ctx.fillRect(x, y, b.w, b.h);
      if (b.kind === "pixel") {
        const size = b.pixel * s.unit;
        scratch.width = Math.max(1, Math.round(b.w / size));
        scratch.height = Math.max(1, Math.round(b.h / size));
        const small = scratch.getContext("2d");
        if (!small) continue;
        small.imageSmoothingEnabled = false;
        small.drawImage(
          s.source,
          x,
          y,
          b.w,
          b.h,
          0,
          0,
          scratch.width,
          scratch.height,
        );
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          scratch,
          0,
          0,
          scratch.width,
          scratch.height,
          x + dx,
          y,
          b.w,
          b.h,
        );
      } else {
        ctx.drawImage(s.source, x, y, b.w, b.h, x + dx, y, b.w, b.h);
      }
      // The gap a slice leaves behind is filled by its trailing column of
      // pixels, stretched: the letters look dragged rather than cut.
      if (b.kind === "smear" && Math.abs(dx) >= 1) {
        const edge = Math.max(1, Math.round(2 * s.unit));
        const from = dx > 0 ? x : x + b.w - edge;
        const gap = Math.min(Math.abs(dx), b.w);
        const to = dx > 0 ? x + dx - gap : x + b.w + dx;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(s.source, from, y, edge, b.h, to, y, gap, b.h);
      }
      if (b.kind === "tint") {
        ctx.globalAlpha = 0.3 * amount;
        ctx.fillStyle = s.ink;
        ctx.fillRect(x + dx, y, b.w, b.h);
        ctx.globalAlpha = 1;
      }
    }
    frame = blocks.length ? requestAnimationFrame(draw) : 0;
  }

  const ready = () => {
    surface ??= paint(band, art, canvas);
    return surface;
  };

  const onMove = (event: PointerEvent) => {
    const s = ready();
    if (!s) return;
    const point = locate(event);
    if (last && point.t - lastSpawn > SPAWN_EVERY_MS) {
      const dt = Math.max(8, point.t - last.t);
      const vx = (point.x - last.x) / s.dpr / dt;
      const vy = (point.y - last.y) / s.dpr / dt;
      spawn(s, point.x, point.y, vx, Math.hypot(vx, vy));
      lastSpawn = point.t;
    }
    last = point;
  };
  const onDown = (event: PointerEvent) => {
    const s = ready();
    if (!s) return;
    pressed = true;
    const point = locate(event);
    spawn(s, point.x, point.y, 1, 2.5);
    spawn(s, point.x, point.y, -1, 2.5);
  };
  const onUp = () => {
    pressed = false;
  };
  const onLeave = () => {
    pressed = false;
    last = null;
  };
  // A new size needs a new source image; it is painted on the next touch.
  const resize = new ResizeObserver(() => {
    surface = null;
    blocks = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  band.addEventListener("pointermove", onMove);
  band.addEventListener("pointerdown", onDown);
  band.addEventListener("pointerup", onUp);
  band.addEventListener("pointerleave", onLeave);
  band.addEventListener("pointercancel", onLeave);
  resize.observe(band);
  return () => {
    band.removeEventListener("pointermove", onMove);
    band.removeEventListener("pointerdown", onDown);
    band.removeEventListener("pointerup", onUp);
    band.removeEventListener("pointerleave", onLeave);
    band.removeEventListener("pointercancel", onLeave);
    resize.disconnect();
    cancelAnimationFrame(frame);
  };
}
