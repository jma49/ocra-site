import { Fragment } from "react";
import type { Lines as LinesCopy } from "@/lib/copy/define";

// A heading's explicit lines.
export function Lines({ lines }: { lines: LinesCopy }) {
  return lines.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

// Copy with `code` spans: the backticked parts are set in the code face.
// Each part is keyed by where it starts in the text.
export function Inline({ text }: { text: string }) {
  let at = 0;
  return text.split("`").map((part, i) => {
    const key = at;
    at += part.length + 1;
    return i % 2 ? (
      <code key={key} className="code">
        {part}
      </code>
    ) : (
      <Fragment key={key}>{part}</Fragment>
    );
  });
}

// A picture drawn for each theme: both are in the page and the theme's
// class shows one (01-base.css), so the toggle needs no request. Below the
// fold the browser leaves the hidden one unloaded.
export function Themed({
  name,
  ext,
  width,
  height,
  alt = "",
  className,
  eager,
}: {
  name: string;
  ext: "svg" | "webp";
  width: number;
  height: number;
  alt?: string;
  className?: string;
  eager?: boolean;
}) {
  const props = { width, height, decoding: "async" as const };
  return (
    <>
      {/* biome-ignore lint/performance/noImgElement: drawn and recorded art, already sized; next/image would re-encode the SVGs */}
      <img
        {...props}
        className={`${className ?? ""} only-light`}
        src={`/landing/${name}.${ext}`}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
      {/* biome-ignore lint/performance/noImgElement: as above */}
      <img
        {...props}
        className={`${className ?? ""} only-dark`}
        src={`/landing/${name}-dark.${ext}`}
        alt={alt}
        loading="lazy"
      />
    </>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
