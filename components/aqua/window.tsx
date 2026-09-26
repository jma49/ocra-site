import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// The lights are decoration: nothing on the page can be closed or zoomed.
function Lights() {
  return (
    <span className="window-lights" aria-hidden="true">
      <span className="window-light" data-light="close" />
      <span className="window-light" data-light="minimize" />
      <span className="window-light" data-light="zoom" />
    </span>
  );
}

export function Window({
  title,
  accessory,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  accessory?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure className={cn("window m-0 min-w-0", className)}>
      <figcaption className="window-titlebar">
        <Lights />
        <span className="truncate">{title}</span>
        {accessory ? (
          <span className="window-accessory">{accessory}</span>
        ) : null}
      </figcaption>
      <div className={cn("min-w-0 flex-1", bodyClassName)}>{children}</div>
    </figure>
  );
}
