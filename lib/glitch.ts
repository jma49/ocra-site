// Pixel glitch for the wordmark band: under the pointer, horizontal slices
// of the letters shift sideways, some pixelate or darken, then settle back.
// A canvas over the static SVG draws only the disturbed slices, so the page
// looks the same without JavaScript, and nothing runs while nothing moves.

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  born: number;
  life: number;
  kind: "shift" | "pixel" | "tint";
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
const MAX_BLOCKS = 90;
const SPAWN_EVERY_MS = 24;

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
    const count = Math.min(5, 1 + Math.round(power * 2)) + (pressed ? 3 : 0);
    const boost = pressed ? 1.6 : 1;
    for (let i = 0; i < count; i++) {
      const h = Math.max(
        2,
        Math.round(pick(HEIGHTS) * s.unit * (pressed ? 1.5 : 1)),
      );
      const w = Math.round(
        (24 + Math.random() * (pressed ? 360 : 200)) * s.unit,
      );
      const along = vx >= 0 ? 1 : -1;
      const direction = Math.random() < 0.7 ? along : -along;
      const roll = Math.random();
      blocks.push({
        x: Math.max(
          0,
          Math.min(
            s.width - w,
            x - w / 2 + (Math.random() - 0.5) * 180 * s.unit,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            s.height - h,
            y - h / 2 + (Math.random() - 0.5) * 120 * s.unit,
          ),
        ),
        w,
        h,
        dx:
          direction *
          (8 + Math.random() * 48) *
          (0.6 + Math.min(power, 2) * 0.4) *
          boost *
          s.unit,
        born: performance.now(),
        life: 320 + Math.random() * 520,
        kind: roll < 0.3 ? "pixel" : roll < 0.45 ? "tint" : "shift",
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
