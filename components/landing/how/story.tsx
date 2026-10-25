"use client";

import { useEffect } from "react";
import { EASE, ease, motionAllowed, sleep, whenSeen } from "@/components/landing/desk/motion/core";
import { PenRig, type PenState } from "@/components/landing/desk/motion/pen";
import { countUp, typeOn } from "@/components/landing/desk/motion/text";
import { blink, type Cam, clamp, fitShot, frame, shake, stepType } from "./act";
import { drawn, inkStrokes, pointOn, writeMapped } from "./follow";
import type { Plan } from "./how-it-works";
import { CARDS, type ObjectId, type Pose, type Poses, PUSH_AT } from "./scene";

// The story's island: pins nothing itself (CSS sticky does), reads the
// scroll on frames while the section is in view, picks the chapter, plays
// its timeline when scroll reaches it in order and settles every object at
// once otherwise; scrubs the scrubber and the camera's push into the page.

const AT = [0.02, 0.85, 1.75, 2.65, 3.55] as const;
const PUSH = [4.2, 4.85] as const;
const POS = [0, 0.25, 0.5, 0.75, 1] as const;
const NARROW = "(max-width: 899px)";

export function HowStory({ plan }: { plan: Plan }) {
  useEffect(() => mount(plan), [plan]);
  return null;
}

function mount(plan: Plan): () => void {
  const section = document.getElementById("how");
  const pin = section?.querySelector<HTMLElement>(".how-pin");
  const stage = section?.querySelector<HTMLElement>(".how-stage");
  const world = section?.querySelector<HTMLElement>(".how-world");
  const origin = section?.querySelector<HTMLElement>(".how-origin");
  const unit = section?.querySelector<HTMLElement>(".how-unit");
  const rigEl = section?.querySelector<HTMLElement>(".how-pen");
  const ruler = section?.querySelector<HTMLElement>(".how-ruler");
  const copyCol = section?.querySelector<HTMLElement>(".how-copy");
  const scrub = section?.querySelector<HTMLElement>(".how-scrub");
  if (!section || !pin || !stage || !world || !origin || !unit || !rigEl || !ruler || !copyCol)
    return () => {};
  if (!scrub) return () => {};
  const live = motionAllowed();
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
  };
  const outs = Object.fromEntries(CARDS.map((c) => [c, $(".how-out", obj[c])])) as Record<
    (typeof CARDS)[number],
    HTMLElement
  >;
  const noteLines = $$(".how-tl", obj.note);
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
    el.style.transition = ms
      ? ["translate", "rotate", "scale"]
          .map((k) => `${k} ${ms}ms ${curve} ${delay}ms`)
          .concat(`opacity ${Math.min(ms, 420)}ms ease ${delay}ms`)
          .join(", ")
      : "none";
    el.style.translate = `${p.x}px ${p.y}px`;
    el.style.rotate = `${p.r ?? 0}deg`;
    el.style.scale = String(p.k ?? 1);
    el.style.opacity = String(p.o ?? 1);
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
  const shakeIds = (ids: ObjectId[]) => live && shake(ids.map((id) => obj[id].firstElementChild));
  function bite(id: ObjectId, p: Pose) {
    pose(id, { ...p, y: p.y - 46, o: 0 });
    void frame().then(() => pose(id, p, 360, EASE.snap));
  }

  // ---- The camera: the world fitted into the stage beside the copy ----
  function fit(shot: readonly number[]) {
    const vh = stage?.clientHeight ?? innerHeight;
    if (narrow())
      return fitShot(shot, { x: 0, y: 64, w: innerWidth, h: Math.round(vh * 0.54) - 64 });
    const x = (copyCol?.getBoundingClientRect().right ?? 440) + 40;
    return fitShot(shot, { x, y: 92, w: innerWidth - x, h: vh - 92 - 48 });
  }
  function setCam(c: Cam, ms = 0) {
    if (!world) return;
    world.style.transition = ms ? `transform ${ms}ms ${EASE.glide}` : "none";
    world.style.transform = `translate(${c.tx.toFixed(1)}px, ${c.ty.toFixed(1)}px) scale(${c.s.toFixed(4)})`;
  }
  const shot = (k: number) => P().shots[Math.min(5, k)] ?? P().shots[0];
  const camera = (k: number, ms = 1200) => setCam(fit(shot(k)), live ? ms : 0);
  // A screen point in the world's px (the pen's frame), through the camera.
  const toWorld = (x: number, y: number) => {
    const o = origin.getBoundingClientRect();
    const s = (unit.getBoundingClientRect().left - o.left) / 1000 || 1;
    return { x: (x - o.left) / s, y: (y - o.top) / s };
  };

  // ---- The pen, the ruler, typed things ----
  const rest: PenState = { x: 600, y: 1150, r: -26, lift: 0, tilt: 0 };
  const rig = new PenRig(rigEl, rest);
  const park = (k: number): PenState => {
    const [, y0 = 0, x1 = 900] = shot(k);
    return { x: x1 + 340, y: y0 + 160, r: 48, lift: 1, tilt: 1 };
  };
  const look = (px: number, py = 0) => {
    eyes?.style.setProperty("--px", String(px));
    eyes?.style.setProperty("--py", String(py));
  };
  const blinkEyes = () => live && blink(eyes);
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
    drawn(ink.l42, n >= 5);
    drawn(ink.bill, n >= 5);
    shown(noteLines, n >= 1);
    shown(taskRows, n >= 2);
    for (const c of CARDS) shown([outs[c]], n >= 4);
    shown(billLines, n >= 5);
    for (const el of bill) el.classList.toggle("off", n < 5);
    const to = n >= 5 ? rest : park(n);
    if (ms && live) void rig.to(to, 700, ease.glide).catch(() => {});
    else rig.set(to);
  }

  // ---- Chapter timelines: one lead at a time ----
  const TL: Record<number, (signal: AbortSignal) => Promise<void>> = {
    async 1(signal) {
      const s1 = poseOf(1);
      const wait = (ms: number) => sleep(ms, signal);
      // The generated file: the pen deletes its name on the head...
      drawn(ink.lock, false);
      const a = ink.lock[0] && pointOn(ink.lock[0], 0, toWorld);
      if (a)
        await rig.to(
          { x: a.x + 90, y: a.y - 60, r: 50, lift: 0.6, tilt: 1 },
          640,
          ease.settle,
          signal,
        );
      await writeMapped(rig, ink.lock, toWorld, { speed: 0.8, signal });
      void rig.to(park(1), 700, ease.glide, signal).catch(() => {});
      await wait(160);
      // ...and the sheet is swept off the desk, its reason left behind.
      slide("lock", s1.lock, 1050, 0.7);
      await wait(620);
      pose("note", s1.note, 420);
      for (const el of noteLines) await type(el, 58, signal);
    },
    async 2(signal) {
      const s2 = poseOf(2);
      const wait = (ms: number) => sleep(ms, signal);
      // Docs is drawn out of the stack: a bundle of its own.
      slide("docs", s2.docs, 950, 0.55);
      await wait(760);
      // The auth code squares up, a sheet at a time.
      pose("login", s2.login, 460, EASE.glide);
      pose("token", s2.token, 460, EASE.glide, 90);
      await wait(620);
      // The matrix is dealt onto it and the clip bites, with a 1 px shake.
      const t = s2.task;
      pose("task", { ...t, x: t.x + 460, y: t.y - 140, r: (t.r ?? 0) + 18, o: 1 });
      await frame();
      slide("task", t, 720, 0.8);
      await wait(700);
      bite("bite", s2.bite);
      await wait(300);
      shakeIds(["task", "login", "token", "session"]);
      await wait(220);
      for (const el of taskRows) await stepType(el, 62, signal);
    },
    async 3(signal) {
      const s3 = poseOf(3);
      const wait = (ms: number) => sleep(ms, signal);
      camera(3, 1200);
      await wait(760);
      // The agent reads the exact revision, a line at a time: the eye row
      // rides the ruler, glances back at the TTL comment, blinks on 42.
      setRow(rulerFrom);
      ruler.classList.add("reading");
      look(0, 0.6);
      await wait(300);
      for (let n = 28; n <= 42; n++) {
        setRow(lastRow(n));
        await wait(n === 36 || n === 40 ? 300 : n > 39 ? 160 : 90);
        if (n === 41) {
          look(-1, -0.4);
          await wait(260);
          look(0.2, 0.6);
        }
      }
      look(0.9, 0);
      await wait(240);
      blinkEyes();
      await wait(320);
      ruler.classList.remove("reading");
      await wait(280);
      // Candidates are dealt one at a time, each quoting what it means.
      for (const id of CARDS) {
        const t = s3[id];
        pose(id, { ...t, x: t.x + 520, y: t.y - 90, r: (t.r ?? 0) + 24, o: 1 });
        await frame();
        slide(id, t, 760, 0.8);
        await wait(560);
      }
    },
    async 4(signal) {
      const s3 = poseOf(3);
      const s4 = poseOf(4);
      const wait = (ms: number) => sleep(ms, signal);
      const c1p = s3.c1;
      // #4: disproved by the code, slid off the desk.
      await type(outs.c4, 52, signal);
      await wait(260);
      slide("c4", s4.c4, 1000, 0.5);
      await wait(520);
      // #3: the same root cause, tucked under #1 and clipped to it.
      await type(outs.c3, 52, signal);
      await wait(200);
      pose("c1", { ...c1p, z: 46 });
      slide("c3", { x: c1p.x + 12, y: c1p.y + 14, r: -3.2, z: 45 }, 700, 0.4);
      await wait(740);
      bite("pin", { x: c1p.x + 228, y: c1p.y + 2, z: 47 });
      await wait(320);
      shakeIds(["c1", "c3"]);
      await wait(260);
      // #2: already in the repository's memory, not reported.
      await type(outs.c2, 60, signal);
      await wait(220);
      slide("c2", s4.c2, 1000, 0.5);
      await wait(560);
      // #1 holds up: carried to the line it quotes.
      camera(4, 1300);
      slide("c1", s4.c1, 1300, 0.9);
      slide("c3", s4.c3, 1300, 0.85, 50);
      slide("pin", s4.pin, 1300, 0.9, 30);
      await wait(1360);
      await type(outs.c1, 40, signal);
    },
    async 5(signal) {
      const wait = (ms: number) => sleep(ms, signal);
      drawn(ink.l42, false);
      drawn(ink.bill, false);
      // The pen comments last, on the line the finding quotes.
      const a = ink.l42[0] && pointOn(ink.l42[0], 0, toWorld);
      if (a)
        await rig.to(
          { x: a.x + 80, y: a.y + 70, r: 52, lift: 0.6, tilt: 1 },
          620,
          ease.settle,
          signal,
        );
      await writeMapped(rig, ink.l42, toWorld, { speed: 0.5, signal });
      // The camera follows the page down to the bill: typed by code,
      // counted, and totalled by the pen.
      camera(5, 1300);
      void rig.to(
        { ...rig.s, x: rig.s.x + 120, y: rig.s.y + 260, lift: 0.8 },
        900,
        ease.glide,
        signal,
      );
      await wait(700);
      for (const el of bill) el.classList.remove("off");
      void countUp(total, { ms: 1500, signal }).catch(() => {});
      for (const el of billLines) await type(el, 70, signal);
      await wait(160);
      const b = ink.bill[0] && pointOn(ink.bill[0], 0, toWorld);
      if (b)
        await rig.to(
          { x: b.x - 40, y: b.y + 50, r: 40, lift: 0.6, tilt: 1 },
          520,
          ease.settle,
          signal,
        );
      await writeMapped(rig, ink.bill, toWorld, { speed: 0.6, signal });
      await rig.to(rest, 820, ease.glide, signal);
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
      a.classList.toggle("is-on", c === Math.max(1, n));
      a.classList.toggle("is-past", c < Math.max(1, n));
    }
    run?.abort();
    run = new AbortController();
    const play = TL[n];
    if (live && play && n === prev + 1 && prev >= 0) {
      settle(prev, 380);
      if (n < 3) camera(n);
      void play(run.signal).catch(() => {});
    } else {
      settle(n, prev < 0 ? 0 : 700);
      camera(n, prev < 0 ? 0 : 1000);
    }
  }

  // ---- Scroll: chapter, scrubber, push ----
  let pushing = false;
  function push(p: number) {
    if (!stage || !world) return;
    stage.style.setProperty("--push", p.toFixed(4));
    const on = p > 0;
    if (!on && !pushing) return;
    pushing = on;
    if (!on) return camera(Math.max(0, current), 0);
    if (!live) return;
    const from = fit(shot(5));
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
    if (!pin || !scrub) return;
    const vh = innerHeight;
    const sc = -pin.getBoundingClientRect().top / vh;
    let n = 0;
    AT.forEach((t, i) => {
      if (sc > t) n = i + 1;
    });
    go(n);
    const c = clamp(sc, AT[0], AT[4]);
    let i = 0;
    while (i < 3 && c > (AT[i + 1] ?? 0)) i++;
    const a = AT[i] ?? 0;
    const b = AT[i + 1] ?? 1;
    const sp = (POS[i] ?? 0) + ((POS[i + 1] ?? 1) - (POS[i] ?? 0)) * clamp((c - a) / (b - a));
    scrub.style.setProperty("--sp", sp.toFixed(4));
    // The desk drifts slowly against the scroll through the whole story,
    // so the camera never quite stops (the `translate` property composes
    // with the camera's transform and its transitions).
    if (live && world) world.style.translate = `0 ${(-clamp(sc, 0, PUSH[1]) * 14).toFixed(1)}px`;
    stops.forEach((li, j) => {
      const on = n >= j + 1;
      if (on && !li.classList.contains("is-on") && live) {
        const fig = li.querySelector("b");
        if (fig) void countUp(fig, { ms: 600 }).catch(() => {});
      }
      li.classList.toggle("is-on", on);
    });
    push(clamp((sc - PUSH[0]) / (PUSH[1] - PUSH[0])));
  }

  let raf = 0;
  const onScroll = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        read();
      });
  };
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) {
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    } else removeEventListener("scroll", onScroll);
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
  const head = section.querySelector(".how-head");
  const offHead = head ? whenSeen(head, () => section.classList.add("head-in"), 0.3) : () => {};
  for (const el of [...noteLines, ...taskRows, ...billLines, ...Object.values(outs)])
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
  };
}
