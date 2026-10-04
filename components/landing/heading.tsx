import type { ReactNode } from "react";

// Chinese runs on without spaces; a title ending in CJK text joins its
// emphasis directly.
export const cjk = (text: string) => /[\u3000-\u9fff\uff00-\uffef]$/.test(text);

// Section headings: a plain sentence and an emphasised tail, set in the
// brand colour and printed slightly off register.
export function Heading({
  title,
  emphasis,
  as: Tag = "h2",
  className,
  id,
}: {
  title: ReactNode;
  emphasis?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <Tag className={className} id={id}>
      {title}
      {emphasis && (
        <>
          {typeof title === "string" && cjk(title) ? "" : " "}
          <em>{emphasis}</em>
        </>
      )}
    </Tag>
  );
}

// Heading on one side, a paragraph on the other, aligned to the baseline.
export function SplitHead({
  title,
  emphasis,
  body,
}: {
  title: string;
  emphasis: string;
  body: ReactNode;
}) {
  return (
    <div className="split-head">
      <Heading title={title} emphasis={emphasis} />
      <p className="lede">{body}</p>
    </div>
  );
}

// Inline `code` in copy: the strings mark identifiers with backticks.
export function withCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/);
  return parts.map((part, i) =>
    i % 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static copy
      <code key={i}>{part.replace(/`/g, "")}</code>
    ) : (
      part
    ),
  );
}
