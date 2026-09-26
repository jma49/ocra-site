import { Window } from "@/components/aqua/window";

const lines: { text: string; tone?: "dim" | "ok" | "warn" | "cmd" }[] = [
  { text: "$ ocra review --from main", tone: "cmd" },
  {
    text: "[ocra] 4 file(s) selected, 1 excluded · risk tier: lite",
    tone: "dim",
  },
  { text: "[ocra] 2 review task(s) (grouped)", tone: "dim" },
  {
    text: "[ocra] correctness-1 gemini-3.5-flash: 5 tool calls, $0.0081",
    tone: "dim",
  },
  { text: "[ocra] correctness-2 completed in 7.4s · 0 finding(s)", tone: "ok" },
  { text: "" },
  { text: "src/auth/session.ts" },
  {
    text: "  critical   L42       Every session is treated as expired",
    tone: "warn",
  },
  { text: "    isExpired() compares expiresAt in seconds with Date.now() in" },
  { text: "    milliseconds, so users are logged out right after signing in." },
  { text: "    Suggestion: return session.expiresAt * 1000 < Date.now();" },
  { text: "" },
  {
    text: "1 finding(s) (1 critical) · 21,406 in / 402 out · $0.0143",
    tone: "dim",
  },
];

const tones = {
  dim: "text-white/50",
  ok: "text-emerald-300",
  warn: "text-amber-200",
  cmd: "text-sky-200",
} as const;

export function Terminal({ label }: { label: string }) {
  return (
    <Window title={`Terminal — ocra review — ${label}`}>
      <pre className="terminal m-0 overflow-x-auto whitespace-pre-wrap rounded-b-[5px] p-4 font-mono text-[12px] leading-[1.6]">
        {lines.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static lines that never reorder
          <div key={i} className={line.tone ? tones[line.tone] : undefined}>
            {line.text || " "}
          </div>
        ))}
        <span className="caret inline-block h-3.5 w-[7px] translate-y-0.5 bg-white/80" />
      </pre>
    </Window>
  );
}
