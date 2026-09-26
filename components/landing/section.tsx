import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 md:py-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Heading({
  title,
  body,
  className,
}: {
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      <h2 className="text-balance text-[1.7rem] font-bold leading-tight tracking-[-0.02em] md:text-[2.2rem]">
        {title}
      </h2>
      {body ? (
        <p className="mt-3 text-pretty leading-relaxed text-[var(--aqua-dim)] md:text-[1.05rem]">
          {body}
        </p>
      ) : null}
    </div>
  );
}
