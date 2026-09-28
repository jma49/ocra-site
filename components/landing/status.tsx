import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

// Milestones as rows: shipped ones with a check, planned ones with a dashed
// square. Planned items carry no dates.
export function Status({
  copy,
  locale,
}: {
  copy: Copy["status"];
  locale: string;
}) {
  return (
    <Section
      id="roadmap"
      labelledBy="roadmap-title"
      className="grid gap-12 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-14 lg:pt-8"
    >
      <Heading id="roadmap-title" title={copy.title} locale={locale} />
      <ol className="m-0 flex list-none flex-col p-0">
        {copy.items.map((item) => (
          <li
            key={`${item.milestone}-${item.title}`}
            className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-5 gap-y-1 border-t border-border py-6 sm:grid-cols-[1.25rem_5rem_minmax(0,1fr)_auto]"
          >
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-5 items-center justify-center",
                item.done
                  ? "bg-accent text-on-accent"
                  : "border border-dashed border-fg-subtle",
              )}
            >
              {item.done ? (
                <Check strokeWidth={3} className="size-3.5" />
              ) : null}
            </span>
            <span className="font-mono text-sm text-fg-subtle max-sm:col-start-2">
              {item.milestone}
            </span>
            <div className="min-w-0 max-sm:col-start-2">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                {item.body}
              </p>
            </div>
            <span
              className={cn(
                "font-mono text-xs max-sm:col-start-2 sm:pt-1",
                item.done ? "text-accent" : "text-fg-subtle",
              )}
            >
              {item.state}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
