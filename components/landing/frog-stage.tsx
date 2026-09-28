"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function Placeholder() {
  return (
    <div className="relative mx-auto flex aspect-square w-[240px] items-center justify-center sm:w-[360px] md:w-[420px]">
      <span className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}

// three.js loads only in the browser and only for this component, so it
// never delays the rest of the page.
const VoxelFrog = dynamic(
  () => import("./voxel-frog").then((m) => m.VoxelFrog),
  {
    ssr: false,
    loading: Placeholder,
  },
);

// The download starts once the browser is idle after the first paint, so
// the headline and the page's own scripts are never queued behind it.
export function FrogStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 1500,
      });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timer);
  }, []);
  return ready ? <VoxelFrog /> : <Placeholder />;
}
