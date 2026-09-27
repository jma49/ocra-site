"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LogoMark } from "@/components/logo";
import { voxelFrog } from "@/lib/voxel-frog";

const INTRO_FRAMES = 100;
const CAMERA_DISTANCE = 22;
const START_ANGLE = 0.2 * Math.PI;
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
    const start = new THREE.Vector3(
      CAMERA_DISTANCE * Math.sin(START_ANGLE),
      12,
      CAMERA_DISTANCE * Math.cos(START_ANGLE),
    );
    camera.position.copy(start);
    camera.lookAt(TARGET);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(TARGET);
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 2;

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
        const spin = -easeOutCirc(frame / (INTRO_FRAMES + 20)) * Math.PI * 20;
        camera.position.set(
          start.x * Math.cos(spin) + start.z * Math.sin(spin),
          start.y,
          start.z * Math.cos(spin) - start.x * Math.sin(spin),
        );
        camera.lookAt(TARGET);
        frame += 1;
      } else {
        controls.update();
      }
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
      controls.dispose();
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
      className="relative mx-auto flex aspect-square w-[240px] cursor-grab items-center justify-center active:cursor-grabbing sm:w-[360px] md:w-[420px]"
    >
      {state === "loading" ? (
        <span className="absolute size-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      ) : null}
      {state === "fallback" ? <LogoMark className="size-40" /> : null}
    </div>
  );
}
