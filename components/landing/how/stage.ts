import { EASE, ease } from "@/components/landing/desk/motion/core";
import { PenRig, type PenState } from "@/components/landing/desk/motion/pen";
import { typeOn } from "@/components/landing/desk/motion/text";
import { type Cam, fitShot, frame, shake } from "./act";
import { type inkStrokes, pointOn, writeMapped } from "./follow";
import type { Plan } from "./how-it-works";
import type { ObjectId, Pose, Poses } from "./scene";

// The story's stage hands: they pose and carry the desk's objects, aim the
// camera, move the pen and the ruler's eyes, and type. The story
// (story.tsx) decides what happens when.

const NARROW = "(max-width: 899px)";
type Stroke = ReturnType<typeof inkStrokes>[number];

interface StageParts {
  stage: HTMLElement;
  world: HTMLElement;
  origin: HTMLElement;
  unit: HTMLElement;
  rigEl: HTMLElement;
  ruler: HTMLElement;
  copyCol: HTMLElement;
  obj: Record<ObjectId, HTMLElement>;
  eyes: SVGSVGElement | null;
}

export function stageHands(plan: Plan, parts: StageParts, live: boolean) {
  const { stage, world, origin, unit, rigEl, ruler, copyCol, obj, eyes } = parts;
  const narrow = () => matchMedia(NARROW).matches;
  const P = () => plan[narrow() ? "narrow" : "wide"];
  const poseOf = (n: number): Poses => P().poses[Math.min(5, n)] as Poses;

  // ---- Objects: posed by their holder's transform properties ----
  function pose(id: ObjectId, p: Pose, ms = 0, curve: string = EASE.settle, delay = 0) {
    const el = obj[id];
    const gone = p.o === 0;
    el.style.transition = ms
      ? ["translate", "rotate", "scale"]
          .map((k) => `${k} ${ms}ms ${curve} ${delay}ms`)
          .concat(`opacity ${Math.min(ms, 420)}ms ease ${delay}ms`)
          .concat(`visibility 0s ${gone ? delay + ms : 0}ms`)
          .join(", ")
      : "none";
    el.style.translate = `${p.x}px ${p.y}px`;
    el.style.rotate = `${p.r ?? 0}deg`;
    el.style.scale = String(p.k ?? 1);
    el.style.opacity = String(p.o ?? 1);
    el.style.visibility = gone ? "hidden" : "visible";
    if (p.z !== undefined) el.style.zIndex = String(p.z);
  }
  // Carried: it rises as it leaves (the shadow widens) and lands on arrival.
  function slide(id: ObjectId, p: Pose, ms = 900, lift = 0.5, delay = 0) {
    pose(id, p, ms, EASE.glide, delay);
    if (!live) return;
    obj[id].animate(
      [{ "--lift": 0 }, { "--lift": lift, offset: 0.38 }, { "--lift": 0 }] as Keyframe[],
      { duration: ms + 120, delay, easing: "ease-in-out" },
    );
  }
  // Dealt: it comes in on an arc from the right with a spin, and settles.
  async function deal(id: ObjectId, p: Pose, ms = 600) {
    pose(id, { ...p, x: p.x + 520, y: p.y - 110, r: (p.r ?? 0) + 22, o: 1 });
    await frame();
    slide(id, p, ms, 0.8);
  }
  const shakeIds = (ids: ObjectId[]) => live && shake(ids.map((id) => obj[id].firstElementChild));
  function bite(id: ObjectId, p: Pose) {
    pose(id, { ...p, y: p.y - 46, o: 0 });
    void frame().then(() => pose(id, p, 340, EASE.snap));
  }

  // ---- The camera: the world fitted into the stage beside the copy ----
  function fit(k: number) {
    const shot = P().shots[Math.min(5, k)] ?? P().shots[0];
    const vh = stage.clientHeight;
    if (narrow())
      return fitShot(shot, { x: 0, y: 64, w: innerWidth, h: Math.round(vh * 0.52) - 64 });
    // Before the first chapter the head holds the upper left: the stack
    // waits in the lower right.
    if (k <= 0)
      return fitShot(shot, {
        x: innerWidth * 0.5,
        y: vh * 0.45,
        w: innerWidth * 0.5 - 24,
        h: vh * 0.55,
      });
    const x = copyCol.getBoundingClientRect().right + 40;
    return fitShot(shot, { x, y: 92, w: innerWidth - x - 8, h: vh - 92 - 40 });
  }
  function setCam(c: Cam, ms = 0) {
    world.style.transition = ms ? `transform ${ms}ms ${EASE.glide}` : "none";
    world.style.transform = `translate(${c.tx.toFixed(1)}px, ${c.ty.toFixed(1)}px) scale(${c.s.toFixed(4)})`;
  }
  const camera = (k: number, ms = 1100) => setCam(fit(k), live ? ms : 0);
  // A screen point in the world's px (the pen's frame), through the camera.
  const toWorld = (x: number, y: number) => {
    const o = origin.getBoundingClientRect();
    const s = (unit.getBoundingClientRect().left - o.left) / 1000 || 1;
    return { x: (x - o.left) / s, y: (y - o.top) / s };
  };

  // ---- The pen, the ruler, typed things ----
  const lying = (p: { x: number; y: number; r: number }, lift = 0): PenState => ({
    ...p,
    lift,
    tilt: 0,
  });
  const rig = new PenRig(rigEl, lying(P().pens.rest));
  const penAt = (n: number): PenState => {
    const pn = P().pens;
    if (n >= 5) return lying(pn.rest);
    if (n === 4) return lying(pn.cards);
    if (n === 1) return lying(pn.struck);
    return lying(pn.away, 1);
  };
  // To a stroke's start, held to write, the barrel laid at `r` (where it
  // covers only blank paper), then the strokes.
  async function inkWith(strokes: Stroke[], r: number, speed: number, signal: AbortSignal) {
    const a = strokes[0] && pointOn(strokes[0], 0, toWorld);
    if (!a) return;
    const dx = Math.cos((r * Math.PI) / 180) * 70;
    const dy = Math.sin((r * Math.PI) / 180) * 70;
    await rig.to({ x: a.x + dx, y: a.y + dy, r, lift: 0.6, tilt: 1 }, 420, ease.settle, signal);
    await writeMapped(rig, strokes, toWorld, { speed, signal });
  }
  const look = (px: number, py = 0) => {
    eyes?.style.setProperty("--px", String(px));
    eyes?.style.setProperty("--py", String(py));
  };
  const setRow = (row: number) => ruler.style.setProperty("--row", String(row));
  const lastRow = (n: number) => {
    const lis = ruler.closest(".desk-sheet")?.querySelectorAll(".sheet-rows li") ?? [];
    let found = -1;
    lis.forEach((li, i) => {
      if ((li as HTMLElement).dataset.n === String(n)) found = i;
    });
    for (let i = found + 1; i < lis.length && !(lis[i] as HTMLElement).dataset.n; i++) found = i;
    return found;
  };
  const shown = (els: readonly HTMLElement[], on: boolean) => {
    for (const el of els) el.classList.toggle("untyped", !on);
  };
  async function type(el: HTMLElement, cps: number, signal: AbortSignal) {
    el.classList.remove("untyped");
    await typeOn(el, { cps, signal });
  }

  return {
    narrow,
    P,
    poseOf,
    pose,
    slide,
    deal,
    shakeIds,
    bite,
    fit,
    setCam,
    camera,
    rig,
    penAt,
    inkWith,
    look,
    setRow,
    lastRow,
    shown,
    type,
  };
}
