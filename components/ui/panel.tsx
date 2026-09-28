import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// A bordered surface with an optional label bar (a file name, a command).
export function Panel({
  label,
  accessory,
  className,
  bodyClassName,
  children,
}: {
  label?: string;
  accessory?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cn("panel m-0 min-w-0 overflow-hidden", className)}>
      {label ? (
        <figcaption className="panel-bar">
          <span className="truncate">{label}</span>
          {accessory}
        </figcaption>
      ) : null}
      <div className={cn("min-w-0", bodyClassName)}>{children}</div>
    </figure>
  );
}
