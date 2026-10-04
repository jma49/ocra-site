import type { ReactNode } from "react";

export function Kw({ children }: { children: ReactNode }) {
  return <span className="kw">{children}</span>;
}

export function Line({
  n,
  children,
  quoted,
  className,
}: {
  n: number;
  children: ReactNode;
  quoted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`l${quoted ? " q" : ""}${className ? ` ${className}` : ""}`}
    >
      <span className="n">{n}</span>
      <span className="src">{children}</span>
    </div>
  );
}

export function Return({ fixed }: { fixed?: boolean }) {
  return (
    <>
      {"  "}
      <Kw>return</Kw> session.expiresAt{fixed ? " * 1000" : ""} &lt; Date.now();
    </>
  );
}

// The example bug, src/auth/session.ts lines 41 to 43, from the recorded run
// in scripts/demo-video. Line 42 is the line the agent quoted.
export function SessionCode({ children }: { children?: ReactNode }) {
  return (
    <figure
      className="code"
      aria-label="src/auth/session.ts"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: code that scrolls sideways must take focus to scroll by keyboard
      tabIndex={0}
    >
      <Line n={41}>
        <Kw>export function</Kw> isExpired(session: Session) {"{"}
      </Line>
      {children ?? (
        <Line n={42} quoted>
          <Return />
        </Line>
      )}
      <Line n={43}>{"}"}</Line>
    </figure>
  );
}
