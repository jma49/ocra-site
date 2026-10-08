// The recorded example run the landing page quotes (scripts/demo-video): a
// real `ocra review --from main` on the demo repository with the model
// scripted. Every number, file and line the page shows comes from here, so
// re-recording updates this file and nothing else.

export type FileId = "session" | "login" | "routes" | "docs" | "lock";
export type CallRole = "review" | "grouping" | "verification" | "judge";

// Every model call of the run (scripts/demo-video/scripted-runtime.mjs); the
// model is named only where the recording names it.
const calls: { role: CallRole; model?: string; input: number }[] = [
  { role: "review", model: "google/gemini-3.5-flash", input: 121_766 },
  { role: "review", model: "google/gemini-3.5-flash", input: 98_410 },
  { role: "review", model: "google/gemini-3.5-flash", input: 61_208 },
  { role: "review", model: "google/gemini-3.5-flash", input: 18_342 },
  { role: "grouping", input: 1_830 },
  { role: "verification", input: 5_210 },
  { role: "verification", input: 5_210 },
  { role: "judge", input: 3_960 },
];

export const exampleRun = {
  command: "ocra review --from main",
  repo: "~/acme-app",
  pr: { number: 812, base: "main", head: "fix/session-expiry" },
  // In the order ocra lists them; `lock` is set aside as generated.
  files: [
    { id: "session", path: "src/auth/session.ts", selected: true },
    { id: "login", path: "src/auth/login.ts", selected: true },
    { id: "routes", path: "src/api/routes.ts", selected: true },
    { id: "docs", path: "docs/sessions.md", selected: true },
    { id: "lock", path: "package-lock.json", selected: false },
  ] satisfies { id: FileId; path: string; selected: boolean }[],
  changedFiles: 4,
  bundles: 2,
  tasks: 4,
  skippedPairs: 2,
  // What happened to the candidate findings: one confirmed, one merged into
  // it, one the code disproves.
  outcome: { verified: 1, merged: 1, disproved: 1 },
  calls,
  usage: {
    input: calls.reduce((sum, call) => sum + call.input, 0),
    cached: 209_152,
    output: 9_021,
    reasoning: 8_489,
    dollars: 0.5134,
  },
  // The judge's summary, which opens ocra's summary comment.
  summary:
    "The change adds session expiry and logout, but isExpired() mixes seconds and milliseconds, so every session is treated as expired and users are logged out right after signing in. Fix the unit mismatch before merging.",
  tier: "full",
  finding: {
    // The title as the run reported it; the page's copy translates it.
    title: "Every session is treated as expired",
    path: "src/auth/session.ts",
    line: 42,
    severity: "critical",
    reviewer: "correctness",
    fingerprint: "b7d6c863",
    // Lines 41 to 43; the agent quoted line 42.
    firstLine: 41,
    code: [
      "export function isExpired(session: Session) {",
      "  return session.expiresAt < Date.now();",
      "}",
    ],
    suggestion: "return session.expiresAt * 1000 < Date.now();",
  },
} as const;

export type ExampleRun = typeof exampleRun;

// Terminal lines from the transcript; ⋮ marks lines left out. The tone is the
// terminal colour: command, dim, ok, warning, plain.
export const terminalLines: [string, "c" | "d" | "o" | "w" | ""][] = [
  [`$ ${exampleRun.command}`, "c"],
  [
    "[ocra] Reviewing: Changes from main to HEAD\n[ocra] 4 file(s) selected, 1 excluded · risk tier: full\n[ocra] 2 bundle(s) (grouped)\n[ocra] 4 review task(s), 2 reviewer/bundle pair(s) skipped\n⋮",
    "d",
  ],
  [
    "[ocra] security-1 completed in 63.2s · 2 finding(s)\n[ocra] correctness-1 completed in 71.9s · 2 finding(s)",
    "o",
  ],
  ["[ocra] Verified 3 finding(s), dropped 1 that the code disproves\n⋮", "d"],
  ["Verdict: significant concerns\n\nsrc/auth/session.ts", ""],
  ["  critical   L42   Every session is treated as expired [verified] #b7d6c863", "w"],
  [
    "    isExpired() compares expiresAt, stored in seconds, with Date.now() in milliseconds, so it is always true: loadSession() deletes every session and users are logged out right after signing in.\n    Suggestion: return session.expiresAt * 1000 < Date.now();\n",
    "",
  ],
  [
    "1 finding(s) (1 critical, 0 warning, 0 suggestion) · tokens: 315936 in (209152 cached), 9021 out, 8489 reasoning · $0.5134",
    "d",
  ],
];

export const formatCount = (n: number) => n.toLocaleString("en-US");
