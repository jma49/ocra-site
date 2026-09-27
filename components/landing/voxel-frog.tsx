"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LogoMark } from "@/components/logo";
import { voxelFrog } from "@/lib/voxel-frog";

// The camera follows craftz.dog's voxel dog: it starts at 0.2π around the
// model, 20 out and 8.8 up, spins in over 100 frames with easeOutCirc, then
// turns at OrbitControls' default auto-rotation speed.
const INTRO_FRAMES = 100;
const START_ANGLE = 0.2 * Math.PI;
const RADIUS = 20;
const HEIGHT = 8.8;
const AUTO_ROTATE = ((2 * Math.PI) / 60 / 60) * 2;
const TARGET = new THREE.Vector3(0, 5, 0);

const easeOutCirc = (x: number) => Math.sqrt(1 - (x - 1) ** 4);

function frogMesh(): THREE.InstancedMesh {
  const voxels = voxelFrog();
  const filled = new Set(voxels.map((v) => `${v.x},${v.y},${v.z}`));
  // Voxels enclosed on all six sides are never seen.
  const visible = voxels.filter(
    (v) =>
      ![
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
      ].every(([dx, dy, dz]) =>
        filled.has(`${v.x + dx},${v.y + dy},${v.z + dz}`),
      ),
  );
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }),
    visible.length,
  );
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  visible.forEach((v, i) => {
    matrix.makeTranslation(v.x, v.y, v.z);
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color.setHex(v.color));
  });
  return mesh;
}

export function VoxelFrog() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setState("fallback");
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const mesh = frogMesh();
    scene.add(mesh);
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(6, 14, 10);
    scene.add(sun);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    const baseElevation = Math.atan2(HEIGHT, RADIUS);
    const view = {
      angle: START_ANGLE,
      target: START_ANGLE,
      elevation: baseElevation,
      targetElevation: baseElevation,
    };
    const place = () => {
      const flat = Math.hypot(RADIUS, HEIGHT) * Math.cos(view.elevation);
      camera.position.set(
        TARGET.x + flat * Math.sin(view.angle),
        TARGET.y + Math.hypot(RADIUS, HEIGHT) * Math.sin(view.elevation),
        TARGET.z + flat * Math.cos(view.angle),
      );
      camera.lookAt(TARGET);
    };
    place();

    // Hovering turns the frog with the pointer, no click needed: crossing
    // the frame once is a full turn, and height tilts the view a little.
    let hover: { x: number; angle: number } | undefined;
    const canvas = renderer.domElement;
    canvas.style.touchAction = "pan-y";
    const onEnter = (event: PointerEvent) => {
      hover = { x: event.clientX, angle: view.angle };
    };
    const onMove = (event: PointerEvent) => {
      if (!hover) onEnter(event);
      const rect = canvas.getBoundingClientRect();
      const turn =
        ((event.clientX - (hover?.x ?? event.clientX)) / rect.width) *
        2 *
        Math.PI;
      view.target = (hover?.angle ?? view.angle) - turn;
      const vertical = (event.clientY - rect.top) / rect.height - 0.5;
      view.targetElevation = baseElevation + vertical * 0.6;
    };
    const onLeave = () => {
      hover = undefined;
      view.targetElevation = baseElevation;
    };
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const size = Math.max(1, Math.min(width, height));
      renderer.setSize(size, size);
      const scale = 14;
      camera.left = -scale;
      camera.right = scale;
      camera.top = scale;
      camera.bottom = -scale;
      camera.updateProjectionMatrix();
    };
    resize();

    let frame = reduced ? INTRO_FRAMES + 1 : 0;
    let raf = 0;
    let visible = true;
    const tick = () => {
      if (frame <= INTRO_FRAMES) {
        view.angle = START_ANGLE - easeOutCirc(frame / 120) * Math.PI * 20;
        view.target = view.angle;
        frame += 1;
      } else {
        if (!hover && !reduced) view.target -= AUTO_ROTATE;
        view.angle += (view.target - view.angle) * 0.12;
        view.elevation += (view.targetElevation - view.elevation) * 0.12;
      }
      place();
      renderer.render(scene, camera);
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (visible && !raf) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      run();
    });
    const sizeObserver = new ResizeObserver(resize);
    observer.observe(container);
    sizeObserver.observe(container);
    setState("ready");
    run();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      sizeObserver.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto flex aspect-square w-[240px] items-center justify-center overflow-hidden sm:w-[360px] md:w-[420px]"
    >
      {state === "loading" ? (
        <span className="absolute size-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      ) : null}
      {state === "fallback" ? <LogoMark className="size-40" /> : null}
    </div>
  );
}
