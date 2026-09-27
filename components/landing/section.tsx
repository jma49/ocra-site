import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";

// Sections alternate between the page background and a band, and fade in
// on first view.
export function Section({
  id,
  band = false,
  className,
  children,
}: {
  id?: string;
  band?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        band && "border-y border-[var(--border)] bg-[var(--bg-subtle)]",
      )}
    >
      <Reveal>
        <div
          className={cn(
            "mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 md:py-24",
            className,
          )}
        >
          {children}
        </div>
      </Reveal>
    </section>
  );
}

export function Heading({
  index,
  title,
  body,
  className,
}: {
  index?: number;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", className)}>
      {index ? (
        <span className="mb-4 block font-mono text-sm text-[var(--accent)]">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <h2 className="text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[2.4rem]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-pretty text-[1.05rem] leading-relaxed text-[var(--fg-muted)]">
          {body}
        </p>
      ) : null}
    </div>
  );
}
