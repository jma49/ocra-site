// The recorded example run the landing page quotes (scripts/demo-video): a
// real `ocra review --from main` on the demo repository with the model
// scripted. Every number, file and line the page shows comes from here, so
// re-recording updates this file and nothing else. lib/landing/recorded.ts
// checks it against the recording at build time and fails the build when
// they disagree.

export type FileId = "docs" | "lock" | "login" | "session" | "token";
type CallRole = "review" | "grouping" | "verification" | "judge";
export type Reviewer = "correctness" | "security" | "performance";
export type ClaimOutcome = "confirmed" | "remembered" | "merged" | "disproved";

const MODEL = "google/gemini-3.5-flash";

// Every model call in pipeline order, from scripted-runtime.mjs
// (usage(input, cached, output, reasoning, $)).
const calls = [
  {
    id: "grouping",
    role: "grouping",
    input: 1_830,
    cached: 0,
    output: 64,
    reasoning: 0,
    dollars: 0.0002,
  },
  {
    id: "correctness-1",
    role: "review",
    model: MODEL,
    input: 121_766,
    cached: 88_320,
    output: 3_312,
    reasoning: 2_958,
    dollars: 0.2045,
  },
  {
    id: "security-1",
    role: "review",
    model: MODEL,
    input: 98_410,
    cached: 70_144,
    output: 2_804,
    reasoning: 2_210,
    dollars: 0.1627,
  },
  {
    id: "performance-1",
    role: "review",
    model: MODEL,
    input: 61_208,
    cached: 41_472,
    output: 1_540,
    reasoning: 1_170,
    dollars: 0.0981,
  },
  {
    id: "correctness-2",
    role: "review",
    model: MODEL,
    input: 18_342,
    cached: 9_216,
    output: 611,
    reasoning: 402,
    dollars: 0.0214,
  },
  {
    id: "verification-1",
    role: "verification",
    input: 5_210,
    cached: 0,
    output: 186,
    reasoning: 431,
    dollars: 0.0041,
  },
  {
    id: "verification-2",
    role: "verification",
    input: 5_210,
    cached: 0,
    output: 186,
    reasoning: 431,
    dollars: 0.0041,
  },
  {
    id: "judge",
    role: "judge",
    input: 3_960,
    cached: 0,
    output: 318,
    reasoning: 887,
    dollars: 0.0183,
  },
] as const satisfies readonly ({ role: CallRole } & Record<string, unknown>)[];

type Counted = "input" | "cached" | "output" | "reasoning" | "dollars";
const sum = (key: Counted) => calls.reduce((s, c) => s + c[key], 0);

// What the data must hold to; `as const` keeps every literal for the copy.
type Shape = {
  files: readonly ({ id: FileId; path: string; selected: boolean } & Record<string, unknown>)[];
  bundles: readonly { label: string; files: readonly FileId[] }[];
  tasks: readonly ({ reviewer: Reviewer; bundle: string } & Record<string, unknown>)[];
  skipped: readonly { reviewer: Reviewer; bundle: string }[];
  claims: readonly ({ outcome: ClaimOutcome } & Record<string, unknown>)[];
};

export const exampleRun = {
  command: "ocra review --from main",
  repo: "~/acme-api",
  // The number is the example's; the title and the branch are the recording's.
  pr: {
    number: 812,
    title: "Expire sessions after 30 minutes",
    base: "main",
    head: "feat/session-expiry",
  },
  // Changed files in git's order; package-lock.json is set aside as generated.
  files: [
    { id: "docs", path: "docs/auth.md", selected: true },
    { id: "lock", path: "package-lock.json", selected: false },
    { id: "login", path: "src/api/login.ts", selected: true },
    { id: "session", path: "src/auth/session.ts", selected: true },
    { id: "token", path: "src/auth/token.ts", selected: true },
  ],
  changedFiles: 5,
  tier: "full",
  bundles: [
    { label: "auth code", files: ["login", "session", "token"] },
    { label: "docs", files: ["docs"] },
  ],
  tasks: [
    {
      id: "correctness-1",
      reviewer: "correctness",
      bundle: "auth code",
      seconds: 71.9,
      steps: 16,
      toolCalls: 14,
      findings: 2,
    },
    {
      id: "security-1",
      reviewer: "security",
      bundle: "auth code",
      seconds: 63.2,
      steps: 13,
      toolCalls: 12,
      findings: 2,
    },
    {
      id: "performance-1",
      reviewer: "performance",
      bundle: "auth code",
      seconds: 48.7,
      steps: 10,
      toolCalls: 9,
      findings: 0,
    },
    {
      id: "correctness-2",
      reviewer: "correctness",
      bundle: "docs",
      seconds: 21.4,
      steps: 5,
      toolCalls: 4,
      findings: 0,
    },
  ],
  // The tools the agents called, from the transcript's per-task summaries.
  toolsCalled: ["read_file", "read_diff", "code_search", "report_finding", "task_done"],
  skipped: [
    { reviewer: "security", bundle: "docs" },
    { reviewer: "performance", bundle: "docs" },
  ],
  // Candidate findings grouped by task (not by the time each task reported),
  // and what happened to each.
  claims: [
    {
      id: "expired",
      title: "Every session is treated as expired",
      task: "correctness-1",
      severity: "critical",
      outcome: "confirmed",
    },
    {
      id: "user",
      title: "user may be undefined",
      task: "correctness-1",
      severity: "warning",
      outcome: "remembered",
    },
    {
      id: "twin",
      title: "Expiry compares seconds with milliseconds",
      task: "security-1",
      severity: "warning",
      outcome: "merged",
    },
    {
      id: "token",
      title: "Token stays valid after logout",
      task: "security-1",
      severity: "warning",
      outcome: "disproved",
      reason: "logout() deletes token:<value> right after ending the session.",
    },
  ],
  outcome: { reported: 1, remembered: 1, merged: 1, disproved: 1 },
  calls,
  usage: {
    input: sum("input"),
    cached: sum("cached"),
    output: sum("output"),
    reasoning: sum("reasoning"),
    dollars: Math.round(sum("dollars") * 1e4) / 1e4,
  },
  finding: {
    title: "Every session is treated as expired",
    body: "isExpired() compares expiresAt, stored in seconds, with Date.now() in milliseconds, so it is always true: loadSession() deletes every session and users are logged out right after signing in.",
    path: "src/auth/session.ts",
    line: 42,
    severity: "critical",
    reviewer: "correctness",
    fingerprint: "b7d6c863",
    // The agent's existingCode.
    quote: "return session.expiresAt < Date.now();",
    suggestion: "return session.expiresAt * 1000 < Date.now();",
    // What the suggestion adds, and where.
    insertAfter: "session.expiresAt",
    insert: " * 1000",
  },
  // The words of the summary comment's heading for this verdict: ocra's
  // packages/vcs-platform/src/render.ts, VERDICT.significant_concerns =
  // "🛑 Significant concerns" (the emoji is drawn as the pen octagon).
  summaryHeading: "Significant concerns",
  diff: {
    path: "src/auth/session.ts",
    hunk: "@@ -5,23 +5,39 @@",
    additions: 18,
    deletions: 2,
    added: [8, 10, 13, 14, 16, 20, 21, 28, 29, 30, 31, 32, 33, 39, 40, 41, 42, 43],
  },
  // The rows the hero shows: the lines the recorded finding's evidence cites
  // (16, 21) and the function (40–43).
  heroRows: [16, 21, 40, 41, 42, 43],
} as const satisfies Shape & Record<string, unknown>;

export type ExampleRun = typeof exampleRun;

// Terminal lines from the transcript, every text line verbatim (recorded.ts
// checks them); ⋮ marks lines left out. The tone is the terminal colour:
// command, dim, ok, warning, plain.
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
  ["  critical   L42       Every session is treated as expired [verified] #b7d6c863", "w"],
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
