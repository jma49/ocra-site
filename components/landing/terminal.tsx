import { Panel } from "@/components/ui/panel";

// Lines from a real run of `ocra review --from main` on the demo repository
// behind the site's example (models scripted, everything else ocra's own
// code); ⋮ marks lines left out. Long lines wrap like a terminal's.
const lines: { text: string; tone?: "dim" | "ok" | "warn" | "cmd" }[] = [
  { text: "$ ocra review --from main", tone: "cmd" },
  { text: "[ocra] Reviewing: Changes from main to HEAD", tone: "dim" },
  {
    text: "[ocra] 4 file(s) selected, 1 excluded · risk tier: full",
    tone: "dim",
  },
  { text: "[ocra] 2 bundle(s) (grouped)", tone: "dim" },
  {
    text: "[ocra] 4 review task(s), 2 reviewer/bundle pair(s) skipped",
    tone: "dim",
  },
  { text: "⋮", tone: "dim" },
  { text: "[ocra] security-1 completed in 63.2s · 2 finding(s)", tone: "ok" },
  {
    text: "[ocra] correctness-1 completed in 71.9s · 2 finding(s)",
    tone: "ok",
  },
  {
    text: "[ocra] Verified 3 finding(s), dropped 1 that the code disproves",
    tone: "dim",
  },
  { text: "⋮", tone: "dim" },
  { text: "Verdict: significant concerns" },
  { text: "" },
  { text: "src/auth/session.ts" },
  {
    text: "  critical   L42       Every session is treated as expired [verified] #b7d6c863",
    tone: "warn",
  },
  {
    text: "    isExpired() compares expiresAt, stored in seconds, with Date.now() in milliseconds, so it is always true: loadSession() deletes every session and users are logged out right after signing in.",
  },
  { text: "    Suggestion: return session.expiresAt * 1000 < Date.now();" },
  { text: "" },
  {
    text: "1 finding(s) (1 critical, 0 warning, 0 suggestion) · tokens: 315936 in (209152 cached), 9021 out, 8489 reasoning · $0.5134",
    tone: "dim",
  },
];

const tones = {
  dim: "text-term-dim",
  ok: "text-term-ok",
  warn: "text-term-warn",
  cmd: "text-term-strong",
} as const;

export function Terminal({ label }: { label: string }) {
  return (
    <div className="relative min-w-0">
      <Panel label={`ocra review — ${label}`} dark>
        <pre className="terminal m-0 whitespace-pre-wrap break-words p-5 font-mono text-[11px] leading-[1.7]">
          {lines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static lines that never reorder
            <div key={i} className={line.tone ? tones[line.tone] : undefined}>
              {line.text || " "}
            </div>
          ))}
          <span className="caret inline-block h-3.5 w-[7px] translate-y-0.5 bg-term-strong/80" />
        </pre>
      </Panel>
    </div>
  );
}
