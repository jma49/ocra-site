import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "ocra: Open-CR-Agent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const svg = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8");

// The share card: the favicon's spider on the night, the wordmark beside it.
// One card for both languages; it carries no sentence to translate.
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        background: "#0b0f0e",
        color: "#f4f2ea",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain elements, not next/image */}
      <img
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={260}
        height={260}
        alt=""
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -6 }}>ocra</div>
        <div style={{ fontSize: 44, color: "#7fffd4" }}>Open-CR-Agent</div>
      </div>
    </div>,
    size,
  );
}
