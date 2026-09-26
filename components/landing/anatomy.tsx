import { Window } from "@/components/aqua/window";
import type { Copy } from "@/lib/copy";
import { Heading, Section } from "./section";

function Marker({ n }: { n: number }) {
  return <span className="gel-dot ml-2 size-5 align-middle">{n}</span>;
}

export function Anatomy({ copy }: { copy: Copy["anatomy"] }) {
  const { callouts } = copy;
  return (
    <Section>
      <Heading title={copy.title} body={copy.body} />
      <div className="grid items-start gap-10 lg:grid-cols-[1.45fr_1fr]">
        <Window title="ocra — finding" bodyClassName="p-2">
          <div className="inset overflow-hidden text-[13px]">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-2.5 text-xs text-[var(--aqua-dim)] dark:border-white/10">
              <span className="flex items-center">
                src/auth/session.ts · L42
                <Marker n={2} />
              </span>
              <span className="rounded-full bg-[#e0443e] px-2 py-px text-[11px] font-bold text-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25)]">
                critical
              </span>
            </div>
            <div className="overflow-x-auto border-b border-black/10 px-5 py-3 font-mono text-[12px] leading-6 dark:border-white/10">
              <div className="text-[var(--aqua-dim)]">
                41 export function isExpired(session: Session) {"{"}
              </div>
              <div className="-mx-5 w-max min-w-[calc(100%+2.5rem)] bg-[#e0443e]/12 px-5">
                42 + return session.expiresAt {"<"} Date.now(); <Marker n={1} />
              </div>
              <div className="text-[var(--aqua-dim)]">43 {"}"}</div>
            </div>
            <div className="space-y-3 px-5 py-5">
              <p className="text-base font-bold">
                Every session is treated as expired
              </p>
              <p className="leading-relaxed text-[var(--aqua-dim)]">
                expiresAt is stored in seconds but compared with Date.now() in
                milliseconds, so every session counts as expired and users are
                logged out right after signing in.
              </p>
              <p className="rounded border-l-2 border-[var(--aqua-accent)] bg-[var(--aqua-accent)]/8 px-3 py-2 text-xs text-[var(--aqua-dim)]">
                Evidence: token.ts:18 sets expiresAt = Math.floor(Date.now() /
                1000) + ttl
                <Marker n={3} />
              </p>
              <pre className="m-0 overflow-x-auto rounded bg-black/[0.04] px-3 py-2 font-mono text-xs dark:bg-white/5">
                <span className="text-[#1a7f37] dark:text-emerald-300">
                  + return session.expiresAt * 1000 {"<"} Date.now();
                </span>
                <Marker n={4} />
              </pre>
            </div>
          </div>
        </Window>
        <ol className="space-y-6 lg:pt-10">
          {[
            callouts.quote,
            callouts.lines,
            callouts.evidence,
            callouts.suggestion,
          ].map((text, i) => (
            <li key={text} className="flex gap-4">
              <span className="gel-dot mt-0.5">{i + 1}</span>
              <span className="text-[var(--aqua-dim)]">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
