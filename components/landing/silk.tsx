"use client";

import { type ComponentType, useEffect, useState } from "react";
import type { SilkColors, SilkVariant } from "./silk-scene";

type Scene = ComponentType<{
  variant: SilkVariant;
  colors: SilkColors;
  still: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}>;

const token = (style: CSSStyleDeclaration, name: string) => style.getPropertyValue(name).trim();

// The night behind the statement and the final call to action.
// The CSS ground (05-silk.css) is the whole picture until a WebGPU adapter
// answers; only then is the shader library loaded, and its canvas fades in
// over the ground once it has drawn. Browsers without WebGPU, and the
// screenshot harness, keep the CSS ground. Under Reduce motion the threads
// hold still but still answer the pointer.
export function Silk({ variant }: { variant: SilkVariant }) {
  const [scene, setScene] = useState<{ Scene: Scene; colors: SilkColors; still: boolean }>();
  const [state, setState] = useState<"ground" | "drawn" | "failed">("ground");

  useEffect(() => {
    let live = true;
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu;
    if (!gpu) return;
    gpu
      .requestAdapter()
      .then(async (adapter) => {
        if (!adapter || !live) return;
        const { default: Scene } = await import("./silk-scene");
        const style = getComputedStyle(document.documentElement);
        if (!live) return;
        setScene({
          Scene,
          still: matchMedia("(prefers-reduced-motion: reduce)").matches,
          colors: {
            night: token(style, "--night"),
            silk: token(style, "--silk"),
            aqua: token(style, "--aqua"),
            onNight: token(style, "--on-night"),
          },
        });
      })
      .catch(() => setState("failed"));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div className={`silk silk-${variant}`} data-state={state} aria-hidden="true">
      {scene && state !== "failed" && (
        <scene.Scene
          variant={variant}
          colors={scene.colors}
          still={scene.still}
          onReady={() => setState("drawn")}
          onUnavailable={() => setState("failed")}
        />
      )}
    </div>
  );
}
