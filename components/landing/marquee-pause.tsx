"use client";

import { useState } from "react";

// The providers marquee's pause button (WCAG 2.2.2, by keyboard and touch):
// a toggle whose name stays "pause" while aria-pressed says whether it is
// paused; 20-works.css stops the tracks while it is pressed.
export function MarqueePause({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="mq-pause"
      aria-pressed={paused}
      aria-label={pause}
      title={paused ? play : pause}
      onClick={() => setPaused((p) => !p)}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        {paused ? (
          <path d="M5 3.2v9.6L12.8 8z" />
        ) : (
          <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" />
        )}
      </svg>
    </button>
  );
}
