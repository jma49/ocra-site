import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

// A vertical timeline: shipped milestones on a solid rail with a check,
// planned work on a dashed one. Planned items carry no dates.
export function Status({ copy }: { copy: Copy["status"] }) {
  return (
    <Section>
      <Heading index={5} title={copy.title} />
      <ol className="relative max-w-3xl">
        {copy.items.map((item, i) => {
          const last = i === copy.items.length - 1;
          const nextDone = copy.items[i + 1]?.done ?? false;
          return (
            <li
              key={`${item.milestone}-${item.title}`}
              className="relative flex gap-5 pb-10"
            >
              {last ? null : (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-7 bottom-0 left-[13px] w-px",
                    nextDone
                      ? "bg-fg"
                      : "border-l border-dashed border-border-strong",
                  )}
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full",
                  item.done
                    ? "bg-accent text-bg"
                    : "border border-dashed border-fg-subtle bg-bg",
                )}
              >
                {item.done ? (
                  <Check strokeWidth={2.5} className="size-3.5" />
                ) : null}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-sm text-fg-subtle">
                    {item.milestone}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                  <span
                    className={cn(
                      "text-xs",
                      item.done ? "font-medium text-accent" : "text-fg-subtle",
                    )}
                  >
                    {item.state}
                  </span>
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
