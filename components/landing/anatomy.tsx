"use client";

import { Check, CircleCheck, CircleSlash } from "lucide-react";
import { type ReactNode, useState } from "react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/cn";
import type { Copy } from "@/lib/copy";
import { Section } from "./section";

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
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-max min-w-full items-center",
        tone === "add" && "bg-accent/[0.07]",
        tone === "del" && "bg-critical/[0.08]",
      )}
    >
      <span className="w-14 shrink-0 select-none pr-4 text-right text-fg-subtle">
        {n}
      </span>
      <span
        className={cn(
          "w-5 shrink-0 select-none",
          tone === "add" ? "text-accent" : "text-fg-subtle",
        )}
      >
        {sign}
      </span>
      <span className="whitespace-pre pr-6">{code}</span>
      {children}
    </div>
  );
}

// The inline comment ocra posts, in the same shape as the real one
// (vcs-github render.ts): title, severity, verification, reviewer, body,
// suggestion. The example is labelled as one.
function Comment() {
  return (
    <div className="flex flex-col gap-3.5 p-5">
      <p className="flex flex-wrap items-center gap-2.5 text-[0.8125rem]">
        <LogoMark className="size-[22px]" />
        <span className="font-semibold">github-actions</span>
        <span className="border border-border-strong px-1.5 text-[11px] text-fg-muted">
          bot
        </span>
        <span className="text-fg-subtle">ocra review</span>
      </p>
      <p className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="severity-critical px-1.5 py-px">critical</span>
        <span className="verified flex items-center gap-1 px-1.5 py-px">
          <Check className="size-3" />
          verified
        </span>
        <span className="text-fg-muted">correctness</span>
        <Marker n={2} />
      </p>
      <p className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em]">
        Every session is treated as expired
      </p>
      <p className="text-[0.9375rem] leading-relaxed text-fg-muted">
        isExpired() compares expiresAt in seconds with Date.now() in
        milliseconds, so every session counts as expired and users are logged
        out right after signing in.
        <Marker n={3} />
      </p>
      <div className="flex flex-col gap-2">
        <span className="flex items-center text-xs text-fg-subtle">
          Suggestion
          <Marker n={4} />
        </span>
        <code className="block overflow-x-auto border border-border bg-bg-subtle px-3 py-2.5 font-mono text-[0.8125rem] whitespace-pre">
          return session.expiresAt * 1000 {"<"} Date.now();
        </code>
      </div>
    </div>
  );
}

export function Anatomy({
  copy,
  locale,
}: {
  copy: Copy["anatomy"];
  locale: string;
}) {
  const [state, setState] = useState<State>("reported");
  const { callouts, states } = copy;
  const fixed = state === "fixed";
  return (
    <Section id="finding" labelledBy="finding-title" className="lg:pt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-end lg:gap-14">
        <h2
          id="finding-title"
          className={cn(
            "font-semibold",
            locale === "zh"
              ? "text-headline-zh-sm md:text-headline-zh"
              : "text-balance text-headline-sm md:text-headline",
          )}
        >
          {copy.title}
        </h2>
        <p className="text-pretty text-lead text-fg-muted">{copy.body}</p>
      </div>
      <div className="mt-14 grid gap-10 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-14">
        <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
          <legend className="sr-only">{copy.title}</legend>
          {STATES.map((s) => {
            const active = s === state;
            return (
              <div
                key={s}
                className={cn(
                  "border-t-2 py-6",
                  active ? "border-accent" : "border-border",
                )}
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setState(s)}
                  className={cn(
                    "focus-ring w-full text-left text-title font-semibold transition-colors",
                    active ? "text-fg" : "text-fg-subtle hover:text-fg",
                  )}
                >
                  {states[s].tab}
                </button>
                {active ? (
                  <div aria-live="polite" className="mt-3">
                    <p className="text-[0.9375rem] leading-relaxed text-fg-muted">
                      {states[s].text}
                    </p>
                    {s === "reported" ? (
                      <ol className="mt-5 flex list-none flex-col gap-3 p-0">
                        {[
                          callouts.quote,
                          callouts.lines,
                          callouts.verified,
                          callouts.suggestion,
                        ].map((text, i) => (
                          <li key={text} className="flex gap-3.5">
                            <span className="marker marker-brand mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-sm text-fg-muted">
                              {text}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </fieldset>

        <figure className="panel m-0 flex min-w-0 flex-col">
          <figcaption className="panel-bar">
            <span className="truncate text-fg">src/auth/session.ts</span>
            <span className="shrink-0">{copy.example}</span>
          </figcaption>
          <div className="overflow-x-auto py-3 font-mono text-[0.8125rem] leading-7 sm:text-sm">
            <Line
              n={41}
              sign=" "
              code="export function isExpired(session: Session) {"
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
          <div className="mx-4 mb-4 border border-border-strong bg-bg sm:mr-6 sm:mb-6 sm:ml-14">
            {state === "reported" ? (
              <Comment />
            ) : (
              <p className="flex items-center gap-2.5 px-5 py-4 text-sm text-fg-muted">
                {fixed ? (
                  <CircleCheck className="size-4 text-accent" />
                ) : (
                  <CircleSlash className="size-4 text-fg-subtle" />
                )}
                <span className="line-through decoration-fg-subtle">
                  Every session is treated as expired
                </span>
              </p>
            )}
            {state === "dismissed" ? (
              <div className="border-t border-border px-5 py-4 text-sm">
                <span className="font-semibold">{states.dismissed.who}</span>
                <p className="mt-1 text-fg-muted">{states.dismissed.reply}</p>
              </div>
            ) : null}
          </div>
          <p className="mt-auto flex items-center gap-2.5 border-t border-border px-5 py-4 text-sm text-fg-muted sm:pl-14">
            {state === "reported" ? (
              <>
                <span aria-hidden className="size-2 shrink-0 bg-critical" />
                {states.reported.open}
              </>
            ) : (
              <>
                <Check className="size-4 shrink-0 text-accent" />
                {fixed ? states.fixed.resolved : states.dismissed.resolved}
              </>
            )}
          </p>
        </figure>
      </div>
    </Section>
  );
}
