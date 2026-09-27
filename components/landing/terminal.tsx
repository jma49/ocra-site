import { Panel } from "@/components/ui/panel";

const lines: { text: string; tone?: "dim" | "ok" | "warn" | "cmd" }[] = [
  { text: "$ ocra review --from main", tone: "cmd" },
  {
    text: "[ocra] 4 file(s) selected, 1 excluded · risk tier: full",
    tone: "dim",
  },
  { text: "[ocra] 2 bundle(s) (grouped)", tone: "dim" },
  {
    text: "[ocra] 5 review task(s), 1 reviewer/bundle pair(s) skipped by scope",
    tone: "dim",
  },
  { text: "[ocra] security-1 completed in 9.2s · 0 finding(s)", tone: "ok" },
  { text: "[ocra] correctness-1 completed in 7.4s · 2 finding(s)", tone: "ok" },
  {
    text: "[ocra] Verified 3 finding(s), dropped 1 that the code disproves",
    tone: "dim",
  },
  { text: "[ocra] Verdict: significant concerns", tone: "dim" },
  { text: "" },
  { text: "src/auth/session.ts" },
  {
    text: "  critical   L42       Every session is treated as expired [verified] #a41c9e03",
    tone: "warn",
  },
  { text: "    isExpired() compares expiresAt in seconds with Date.now() in" },
  { text: "    milliseconds, so users are logged out right after signing in." },
  { text: "    Suggestion: return session.expiresAt * 1000 < Date.now();" },
  { text: "" },
  {
    text: "1 finding(s) (1 critical, 0 warning, 0 suggestion) · tokens: 48912 in (31040 cached), 1106 out, 212 reasoning · $0.0412",
    tone: "dim",
  },
];

const tones = {
  dim: "text-white/55",
  ok: "text-[#7fffd4]",
  warn: "text-amber-300",
  cmd: "text-white",
} as const;

export function Terminal({ label }: { label: string }) {
  return (
    <div className="relative min-w-0">
      <Panel label={`ocra review — ${label}`} dark>
        <pre className="terminal m-0 overflow-x-auto whitespace-pre-wrap p-5 font-mono text-[11.5px] leading-[1.7]">
          {lines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static lines that never reorder
            <div key={i} className={line.tone ? tones[line.tone] : undefined}>
              {line.text || " "}
            </div>
          ))}
          <span className="caret inline-block h-3.5 w-[7px] translate-y-0.5 bg-white/80" />
        </pre>
      </Panel>
    </div>
  );
}
