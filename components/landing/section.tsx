import { Fragment, type ReactNode } from "react";

// The four grounds a section can stand on (DESIGN.md, Grounds). Night and
// stone are inset bands; the nav reads `data-ground` to follow the page.
type Ground = "paper" | "paper-2" | "stone" | "night";

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

// Chinese runs on without spaces: a line ending in CJK text joins the next
// one directly.
const cjk = (text: string) => /[　-鿿＀-￯]$/.test(text);

// A heading's explicit lines (copy `lines`), each a block `span.l`, joined
// with a space in English and nothing in Chinese, so the accessible name is
// the sentence. `inline` sets them on one line from that width up (1024: the
// H1; 1200: the features H2); a display line is clipped, never painted over
// its neighbour, if a fallback face runs wide.
export function Lines({ lines, inline }: { lines: readonly string[]; inline?: 1024 | 1200 }) {
  return (
    <span className="lines" data-inline={inline}>
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static copy, never reordered
        <Fragment key={i}>
          {i > 0 && !cjk(lines[i - 1] ?? "") ? " " : null}
          <span className="l">{line}</span>
        </Fragment>
      ))}
    </span>
  );
}

// A section label above an H2, only where the H2 does not already say it.
export function Kicker({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p className="t-kicker" id={id}>
      {children}
    </p>
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
