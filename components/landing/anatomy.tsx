import { Check } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

function Marker({ n }: { n: number }) {
  return <span className="marker marker-brand ml-2 align-middle">{n}</span>;
}

export function Anatomy({ copy }: { copy: Copy["anatomy"] }) {
  const { callouts } = copy;
  return (
    <Section>
      <Heading title={copy.title} body={copy.body} />
      <div className="grid items-start gap-12 lg:grid-cols-[1.45fr_1fr]">
        <Panel
          label="src/auth/session.ts"
          accessory={
            <span className="flex items-center gap-2">
              <span className="verified flex items-center gap-1 rounded-md px-1.5 py-px text-[11px]">
                <Check className="size-3" />
                verified
              </span>
              <span className="severity-critical rounded-md px-1.5 py-px text-[11px]">
                critical
              </span>
            </span>
          }
        >
          <div className="text-[13px]">
            <div className="overflow-x-auto border-b border-[var(--border)] py-3 font-mono text-[12px] leading-6">
              <div className="px-5 text-[var(--fg-subtle)]">
                41 export function isExpired(session: Session) {"{"}
              </div>
              <div className="w-max min-w-full border-l-2 border-[var(--critical)] bg-[color-mix(in_srgb,var(--critical)_8%,transparent)] px-5">
                42 + return session.expiresAt {"<"} Date.now(); <Marker n={1} />
              </div>
              <div className="px-5 text-[var(--fg-subtle)]">43 {"}"}</div>
            </div>
            <div className="space-y-4 px-5 py-5">
              <p className="flex items-center text-base font-semibold">
                Every session is treated as expired
                <Marker n={2} />
              </p>
              <p className="leading-relaxed text-[var(--fg-muted)]">
                expiresAt is stored in seconds but compared with Date.now() in
                milliseconds, so every session counts as expired and users are
                logged out right after signing in.
              </p>
              <p className="rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 text-xs text-[var(--fg-muted)]">
                Evidence: token.ts:18 sets expiresAt = Math.floor(Date.now() /
                1000) + ttl
                <Marker n={3} />
              </p>
              <pre className="m-0 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2 font-mono text-xs">
                <span className="text-[var(--accent)]">
                  + return session.expiresAt * 1000 {"<"} Date.now();
                </span>
                <Marker n={4} />
              </pre>
            </div>
          </div>
        </Panel>
        <ol className="space-y-6 lg:pt-12">
          {[
            callouts.quote,
            callouts.lines,
            callouts.evidence,
            callouts.suggestion,
          ].map((text, i) => (
            <li key={text} className="flex gap-4">
              <span className="marker marker-brand mt-0.5">{i + 1}</span>
              <span className="text-[var(--fg-muted)]">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
