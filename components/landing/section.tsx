import type { ReactNode } from "react";

// The grounds a section can stand on (DESIGN.md, Grounds). Night and stone
// are inset bands; the nav reads `data-ground` to follow the page. The desk
// page (foundation.md): "desk" and "desk-evening" are the lit desk
// (DeskGround inside), "paper-band" a full-bleed sheet lying on it.
type Ground = "paper" | "paper-2" | "stone" | "night" | "desk" | "desk-evening" | "paper-band";

// A landing section: its ground, and an id where the nav or a link needs one.
// Night and stone sections are inset bands (rounded, 12 px from the edges).
export function Section({
  id,
  ground,
  className,
  labelledBy,
  children,
}: {
  id?: string;
  ground: Ground;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  const band = ground === "night" || ground === "stone";
  return (
    <section
      id={id}
      data-ground={ground}
      className={[band && "band", className].filter(Boolean).join(" ") || undefined}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}

// The arrow for Archivo text, which has no → in its latin subset: an inline
// 0.8 em glyph in the text colour. Maple text keeps the → character.
export function ArrowGlyph() {
  return (
    <svg
      className="arrow-glyph"
      viewBox="0 0 16 16"
      width="0.8em"
      height="0.8em"
      aria-hidden="true"
    >
      <path
        d="M2 8h11.5M9 3.5 13.5 8 9 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Inline `code` in copy: the strings mark identifiers with backticks.
export function withCode(text: string): ReactNode {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    i % 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static copy
      <code key={i}>{part.replace(/`/g, "")}</code>
    ) : (
      part
    ),
  );
}
