"use client";

import { type ComponentType, useEffect, useRef, useState } from "react";
import type { SilkColors, SilkVariant } from "./silk-scene";

type Scene = ComponentType<{
  variant: SilkVariant;
  colors: SilkColors;
  still: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}>;

type Gpu = { requestAdapter(): Promise<unknown> };
type Device = Navigator & {
  gpu?: Gpu;
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

const token = (style: CSSStyleDeclaration, name: string) => style.getPropertyValue(name).trim();

// The shader library is about 700 KB compressed and takes the main thread
// for a few hundred milliseconds on a phone: the CSS ground is the picture
// for anyone who asked to save data, on a low-memory device, or on a phone.
function keepsTheGround(device: Device) {
  return (
    !!device.connection?.saveData ||
    (device.deviceMemory ?? 8) <= 4 ||
    matchMedia("(pointer: coarse) and (max-width: 899px)").matches
  );
}

function whenIdle(run: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(run, { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(run, 200);
  return () => clearTimeout(id);
}

// The night behind the statement and the final call to action.
// The CSS ground (05-silk.css) is the whole picture until the section comes
// within a screen of the viewport; then, at the next idle moment, a WebGPU
// adapter is asked for, and only if one answers is the shader library
// loaded. Its canvas fades in over the ground once it has drawn. Browsers
// without WebGPU, the devices above, and the screenshot harness keep the
// CSS ground. Under Reduce motion the threads hold still but still answer
// the pointer.
export function Silk({ variant }: { variant: SilkVariant }) {
  const root = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<{ Scene: Scene; colors: SilkColors; still: boolean }>();
  const [state, setState] = useState<"ground" | "drawn" | "failed">("ground");

  useEffect(() => {
    const el = root.current;
    const device = navigator as Device;
    const gpu = device.gpu;
    if (!el || !gpu || keepsTheGround(device)) return;
    let live = true;
    let cancelIdle: (() => void) | undefined;
    const load = async () => {
      const adapter = await gpu.requestAdapter();
      if (!adapter || !live) return;
      const { default: Scene } = await import("./silk-scene");
      if (!live) return;
      const style = getComputedStyle(document.documentElement);
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
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        near.disconnect();
        cancelIdle = whenIdle(() => {
          load().catch(() => {
            if (live) setState("failed");
          });
        });
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(el);
    return () => {
      live = false;
      near.disconnect();
      cancelIdle?.();
    };
  }, []);

  return (
    <div ref={root} className={`silk silk-${variant}`} data-state={state} aria-hidden="true">
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
