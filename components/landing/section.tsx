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
      className={cn(band && "border-y border-border bg-bg-subtle")}
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
  title: ReactNode;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", className)}>
      {index ? (
        <span className="mb-4 block font-mono text-sm text-accent">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <h2 className="whitespace-pre-line text-balance text-headline-sm font-semibold md:text-headline">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-pretty text-lead text-fg-muted">{body}</p>
      ) : null}
    </div>
  );
}
