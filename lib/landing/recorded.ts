// The recording itself (scripts/demo-video), read once at build time. Every
// code line the page shows is read from it here, and the example run's data
// (example-run.ts) is checked against it: this module throws, failing
// `next build` and showing in development, unless every check holds. Server
// only: it reads files.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { exampleRun, terminalLines } from "./example-run";

const DEMO = join(process.cwd(), "scripts/demo-video");
const read = (path: string) => readFileSync(join(DEMO, path), "utf8");
const lines = (text: string) => text.replace(/\n$/, "").split("\n");

function check(condition: unknown, message: string): asserts condition {
  if (!condition)
    throw new Error(`recorded.ts: the example run disagrees with the recording: ${message}`);
}

function filesUnder(root: string, dir = root): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(root, path) : [relative(root, path)];
  });
}

// A line diff by longest common subsequence: the head lines (1-based) that
// are not in it were added, the base lines that are not were deleted.
function lineDiff(base: readonly string[], head: readonly string[]) {
  const table = Array.from({ length: base.length + 1 }, () =>
    new Array<number>(head.length + 1).fill(0),
  );
  const at = (i: number, j: number) => table[i]?.[j] ?? 0;
  for (let i = base.length - 1; i >= 0; i--) {
    for (let j = head.length - 1; j >= 0; j--) {
      const row = table[i];
      if (!row) continue;
      row[j] = base[i] === head[j] ? at(i + 1, j + 1) + 1 : Math.max(at(i + 1, j), at(i, j + 1));
    }
  }
  const added: number[] = [];
  const deleted: number[] = [];
  let i = 0;
  let j = 0;
  while (i < base.length || j < head.length) {
    if (i < base.length && j < head.length && base[i] === head[j]) {
      i++;
      j++;
    } else if (j < head.length && (i === base.length || at(i, j + 1) >= at(i + 1, j))) {
      added.push(++j);
    } else {
      deleted.push(++i);
    }
  }
  return { added, deleted };
}

const head = new Map<string, readonly string[]>();

// The head revision's lines of a changed file, memoised.
export function recordedLines(path: string): readonly string[] {
  let found = head.get(path);
  if (!found) {
    found = lines(read(`repo/head/${path}`));
    head.set(path, found);
  }
  return found;
}

// One line of the head revision, 1-based; out of range throws.
export function recordedLine(path: string, n: number): string {
  const line = recordedLines(path)[n - 1];
  if (line === undefined) throw new Error(`recorded.ts: ${path} has no line ${n}`);
  return line;
}

const { finding, diff, pr, files, usage, calls, tasks, claims, outcome } = exampleRun;
const transcript = (() => {
  const js = read("transcript.js");
  const json = JSON.parse(js.slice(js.indexOf("{"), js.lastIndexOf("}") + 1)) as {
    lines: { text: string }[];
  };
  return json.lines.map((line) => line.text);
})();
const runtime = read("scripted-runtime.mjs");
const buildRepo = read("build-repo.sh");

// 1. The quoted line, and where the suggestion inserts.
const quoted = recordedLine(finding.path, finding.line);
check(quoted.trim() === finding.quote, `line ${finding.line} is not the quote`);
check(
  quoted.split(finding.insertAfter).length === 2,
  "insertAfter is not on the line exactly once",
);

// 2. The suggestion is the quote with the insert.
check(
  finding.suggestion ===
    finding.quote.replace(finding.insertAfter, finding.insertAfter + finding.insert),
  "the suggestion is not the quote with the insert",
);

// 3. The diff, computed.
const computed = lineDiff(lines(read(`repo/base/${diff.path}`)), recordedLines(diff.path));
check(computed.added.join() === diff.added.join(), `added lines are ${computed.added.join()}`);
check(diff.additions === diff.added.length, "additions is not the number of added lines");
check(diff.deletions === computed.deleted.length, `${computed.deleted.length} lines were deleted`);
const hunk = /^@@ -(\d+),(\d+) \+(\d+),(\d+) @@$/.exec(diff.hunk);
check(hunk, "the hunk header does not parse");
const [oldStart, oldCount, newStart, newCount] = hunk.slice(1).map(Number) as [
  number,
  number,
  number,
  number,
];
const baseLength = lines(read(`repo/base/${diff.path}`)).length;
const firstChange = Math.min(computed.added[0] ?? Infinity, computed.deleted[0] ?? Infinity);
check(
  oldStart === newStart && newStart === firstChange - 3,
  "the hunk does not start 3 lines before the first change",
);
check(oldStart + oldCount - 1 === baseLength, "the old range does not end at the base's last line");
check(
  newStart + newCount - 1 === recordedLines(diff.path).length,
  "the new range does not end at the head's last line",
);
for (const n of exampleRun.heroRows)
  check((diff.added as readonly number[]).includes(n), `hero row ${n} is not added`);

// 4. The changed files and the commit.
const selected = files.filter((f) => f.selected).map((f) => f.path);
const headFiles = filesUnder(join(DEMO, "repo/head")).sort();
check(headFiles.join() === [...selected].sort().join(), `head/ holds ${headFiles.join()}`);
for (const path of selected) {
  const base = (() => {
    try {
      return read(`repo/base/${path}`);
    } catch {
      return undefined;
    }
  })();
  check(base !== read(`repo/head/${path}`), `${path} does not change`);
}
const afterSwitch = buildRepo.slice(buildRepo.indexOf(`git switch -q -c ${pr.head}`));
check(afterSwitch.length < buildRepo.length, `build-repo.sh never switches to ${pr.head}`);
check(/> package-lock\.json/.test(afterSwitch), "the head branch does not write package-lock.json");
check(
  files.some((f) => f.path === "package-lock.json" && !f.selected),
  "package-lock.json is not set aside",
);
check(buildRepo.includes(`-m "${pr.title}"`), "the commit title differs");
check(files.length === exampleRun.changedFiles, "changedFiles is not the number of files");

// 5. Terminal lines are transcript lines.
for (const [block] of terminalLines) {
  for (const line of block.split("\n")) {
    if (line === "⋮" || line.trim() === "" || line.startsWith("$ ")) continue;
    check(
      transcript.some((t) => t.trimEnd() === line.trimEnd()),
      `terminal line not in the transcript: ${line}`,
    );
  }
}
check(
  transcript.some((t) => t.trim() === finding.body),
  "the finding's body is not the transcript's",
);
check(
  transcript.some(
    (t) =>
      t.includes(`L${finding.line} `) &&
      t.includes(`${finding.title} [verified] #${finding.fingerprint}`),
  ),
  "the finding's line, title or fingerprint differs",
);

// 6. Tokens, dollars, tasks and bundles.
const money = (n: number) => `$${n.toFixed(4)}`;
check(
  transcript.includes(
    `1 finding(s) (1 critical, 0 warning, 0 suggestion) · tokens: ${usage.input} in (${usage.cached} cached), ${usage.output} out, ${usage.reasoning} reasoning · ${money(usage.dollars)}`,
  ),
  "usage differs from the transcript's totals",
);
for (const task of tasks) {
  check(
    transcript.includes(
      `[ocra] ${task.id} completed in ${task.seconds}s · ${task.findings} finding(s)`,
    ),
    `${task.id}'s time or findings differ`,
  );
  check(
    transcript.some(
      (t) =>
        t.startsWith(`[ocra] ${task.id} `) &&
        t.includes(`: ${task.steps} step(s), ${task.toolCalls} tool call(s) (`),
    ),
    `${task.id}'s steps or tool calls differ`,
  );
  check(
    transcript.some((t) => t.startsWith(`[ocra] ${task.id} started: ${task.bundle} (`)),
    `${task.id}'s bundle differs`,
  );
}
for (const bundle of exampleRun.bundles) {
  check(
    transcript.some((t) => t.includes(`started: ${bundle.label} (`)),
    `no task started on ${bundle.label}`,
  );
}
for (const call of calls) {
  check(
    runtime.includes(
      `usage(${call.input}, ${call.cached}, ${call.output}, ${call.reasoning}, ${call.dollars})`,
    ),
    `${call.id}'s usage is not the scripted runtime's`,
  );
  if (call.role !== "review") continue;
  check(
    transcript.some(
      (t) =>
        t.startsWith(`[ocra] ${call.id} ${call.model}: `) &&
        t.endsWith(
          `${call.input} in / ${call.output} out / ${call.reasoning} reasoning tokens, ${money(call.dollars)}`,
        ),
    ),
    `${call.id}'s tokens or dollars differ from the transcript`,
  );
}

// 7. Claims, the memory, and the evidence rows.
for (const claim of claims)
  check(runtime.includes(`title: "${claim.title}"`), `claim "${claim.title}" is not scripted`);
const token = claims.find((c) => c.id === "token");
check(
  token && "reason" in token && runtime.includes(token.reason),
  "the disproved claim's reason is not scripted",
);
const memory = JSON.parse(read("repo/memory.json")) as { accepted: { title: string }[] };
check(
  claims.find((c) => c.outcome === "remembered")?.title === memory.accepted[0]?.title,
  "the remembered claim is not the repository's memory",
);
const line16 = recordedLine(diff.path, 16).trim();
const line21 = recordedLine(diff.path, 21).trim();
check(runtime.includes(`existingCode: "${line16}"`), "line 16 is not the twin claim's quote");
const now = /^const now = (.+);$/.exec(line16)?.[1];
const expires = /^expiresAt: now \+ (\w+),$/.exec(line21)?.[1];
check(
  now && expires && runtime.includes(`expiresAt to ${now} + ${expires}`),
  "line 21 is not the critical claim's evidence",
);

// 8. The outcome counts the claims.
const count = (o: string) => claims.filter((c) => c.outcome === o).length;
check(outcome.reported === count("confirmed"), "reported is not the confirmed claims");
check(outcome.remembered === count("remembered"), "remembered differs");
check(outcome.merged === count("merged"), "merged differs");
check(outcome.disproved === count("disproved"), "disproved differs");

// 9. The tools the agents called.
const called = new Set(
  transcript.flatMap((t) => {
    const list = /tool call\(s\) \(([^)]*)\)/.exec(t)?.[1];
    return list ? list.split(", ").map((entry) => entry.replace(/ \d+$/, "")) : [];
  }),
);
check(
  [...called].sort().join() === [...exampleRun.toolsCalled].sort().join(),
  `the agents called ${[...called].join(", ")}`,
);

// Whether line n of a changed file is one the change added.
export function isAdded(path: string, n: number): boolean {
  if (path !== diff.path) throw new Error(`recorded.ts: no diff recorded for ${path}`);
  return (diff.added as readonly number[]).includes(n);
}
