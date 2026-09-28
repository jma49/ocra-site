"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";

// The recorded example run (scripts/demo-video). It plays by itself only
// while in view and only without reduced motion; otherwise it waits on its
// poster for the visitor to press play, which is motion the visitor makes.
// On a phone the terminal is too small to read in place, so the browser's
// own controls take over: they can go full screen.
export function DemoVideo({
  copy,
  locale,
}: {
  copy: Copy["run"]["demo"];
  locale: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [phone, setPhone] = useState(false);
  const file = `/demo/review-${locale === "zh" ? "zh" : "en"}`;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    setPhone(window.matchMedia("(max-width: 639px)").matches);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Autoplay can be refused (low-power mode); the button stays.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-xl border border-term-border bg-term-bg">
        <video
          ref={video}
          className="block aspect-video w-full"
          poster={`${file}.webp`}
          preload="none"
          muted
          loop
          playsInline
          controls={phone}
          aria-label={copy.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={phone ? undefined : toggle}
        >
          <source src={`${file}.mp4`} type="video/mp4" />
          <source src={`${file}.webm`} type="video/webm" />
        </video>
        {phone ? null : (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? copy.pause : copy.play}
            className="focus-ring absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full border border-term-border-strong bg-term-bg/80 text-term-strong transition-colors hover:bg-term-bg"
          >
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4 translate-x-px" />
            )}
          </button>
        )}
      </div>
      <figcaption className="mt-3 max-w-2xl text-pretty text-sm text-fg-muted">
        {copy.caption}
      </figcaption>
    </figure>
  );
}
