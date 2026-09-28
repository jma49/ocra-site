"use client";

import { Check, CircleCheck, CircleSlash } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

type State = "reported" | "fixed" | "dismissed";
const STATES: State[] = ["reported", "fixed", "dismissed"];

function Marker({ n }: { n: number }) {
  return <span className="marker marker-brand ml-2 align-middle">{n}</span>;
}

function Line({
  n,
  sign,
  code,
  tone,
  children,
}: {
  n: number | "";
  sign: " " | "+" | "-";
  code: string;
  tone?: "add" | "del";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-max min-w-full items-center",
        tone === "add" &&
          "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]",
        tone === "del" &&
          "bg-[color-mix(in_srgb,var(--critical)_9%,transparent)]",
      )}
    >
      <span className="w-12 shrink-0 select-none pr-3 text-right text-fg-subtle">
        {n}
      </span>
      <span className="w-4 shrink-0 select-none text-fg-subtle">{sign}</span>
      <span className="whitespace-pre pr-5">{code}</span>
      {children}
    </div>
  );
}

// The inline comment ocra posts, in the same shape as the real one
// (vcs-github render.ts): title, severity, verification, reviewer, body,
// suggestion. The example is labelled as one.
function Comment({ copy }: { copy: Copy["anatomy"] }) {
  return (
    <div className="p-4">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-subtle">
        <span className="font-medium text-fg">github-actions</span>
        <span className="rounded border border-border px-1">bot</span>
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold">
          Every session is treated as expired
        </span>
        <span className="severity-critical rounded-md px-1.5 py-px text-[11px]">
          critical
        </span>
        <span className="verified flex items-center gap-1 rounded-md px-1.5 py-px text-[11px]">
          <Check className="size-3" />
          verified
        </span>
        <span className="text-xs text-fg-subtle">correctness</span>
        <Marker n={2} />
      </p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        isExpired() compares expiresAt, stored in seconds, with Date.now() in
        milliseconds, so it is always true: loadSession() deletes every session
        and users are logged out right after signing in.
        <Marker n={3} />
      </p>
      <p className="mt-2 text-sm text-fg-muted">
        <span className="font-medium text-fg">Suggestion: </span>
        <code className="font-mono text-xs">
          return session.expiresAt * 1000 {"<"} Date.now();
        </code>
        <Marker n={4} />
      </p>
      <p className="sr-only">{copy.example}</p>
    </div>
  );
}

export function Anatomy({ copy }: { copy: Copy["anatomy"] }) {
  const [state, setState] = useState<State>("reported");
  const { callouts, states } = copy;
  const fixed = state === "fixed";
  return (
    <Section id="finding">
      <Heading index={3} title={copy.title} body={copy.body} />
      <div className="grid items-start gap-12 lg:grid-cols-[1.45fr_1fr]">
        <figure className="panel m-0 min-w-0 overflow-hidden">
          <figcaption className="panel-bar">
            <span className="truncate">src/auth/session.ts</span>
            <span className="shrink-0">{copy.example}</span>
          </figcaption>
          <div className="overflow-x-auto border-b border-border py-2 font-mono text-[12px] leading-6">
            <Line
              n={41}
              sign=" "
              code="export function isExpired(session: Session): boolean {"
            />
            {fixed ? (
              <>
                <Line
                  n=""
                  sign="-"
                  tone="del"
                  code="  return session.expiresAt < Date.now();"
                />
                <Line
                  n={42}
                  sign="+"
                  tone="add"
                  code="  return session.expiresAt * 1000 < Date.now();"
                />
              </>
            ) : (
              <Line
                n={42}
                sign="+"
                tone="add"
                code="  return session.expiresAt < Date.now();"
              >
                <Marker n={1} />
              </Line>
            )}
            <Line n={43} sign=" " code="}" />
          </div>
          <div className="bg-bg-subtle p-3">
            <div className="rounded-lg border border-border bg-panel">
              {state === "reported" ? (
                <Comment copy={copy} />
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-fg-muted">
                  {fixed ? (
                    <CircleCheck className="size-4 text-accent" />
                  ) : (
                    <CircleSlash className="size-4 text-fg-subtle" />
                  )}
                  <span className="line-through decoration-fg-subtle">
                    Every session is treated as expired
                  </span>
                </div>
              )}
              {state === "dismissed" ? (
                <div className="border-t border-border px-4 py-3 text-sm">
                  <span className="font-medium">{states.dismissed.who}</span>
                  <p className="mt-1 text-fg-muted">{states.dismissed.reply}</p>
                </div>
              ) : null}
              {state !== "reported" ? (
                <p className="border-t border-border px-4 py-2 text-xs text-fg-subtle">
                  {fixed ? states.fixed.resolved : states.dismissed.resolved}
                </p>
              ) : null}
            </div>
          </div>
        </figure>
        <div className="max-lg:order-first lg:pt-2">
          <fieldset className="m-0 inline-flex min-w-0 rounded-lg border border-border p-1">
            <legend className="sr-only">{copy.title}</legend>
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === state}
                onClick={() => setState(s)}
                className={cn(
                  "focus-ring rounded-[4px] px-3 py-1.5 text-sm transition-colors",
                  s === state ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
                )}
              >
                {states[s].tab}
              </button>
            ))}
          </fieldset>
          <p className="mt-5 leading-relaxed text-fg-muted" aria-live="polite">
            {states[state].text}
          </p>
          {state === "reported" ? (
            <ol className="mt-6 space-y-4">
              {[
                callouts.quote,
                callouts.lines,
                callouts.verified,
                callouts.suggestion,
              ].map((text, i) => (
                <li key={text} className="flex gap-4">
                  <span className="marker marker-brand mt-0.5">{i + 1}</span>
                  <span className="text-sm text-fg-muted">{text}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
