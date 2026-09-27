"use client";

import dynamic from "next/dynamic";

// three.js loads only in the browser and only for this component, so it
// never delays the rest of the page.
const VoxelFrog = dynamic(
  () => import("./voxel-frog").then((m) => m.VoxelFrog),
  {
    ssr: false,
    loading: () => (
      <div className="relative mx-auto flex aspect-square w-[240px] items-center justify-center sm:w-[360px] md:w-[420px]">
        <span className="size-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    ),
  },
);

export function FrogStage() {
  return <VoxelFrog />;
}
