import { finePointer, motionAllowed } from "./core";

// The light vector: the lamp's pool leans a few per cent towards the pointer
// with heavy damping, and every object's shadow answers it (06-desk.css and
// 07-objects.css read --lx and --ly, from -1 to 1). Desktop pointers only,
// only while the section is in view, never under Reduce motion.
export function pointerLight(root: HTMLElement, damping = 0.06): () => void {
  if (!finePointer() || !motionAllowed()) return () => {};
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    const dt = last ? Math.min(64, now - last) : 16.7;
    last = now;
    const k = 1 - (1 - damping) ** (dt / 16.7);
    x += (tx - x) * k;
    y += (ty - y) * k;
    root.style.setProperty("--lx", x.toFixed(4));
    root.style.setProperty("--ly", y.toFixed(4));
    if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(frame);
    else {
      raf = 0;
      last = 0;
    }
  };
  const move = (e: PointerEvent) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  let on = false;
  const io = new IntersectionObserver(([e]) => {
    const vis = !!e?.isIntersecting;
    if (vis && !on) addEventListener("pointermove", move, { passive: true });
    if (!vis && on) removeEventListener("pointermove", move);
    on = vis;
  });
  io.observe(root);
  return () => {
    io.disconnect();
    removeEventListener("pointermove", move);
    cancelAnimationFrame(raf);
  };
}

// Hover lift and tilt for `[data-lift]` (sheets, cards): `.lifted` raises
// --lift through a transition (the shadow widens and softens), and --tx,
// --ty (-1 to 1) tilt it a little towards the pointer with a sheen. Never
// moves layout: transforms only.
export function hoverLift(scope: ParentNode = document): () => void {
  if (!finePointer() || !motionAllowed()) return () => {};
  const offs: (() => void)[] = [];
  for (const el of scope.querySelectorAll<HTMLElement>("[data-lift]")) {
    let raf = 0;
    let ev: PointerEvent | undefined;
    const apply = () => {
      raf = 0;
      if (!ev) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--tx", (((ev.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--ty", (((ev.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const enter = () => el.classList.add("lifted");
    const move = (e: PointerEvent) => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      el.classList.remove("lifted");
      el.style.setProperty("--tx", "0");
      el.style.setProperty("--ty", "0");
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    });
  }
  return () => {
    for (const off of offs) off();
  };
}

// The eye row on a ruler's tab follows the pointer while it is idle near
// it (within `reach` px), once its scene has played (`.done` above it).
export function nearEyes(reach = 320): () => void {
  if (!finePointer() || !motionAllowed()) return () => {};
  const eyes = [...document.querySelectorAll<SVGSVGElement>(".ruler-eyes[data-look]")];
  if (!eyes.length) return () => {};
  let raf = 0;
  let ev: PointerEvent | undefined;
  const apply = () => {
    raf = 0;
    if (!ev) return;
    for (const el of eyes) {
      if (!el.closest(".done")) continue;
      const r = el.getBoundingClientRect();
      const dx = ev.clientX - (r.left + r.width / 2);
      const dy = ev.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = d < reach ? Math.min(1, d / 160) : 0;
      el.style.setProperty("--px", ((dx / d) * k).toFixed(3));
      el.style.setProperty("--py", ((dy / d) * k * 0.8).toFixed(3));
    }
  };
  const move = (e: PointerEvent) => {
    ev = e;
    if (!raf) raf = requestAnimationFrame(apply);
  };
  addEventListener("pointermove", move, { passive: true });
  return () => {
    removeEventListener("pointermove", move);
    cancelAnimationFrame(raf);
  };
}
