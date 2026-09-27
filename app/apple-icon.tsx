import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const svg = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8");

export default function AppleIcon() {
  // iOS fills transparency with black, so the frog sits on a light tile.
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#e9fff7",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain elements, not next/image */}
      <img
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={140}
        height={140}
        alt=""
      />
    </div>,
    size,
  );
}
