import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";

// The page column: wide, with the same gutter as the header.
export const column = "mx-auto w-full max-w-[90rem] px-4 sm:px-8";

// A landing section: generous vertical space, faded in on first view, and
// clear of the sticky header when reached through an anchor.
export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className="scroll-mt-16">
      <Reveal>
        <div className={cn(column, "py-24 lg:py-40", className)}>
          {children}
        </div>
      </Reveal>
    </section>
  );
}

export function Heading({
  id,
  title,
  body,
  locale,
  className,
}: {
  id: string;
  title: ReactNode;
  body?: string;
  locale: string;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-5", className)}>
      <h2
        id={id}
        className={cn(
          "whitespace-pre-line font-semibold",
          locale === "zh"
            ? "text-headline-zh-sm md:text-headline-zh"
            : "text-balance text-headline-sm md:text-headline",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p className="max-w-xl text-pretty text-lead text-fg-muted">{body}</p>
      ) : null}
    </div>
  );
}
