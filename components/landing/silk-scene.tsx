"use client";

import {
  FilmGrain,
  Liquify,
  RadialGradient,
  Shader,
  SolidColor,
  Strands,
  Vignette,
} from "shaders/react";

export type SilkVariant = "band" | "final";
export type SilkColors = { night: string; silk: string; aqua: string; onNight: string };
type Point = { x: number; y: number };

// Where the threads are anchored, how many there are and how far they sway.
// Both lie low under the text.
const LAYOUT: Record<
  SilkVariant,
  { start: Point; end: Point; glow: Point; lines: number; amplitude: number; spread: number }
> = {
  band: {
    start: { x: -0.05, y: 0.97 },
    end: { x: 1.05, y: 0.84 },
    glow: { x: 0.3, y: 0.8 },
    lines: 9,
    amplitude: 0.45,
    spread: 0.18,
  },
  final: {
    start: { x: -0.05, y: 0.98 },
    end: { x: 1.05, y: 0.7 },
    glow: { x: 0.5, y: 0.75 },
    lines: 11,
    amplitude: 0.6,
    spread: 0.24,
  },
};

// Silk on the night: a few threads of light that drift on their own and
// stretch under the pointer like a web feeling a touch. Telemetry to
// shaders.com is off: the site sends nothing about its visitors anywhere.
export default function SilkScene({
  variant,
  colors: c,
  still,
  onReady,
  onUnavailable,
}: {
  variant: SilkVariant;
  colors: SilkColors;
  still: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const l = LAYOUT[variant];
  return (
    <Shader
      className="silk-canvas"
      disableTelemetry
      onReady={onReady}
      onUnavailable={onUnavailable}
    >
      <SolidColor color={c.night} />
      <RadialGradient
        colorA={c.silk}
        colorB={c.night}
        center={l.glow}
        radius={0.9}
        aspect={1.6}
        colorSpace="oklab"
        opacity={0.32}
      />
      <Strands
        start={l.start}
        end={l.end}
        lineCount={l.lines}
        amplitude={l.amplitude}
        spread={l.spread}
        frequency={0.32}
        lineWidth={0}
        softness={0.05}
        pinEdges
        stops={[
          { color: c.silk, position: 0 },
          { color: c.aqua, position: 0.55 },
          { color: c.onNight, position: 1 },
        ]}
        colorVariance={0.8}
        colorSpeed={still ? 0 : 0.25}
        speed={still ? 0 : 0.16}
        blendMode="screen"
        opacity={0.55}
      />
      <Liquify intensity={6} stiffness={7} damping={3.5} radius={0.6} />
      <FilmGrain strength={0.05} />
      <Vignette color={c.night} radius={0.8} falloff={0.7} intensity={0.85} />
    </Shader>
  );
}
