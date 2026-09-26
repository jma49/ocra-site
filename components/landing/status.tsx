import { Window } from "@/components/aqua/window";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

// Milestones read like Software Update: finished work is a full bar, the
// next milestone the barber pole, later ones an empty track.
export function Status({ copy }: { copy: Copy["status"] }) {
  const next = copy.items.findIndex((item) => !item.done);
  return (
    <Section>
      <Heading title={copy.title} />
      <Window title={copy.window} bodyClassName="p-2">
        <ol className="inset divide-y divide-black/10 dark:divide-white/10">
          {copy.items.map((item, i) => (
            <li
              key={item.milestone}
              className="grid gap-2 px-5 py-4 md:grid-cols-[3rem_11rem_1fr_9rem] md:items-center"
            >
              <span className="font-mono text-sm text-[var(--aqua-dim)]">
                {item.milestone}
              </span>
              <span className="font-bold">{item.title}</span>
              <span className="text-sm text-[var(--aqua-dim)]">
                {item.body}
              </span>
              <span className="flex items-center gap-3 md:flex-col md:items-stretch md:gap-1">
                <span className="progress block w-28 md:w-full" aria-hidden>
                  {item.done ? (
                    <span className="progress-fill w-full" />
                  ) : i === next ? (
                    <span className="progress-fill progress-busy" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-xs md:text-right",
                    item.done
                      ? "font-bold text-fd-primary"
                      : "text-[var(--aqua-dim)]",
                  )}
                >
                  {item.state}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Window>
    </Section>
  );
}
