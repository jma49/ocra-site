// An ocra plugin that registers a scripted AgentRuntime for recording the
// site's example run. It answers where the OpenCode runtime would call a
// model (review tasks, file grouping, verification, the judge) with fixed
// findings and realistic pacing; selection, bundling, the matrix,
// anchoring, memory, the verdict and every line of output are ocra's own.
// DEMO_SPEED=40 runs it quickly while trying changes.
const MODEL = "google/gemini-3.5-flash";
const SPEED = Number(process.env.DEMO_SPEED ?? 1);

const sleep = (ms, signal) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms / SPEED);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        resolve();
      },
      { once: true },
    );
  });

const usage = (
  inputTokens,
  cachedTokens,
  outputTokens,
  reasoningTokens,
  costUsd,
) => ({
  inputTokens,
  cachedTokens,
  outputTokens,
  reasoningTokens,
  costUsd,
});

function toolSummary(calls) {
  const counts = new Map();
  for (const name of calls) counts.set(name, (counts.get(name) ?? 0) + 1);
  const byUse = [...counts].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  return `${calls.length} tool call(s) (${byUse.map(([n, c]) => `${n} ${c}`).join(", ")})`;
}
const calls = (spec) =>
  Object.entries(spec).flatMap(([name, n]) => Array(n).fill(name));

const TASKS = {
  "correctness-1": {
    ms: 71_900,
    steps: 16,
    tools: calls({
      read_file: 7,
      code_search: 3,
      report_finding: 2,
      read_diff: 1,
      task_done: 1,
    }),
    usage: usage(121766, 88320, 3312, 2958, 0.2045),
    findings: [
      {
        category: "correctness",
        severity: "critical",
        file: "src/auth/session.ts",
        existingCode: "return session.expiresAt < Date.now();",
        title: "Every session is treated as expired",
        body: "isExpired() compares expiresAt, stored in seconds, with Date.now() in milliseconds, so it is always true: loadSession() deletes every session and users are logged out right after signing in.",
        suggestion: "return session.expiresAt * 1000 < Date.now();",
        evidence: [
          "createSession() sets expiresAt to Math.floor(Date.now() / 1000) + TTL_SECONDS",
          "loadSession() deletes the session when isExpired() is true",
        ],
      },
      {
        category: "correctness",
        severity: "warning",
        file: "src/api/login.ts",
        existingCode: "const user = await users.findByEmail(email);",
        title: "user may be undefined",
        body: "findByEmail() returns undefined for an unknown email, and user!.id then throws a TypeError.",
        evidence: ["users.ts: findByEmail returns Promise<User | undefined>"],
      },
    ],
  },
  "security-1": {
    ms: 63_200,
    steps: 13,
    tools: calls({
      read_file: 5,
      code_search: 3,
      report_finding: 2,
      read_diff: 1,
      task_done: 1,
    }),
    usage: usage(98410, 70144, 2804, 2210, 0.1627),
    findings: [
      {
        category: "security",
        severity: "warning",
        file: "src/auth/session.ts",
        existingCode: "const now = Math.floor(Date.now() / 1000);",
        title: "Expiry compares seconds with milliseconds",
        body: "createSession() stores expiresAt in seconds, but isExpired() compares it with a millisecond clock, so the expiry check is wrong.",
        evidence: ["isExpired() uses Date.now() without dividing by 1000"],
      },
      {
        category: "security",
        severity: "warning",
        file: "src/auth/token.ts",
        existingCode: "await endSession(store, token.sessionId);",
        title: "Token stays valid after logout",
        body: "logout() ends the session but the refresh token is never revoked, so it can mint a new session.",
        evidence: [],
      },
    ],
  },
  "performance-1": {
    ms: 48_700,
    steps: 10,
    tools: calls({ read_file: 4, code_search: 3, read_diff: 1, task_done: 1 }),
    usage: usage(61208, 41472, 1540, 1170, 0.0981),
    findings: [],
  },
  "correctness-2": {
    ms: 21_400,
    steps: 5,
    tools: calls({ read_file: 2, read_diff: 1, task_done: 1 }),
    usage: usage(18342, 9216, 611, 402, 0.0214),
    findings: [],
  },
};

function indexed(user, pattern) {
  const out = [];
  for (const m of user.matchAll(pattern))
    out.push({ index: Number(m[1]), title: m[2].trim() });
  return out;
}

const runtime = {
  name: "scripted",
  async *runTask(spec, signal) {
    const task = TASKS[spec.taskId];
    if (!task) throw new Error(`no script for ${spec.taskId}`);
    yield {
      type: "progress",
      taskId: spec.taskId,
      message: `reviewing with ${MODEL}`,
    };
    await sleep(task.ms, signal);
    yield { type: "usage", taskId: spec.taskId, ...task.usage };
    const { inputTokens, outputTokens, reasoningTokens, costUsd } = task.usage;
    yield {
      type: "progress",
      taskId: spec.taskId,
      message: `${MODEL}: ${task.steps} step(s), ${toolSummary(task.tools)}, ${inputTokens} in / ${outputTokens} out / ${reasoningTokens} reasoning tokens, $${costUsd.toFixed(4)}`,
    };
    for (const finding of task.findings)
      yield { type: "finding", taskId: spec.taskId, finding };
    yield { type: "done", taskId: spec.taskId };
  },
  async complete(request, signal) {
    if (request.tier === "light") {
      await sleep(2_400, signal);
      const files = [...request.user.matchAll(/^\[(\d+)\] \S+ (\S+)/gm)].map(
        (m) => ({
          i: Number(m[1]),
          path: m[2],
        }),
      );
      const answer = [
        {
          label: "auth code",
          files: files.filter((f) => f.path.startsWith("src/")).map((f) => f.i),
        },
        {
          label: "docs",
          files: files
            .filter((f) => !f.path.startsWith("src/"))
            .map((f) => f.i),
        },
      ].filter((g) => g.files.length > 0);
      return {
        text: JSON.stringify(answer),
        usage: usage(1830, 0, 64, 0, 0.0002),
      };
    }
    if (!request.system.includes("judge of a multi-agent code review")) {
      await sleep(6_100, signal);
      const titles = [...request.user.matchAll(/^Title: (.*)$/gm)].map((m) =>
        m[1].trim(),
      );
      const answer = titles.map((title, index) =>
        title === "Token stays valid after logout"
          ? {
              index,
              verdict: "refuted",
              reason:
                "logout() deletes token:<value> right after ending the session.",
            }
          : {
              index,
              verdict: "confirmed",
              reason:
                "isExpired() compares a seconds value with Date.now() in milliseconds.",
            },
      );
      return {
        text: JSON.stringify(answer),
        usage: usage(5210, 0, 186, 431, 0.0041),
      };
    }
    await sleep(7_300, signal);
    const found = indexed(request.user, /index="(\d+)"[^\n]*\n(.*)/g);
    const critical = found.find(
      (f) => f.title === "Every session is treated as expired",
    );
    const twin = found.find(
      (f) => f.title === "Expiry compares seconds with milliseconds",
    );
    return {
      text: JSON.stringify({
        duplicates: critical && twin ? [[critical.index, twin.index]] : [],
        drop: [],
        severity: [],
        summary:
          "The change adds session expiry and logout, but isExpired() mixes seconds and milliseconds, so every session is treated as expired and users are logged out right after signing in. Fix the unit mismatch before merging.",
      }),
      usage: usage(3960, 0, 318, 887, 0.0183),
    };
  },
};

export default {
  name: "demo-scripted-runtime",
  configure(ctx) {
    ctx.registerRuntime("scripted", () => runtime);
  },
};
