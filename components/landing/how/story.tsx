"use client";

import { useEffect } from "react";
import { EASE, ease, motionAllowed, sleep, whenSeen } from "@/components/landing/desk/motion/core";
import { PenRig, type PenState } from "@/components/landing/desk/motion/pen";
import { countUp, typeOn } from "@/components/landing/desk/motion/text";
import { blink, type Cam, clamp, fitShot, frame, shake, stepType } from "./act";
import { drawn, inkStrokes, pointOn, writeMapped } from "./follow";
import type { Plan } from "./how-it-works";
import { CARDS, type ObjectId, type Pose, type Poses, PUSH_AT } from "./scene";

// The story's island. With motion (30-how.css pins the stage) it reads the
// scroll on frames while the section is in view, picks the chapter, plays
// its timeline when scroll reaches it in order and settles every object at
// once otherwise; it scrubs the scrubber and the camera's push into the
// paper, and hands the paper to Quiet by design (`--qin` on #quiet). Where
// the stage is not pinned (Reduce motion, no script) the server's finished
// desk is the story and there is nothing to do.

const POS = [0, 0.25, 0.5, 0.75, 1] as const;
const NARROW = "(max-width: 899px)";
type Stroke = ReturnType<typeof inkStrokes>[number];

export function HowStory({ plan }: { plan: Plan }) {
  useEffect(() => mount(plan), [plan]);
  return null;
}

function mount(plan: Plan): () => void {
  const section = document.getElementById("how");
  const stage = section?.querySelector<HTMLElement>(".how-stage");
  const way = section?.querySelector<HTMLElement>(".how-way");
  const world = section?.querySelector<HTMLElement>(".how-world");
  const origin = section?.querySelector<HTMLElement>(".how-origin");
  const unit = section?.querySelector<HTMLElement>(".how-unit");
  const rigEl = section?.querySelector<HTMLElement>(".how-pen");
  const ruler = section?.querySelector<HTMLElement>(".how-ruler");
  const copyCol = section?.querySelector<HTMLElement>(".how-copy");
  const scrub = section?.querySelector<HTMLElement>(".how-scrub");
  const head = section?.querySelector<HTMLElement>(".how-head");
  if (!section || !stage || !way || !world || !origin || !unit || !rigEl || !ruler) return () => {};
  if (!copyCol || !scrub || getComputedStyle(stage).position !== "sticky") return () => {};
  const live = motionAllowed();
  const quiet = document.getElementById("quiet");
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = world) =>
    r.querySelector(s) as T;
  const $$ = (s: string, r: ParentNode = world) => [...r.querySelectorAll<HTMLElement>(s)];
  const obj = Object.fromEntries($$("[data-obj]").map((el) => [el.dataset.obj, el])) as Record<
    ObjectId,
    HTMLElement
  >;
  const eyes = $<SVGSVGElement>(".ruler-eyes", ruler);
  const chapters = $$(".how-ch", section);
  const stops = $$(".how-stops li", section);
  const ink = {
    lock: inkStrokes($(".how-ink-lock"), ["dele"]),
    l42: inkStrokes($(".how-ink-l42"), ["units", "now", "caret", "fix"]),
    bill: inkStrokes($(".how-ink-bill"), ["bill"]),
    c2: inkStrokes($(".how-ink-card", obj.c2), ["x"]),
    c4: inkStrokes($(".how-ink-card", obj.c4), ["x"]),
  };
  const outs = Object.fromEntries(CARDS.map((c) => [c, $(".how-out", obj[c])])) as Record<
    (typeof CARDS)[number],
    HTMLElement
  >;
  const reason = $$(".how-tl", obj.lock);
  const taskRows = $$(".card-title, .card-quote, .card-foot", obj.task);
  const billLines = $$(".how-bill .how-tl");
  const bill = [$(".how-bill"), $(".how-total")];
  const total = $(".how-total");
  const rulerFrom = Number(ruler.dataset.row ?? 0);

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
    const vh = stage?.clientHeight ?? innerHeight;
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
    const x = (copyCol?.getBoundingClientRect().right ?? 440) + 40;
    return fitShot(shot, { x, y: 92, w: innerWidth - x - 8, h: vh - 92 - 40 });
  }
  function setCam(c: Cam, ms = 0) {
    if (!world) return;
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

  // ---- Settled states ----
  function settle(n: number, ms = 700) {
    const s = poseOf(n);
    for (const id of Object.keys(obj) as ObjectId[]) pose(id, s[id], live ? ms : 0);
    ruler?.classList.remove("reading");
    setRow(rulerFrom);
    look(0, 0);
    drawn(ink.lock, n >= 1);
    drawn([...ink.c2, ...ink.c4], n >= 4);
    drawn(ink.l42, n >= 5);
    drawn(ink.bill, n >= 5);
    shown(reason, n >= 1);
    shown(taskRows, n >= 2);
    for (const c of CARDS) shown([outs[c]], n >= 4);
    shown(billLines, n >= 5);
    for (const el of bill) el.classList.toggle("off", n < 5);
    if (ms && live) void rig.to(penAt(n), 600, ease.glide).catch(() => {});
    else rig.set(penAt(n));
  }

  // Where a candidate lies while it is judged: on the finding's lower half.
  const judgedAt = (spot: Pose, r: number, z: number): Pose => ({
    x: spot.x + 30,
    y: spot.y + 52,
    r,
    z,
    o: 1,
  });

  // ---- Chapter timelines: one lead at a time, each a few seconds ----
  const TL: Record<number, (signal: AbortSignal) => Promise<void>> = {
    async 1(signal) {
      const wait = (ms: number) => sleep(ms, signal);
      drawn(ink.lock, false);
      shown(reason, false);
      // The generated file is drawn out of the stack and laid aside...
      slide("lock", poseOf(1).lock, 760, 0.7);
      await wait(800);
      // ...struck on its blank page, its reason typed under the strike...
      await inkWith(ink.lock, narrow() ? 30 : 40, 0.8, signal);
      await type(reason[0] as HTMLElement, 64, signal);
      // ...and the pen laid down on the blank page, off the print.
      await rig.to(penAt(1), 520, ease.settle, signal);
    },
    async 2(signal) {
      const s2 = poseOf(2);
      const wait = (ms: number) => sleep(ms, signal);
      // The pen leaves the set-aside page, which goes off the desk.
      void rig.to(penAt(2), 620, ease.glide, signal).catch(() => {});
      slide("lock", s2.lock, 900, 0.6);
      await wait(260);
      // Docs is drawn out of the stack: a bundle of its own.
      slide("docs", s2.docs, 820, 0.55);
      await wait(600);
      // The auth code squares up, a sheet at a time.
      pose("login", s2.login, 420, EASE.glide);
      pose("token", s2.token, 420, EASE.glide, 80);
      await wait(420);
      // The matrix is dealt onto it and the clip bites, with a 1 px shake.
      await deal("task", s2.task, 640);
      await wait(600);
      bite("bite", s2.bite);
      await wait(260);
      shakeIds(["task", "login", "token", "session"]);
      await wait(160);
      for (const el of taskRows) await stepType(el, 110, signal);
    },
    async 3(signal) {
      const wait = (ms: number) => sleep(ms, signal);
      const from = narrow() ? 36 : 28;
      await wait(640);
      // The agent reads the exact revision, a line at a time: the eye row
      // rides the ruler, glances back at the TTL comment, blinks on 42.
      setRow(lastRow(from - 1));
      ruler.classList.add("reading");
      look(0, 0.6);
      await wait(240);
      for (let n = from; n <= 42; n++) {
        setRow(lastRow(n));
        await wait(n === 36 || n === 40 ? 220 : n > 39 ? 130 : 75);
        if (n === 41) {
          look(-1, -0.4);
          await wait(220);
          look(0.2, 0.6);
        }
      }
      look(0.9, 0);
      await wait(200);
      if (live) blink(eyes);
      await wait(280);
      ruler.classList.remove("reading");
      // The candidate that quotes line 42 is dealt under it.
      await deal("c1", poseOf(3).c1, 640);
    },
    async 4(signal) {
      const s4 = poseOf(4);
      const spot = poseOf(3).c1;
      const wait = (ms: number) => sleep(ms, signal);
      const strikeOff = async (id: "c2" | "c4") => {
        await inkWith(ink[id], narrow() ? 24 : 30, 0.5, signal);
        void rig.to(penAt(4), 520, ease.glide, signal).catch(() => {});
        slide(id, s4[id], 680, 0.5);
      };
      drawn([...ink.c2, ...ink.c4], false);
      // Each candidate is dealt onto the finding and judged in turn. #2 is
      // already in the repository's memory: struck, off the desk.
      await deal("c2", { ...s4.c2, ...judgedAt(spot, 1.4, 48) });
      await wait(520);
      await type(outs.c2, 120, signal);
      await strikeOff("c2");
      await wait(260);
      // #3 is the same root cause: tucked under #1 and clipped to it.
      await deal("c3", { ...s4.c3, ...judgedAt(spot, -0.8, 48), k: 1 });
      await wait(520);
      await type(outs.c3, 90, signal);
      slide("c3", { x: spot.x + 12, y: spot.y + 14, r: -3.2, z: 45, k: 1 }, 560, 0.4);
      await wait(580);
      bite("pin", { x: spot.x + 228, y: spot.y + 2, z: 47 });
      await wait(300);
      shakeIds(["c1", "c3"]);
      await wait(160);
      // #4 is disproved by the code: struck, off the desk.
      await deal("c4", { ...s4.c4, ...judgedAt(spot, 1.1, 49) });
      await wait(520);
      await type(outs.c4, 110, signal);
      await strikeOff("c4");
      await wait(420);
      // #1 holds up: confirmed, and the one card left is read larger.
      await type(outs.c1, 70, signal);
      for (const id of ["c1", "c3", "pin"] as const) pose(id, s4[id], 640, EASE.settle);
    },
    async 5(signal) {
      const wait = (ms: number) => sleep(ms, signal);
      drawn(ink.l42, false);
      drawn(ink.bill, false);
      // The pen comments last, on the line the finding quotes...
      await wait(300);
      await inkWith(ink.l42, 52, 0.45, signal);
      // ...the bill is typed by code and counted, and the pen totals it.
      for (const el of bill) el.classList.remove("off");
      void countUp(total, { ms: 900, signal }).catch(() => {});
      for (const el of billLines) await type(el, 130, signal);
      await inkWith(ink.bill, 36, 0.55, signal);
      await rig.to(penAt(5), 620, ease.glide, signal);
    },
  };
  let current = -1;
  let run: AbortController | undefined;
  function go(n: number) {
    if (n === current) return;
    const prev = current;
    current = n;
    stage?.setAttribute("data-ch", String(n));
    for (const a of chapters) {
      const c = Number(a.dataset.ch);
      a.classList.toggle("is-on", c === n);
      a.classList.toggle("is-past", c < n);
    }
    run?.abort();
    run = new AbortController();
    const play = TL[n];
    if (live && play && n === prev + 1 && prev >= 0) {
      settle(prev, 380);
      camera(n);
      void play(run.signal).catch(() => {});
    } else {
      settle(n, prev < 0 ? 0 : 700);
      camera(n, prev < 0 ? 0 : 1000);
    }
  }

  // ---- Scroll: chapter, scrubber, push ----
  // A custom property is written only when it changes: each write restyles
  // everything under the element that holds it.
  const last = new WeakMap<HTMLElement, Record<string, string>>();
  function setVar(el: HTMLElement, name: string, v: string) {
    const seen = last.get(el) ?? {};
    if (seen[name] === v) return;
    seen[name] = v;
    last.set(el, seen);
    el.style.setProperty(name, v);
  }
  let pushing = false;
  function push(p: number) {
    if (!stage || !world) return;
    if (!live) return;
    setVar(stage, "--push", p.toFixed(4));
    // The paper fills the bar's band before Quiet's section reaches it: the
    // nav reads the ground from here (an empty value hands it back). Written
    // only on a change, since every write wakes the nav's observer.
    const ground = p > 0.6 ? "paper-band" : "";
    if ((stage.dataset.navGround ?? "") !== ground) stage.dataset.navGround = ground;
    const qin = clamp((p - 0.7) / 0.3);
    if (quiet) setVar(quiet, "--qin", qin.toFixed(3));
    if (qin > 0) quiet?.classList.add("q-up");
    if (qin >= 1) quiet?.classList.add("q-in");
    const on = p > 0;
    if (!on && !pushing) return;
    pushing = on;
    if (!on) return camera(Math.max(0, current), 0);
    const from = fit(5);
    const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
    const s = from.s * 9 ** e;
    const fx = from.tx + PUSH_AT.x * from.s;
    const fy = from.ty + PUSH_AT.y * from.s;
    const k = Math.min(1, e * 1.4);
    const cx = fx + (innerWidth / 2 - fx) * k;
    const cy = fy + ((stage.clientHeight || innerHeight) / 2 - fy) * k;
    setCam({ s, tx: cx - PUSH_AT.x * s, ty: cy - PUSH_AT.y * s });
  }

  function read() {
    if (!stage || !way || !scrub) return;
    const vh = stage.clientHeight || innerHeight;
    const r = way.getBoundingClientRect();
    const R = r.height / vh;
    const sc = (vh - r.top) / vh;
    const { at, push: pp } = P().timing;
    const marks = at.map((t) => t * R);
    let n = 0;
    marks.forEach((t, i) => {
      if (sc > t) n = i + 1;
    });
    go(n);
    let i = 0;
    while (i < 3 && sc > (marks[i + 1] ?? 0)) i++;
    const a = marks[i] ?? 0;
    const b = marks[i + 1] ?? 1;
    const sp = (POS[i] ?? 0) + ((POS[i + 1] ?? 1) - (POS[i] ?? 0)) * clamp((sc - a) / (b - a));
    setVar(scrub, "--sp", (sc < a ? 0 : sp).toFixed(4));
    // The desk drifts slowly against the scroll through the whole story,
    // so the camera never quite stops (the `translate` property composes
    // with the camera's transform and its transitions).
    const drift = `0 ${((R / 2 - clamp(sc, 0, R)) * 6).toFixed(1)}px`;
    if (live && world && world.style.translate !== drift) world.style.translate = drift;
    // The head scrolls away over the held desk and fades as it goes.
    if (head) setVar(head, "--hd", clamp(1 - (sc - 0.06) / 0.26).toFixed(3));
    stops.forEach((li, j) => {
      const on = n >= j + 1;
      if (on && !li.classList.contains("is-on") && live) {
        const fig = li.querySelector("b");
        if (fig) void countUp(fig, { ms: 600 }).catch(() => {});
      }
      li.classList.toggle("is-on", on);
    });
    push(clamp((sc - pp[0] * R) / ((pp[1] - pp[0]) * R)));
  }

  let raf = 0;
  const onScroll = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        read();
      });
  };
  // Leaving, the last read settles the push (and Quiet's paper) for good.
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else {
      removeEventListener("scroll", onScroll);
      read();
    }
  });
  let width = innerWidth;
  const onResize = () => {
    if (innerWidth === width) return;
    width = innerWidth;
    const n = current;
    current = -1;
    go(Math.max(0, n));
    read();
  };

  section.classList.add("is-live");
  if (live) quiet?.classList.add("joined");
  const offHead = head ? whenSeen(head, () => section.classList.add("head-in"), 0.3) : () => {};
  for (const el of [...reason, ...taskRows, ...billLines, ...Object.values(outs)])
    el.classList.add("untyped");
  // StrictMode (and Fast Refresh) mount, dispose and mount again: a
  // disposed controller must not wake up when the fonts arrive.
  let disposed = false;
  void document.fonts.ready.then(() => {
    if (disposed) return;
    read();
    io.observe(section);
    addEventListener("resize", onResize, { passive: true });
  });
  return () => {
    disposed = true;
    run?.abort();
    offHead();
    io.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onResize);
    cancelAnimationFrame(raf);
    quiet?.classList.remove("joined");
    quiet?.style.removeProperty("--qin");
    delete stage?.dataset.navGround;
  };
}
