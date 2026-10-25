import { MAX_AGENT_STEPS } from "@/lib/landing/engine-facts";
import { formatCount } from "@/lib/landing/example-run";
import type { Bilingual, FromRun, Lines } from "../define";

// The story's five chapters, one per scrubber stop.
export type ChapterId = "select" | "bundle" | "review" | "verify" | "comment";
type StageKind = "code" | "model";

// A scrubber stop: the run's figure with its words, in the language's order.
interface Stop {
  before?: string;
  n: FromRun;
  after?: string;
}

interface HowCopy {
  label: string;
  lines: Lines;
  body: string;
  legend: Record<StageKind, string>;
  chapters: Record<
    ChapterId,
    // zh titles mark where a line may break (U+200B; 30-how.css keeps the
    // phrases whole), so a narrow column never splits a word.
    { title: string; stages: { name: string; kind: StageKind }[]; text: string }
  >;
  stops: Record<ChapterId, Stop>;
  // Under the story: what the desk replays.
  note: { label: string; run: FromRun };
  // What the desk shows, for screen readers (the desk itself is hidden).
  summary: readonly FromRun[];
  // Typed on the desk and its paper.
  desk: {
    page: string;
    setAside: string;
    bundle: FromRun;
    docs: FromRun;
    skip: string;
    outcomes: { confirmed: string; remembered: string; merged: string; disproved: string };
    calls: FromRun;
    tokens: FromRun;
    output: FromRun;
    total: string;
  };
  // Glosses under the English claim titles; empty (not rendered) in en.
  claimGloss: { expired: string; user: string; twin: string; token: string };
}

const n = formatCount;

export const how: Bilingual<HowCopy> = {
  en: {
    label: "How it works",
    lines: ["A model answers.", "Code checks the answer."],
    body: "Selection, bundling, anchoring and the verdict are tested code. A model is asked to group files, review, verify and judge, and every answer is checked against a schema before it moves on.",
    legend: { code: "code, deterministic", model: "model, judgment" },
    chapters: {
      select: {
        title: "Only the files worth reading",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "Binaries, lock files, generated code and likely secrets are set aside, each with a recorded reason. Sensitive paths such as auth/ or CI workflows make the change full tier.",
      },
      bundle: {
        title: "One task per group and reviewer",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "A light model groups files that belong together. Correctness always runs; security and performance skip docs and tests. `--plan` lists every task before a model is paid.",
      },
      review: {
        title: "Findings quote the code they mean",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: `An isolated agent reads the exact revision with read-only tools and stops after ${MAX_AGENT_STEPS} steps. It quotes the code; ocra finds the quote in the diff and pins the comment there. The model never picks the line.`,
      },
      verify: {
        title: "Only what holds up on a second read",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "A verifier drops what the code disproves. A judge merges the same root cause, but can never drop a confirmed critical. The verdict is computed in code.",
      },
      comment: {
        title: "One comment, and the bill",
        stages: [
          { name: "comment", kind: "code" },
          { name: "usage", kind: "code" },
        ],
        text: "The finding lands on the line it quotes, with the fix it suggests. Tokens and dollars are counted for every model call, helpers included.",
      },
    },
    stops: {
      select: { n: (run) => String(run.files.length), after: "files" },
      bundle: { n: (run) => String(run.tasks.length), after: "tasks" },
      review: { before: "line", n: (run) => String(run.finding.line) },
      verify: { n: (run) => String(run.outcome.reported), after: "reported" },
      comment: { n: (run) => `$${run.usage.dollars.toFixed(4)}` },
    },
    note: {
      label: "Example run",
      run: (run) => `${run.command} · pull request #${run.pr.number}`,
    },
    summary: [
      (run) =>
        `In the example run ${run.files.length} files changed. package-lock.json was set aside as generated; docs/auth.md was read for correctness only; src/api/login.ts, src/auth/token.ts and src/auth/session.ts were read as auth code, at full tier.`,
      (run) =>
        `${run.bundles.length} bundles gave ${run.tasks.length} tasks: ${run.tasks.map((t) => t.id).join(", ")}.`,
      (run) =>
        `The agents reported ${run.claims.length} candidate findings. "${run.finding.title}" quoted line ${run.finding.line} of ${run.finding.path} and was confirmed as ${run.finding.severity}; "Expiry compares seconds with milliseconds" was merged into it; "user may be undefined" matched the repository's memory and was not reported; "Token stays valid after logout" was disproved by the code.`,
      (run) =>
        `The run made ${run.calls.length} model calls: ${n(run.usage.input)} input tokens, ${n(run.usage.cached)} of them cached, ${n(run.usage.output)} output and ${n(run.usage.reasoning)} reasoning tokens, $${run.usage.dollars.toFixed(4)} in total.`,
    ],
    desk: {
      page: "page 2 of 2",
      setAside: "set aside · generated",
      bundle: (run) => `${run.bundles[0].label} · ${run.bundles[0].files.length} files`,
      docs: (run) => `${run.bundles[1].label} · ${run.bundles[1].files.length} file`,
      skip: "skip: docs",
      outcomes: {
        confirmed: "confirmed",
        remembered: "matches the repository's memory · not reported",
        merged: "merged into #1",
        disproved: "disproved by the code",
      },
      calls: (run) => `${run.calls.length} model calls · in ${n(run.usage.input)}`,
      tokens: (run) => `cached ${n(run.usage.cached)} · out ${n(run.usage.output)}`,
      output: (run) => `reasoning ${n(run.usage.reasoning)}`,
      total: "this run",
    },
    claimGloss: { expired: "", user: "", twin: "", token: "" },
  },
  zh: {
    label: "工作原理",
    lines: ["模型作答，", "代码核对。"],
    body: "选文件、分组、定位行号和给出结论，都是有测试的代码。模型只负责分组、审查、核实和裁决，它的每个回答都先通过 schema 校验，才进入下一步。",
    legend: { code: "代码，确定性", model: "模型，需判断" },
    chapters: {
      select: {
        title: "只读​值得读的文件",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "二进制、锁文件、生成的代码和疑似密钥会被搁置，每个都记录原因。涉及 auth/、CI workflow 这类敏感路径的改动直接定为 full 档。",
      },
      bundle: {
        title: "每组、​每个审查员​一个任务",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "由轻量模型把该一起看的文件分成组。correctness 总会运行；security 和 performance 跳过文档和测试。`--plan` 能在调用模型之前列出全部任务。",
      },
      review: {
        title: "每条意见​都引用它说的代码",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: `每个隔离的 agent 用只读工具读取被审查的那个版本，最多执行 ${MAX_AGENT_STEPS} 步。它引用代码，ocra 在 diff 里找到这段引用，把评论钉在那里。行号从来不由模型决定。`,
      },
      verify: {
        title: "只留下​经得起重读的意见",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "核查去掉被代码证伪的意见；judge 合并同一根因，但不能去掉已确认的 critical。结论由代码计算。",
      },
      comment: {
        title: "一条评论，​和账单",
        stages: [
          { name: "comment", kind: "code" },
          { name: "usage", kind: "code" },
        ],
        text: "意见落在它引用的那一行，附上建议的修改。每次模型调用的 token 和费用都会计入，辅助调用也算。",
      },
    },
    stops: {
      select: { n: (run) => String(run.files.length), after: "个文件" },
      bundle: { n: (run) => String(run.tasks.length), after: "个任务" },
      review: { before: "第", n: (run) => String(run.finding.line), after: "行" },
      verify: { before: "报告", n: (run) => String(run.outcome.reported), after: "条" },
      comment: { n: (run) => `$${run.usage.dollars.toFixed(4)}` },
    },
    note: {
      label: "示例运行",
      run: (run) => `${run.command} · pull request #${run.pr.number}`,
    },
    summary: [
      (run) =>
        `示例运行中改动了 ${run.files.length} 个文件。package-lock.json 作为生成文件被搁置；docs/auth.md 只做 correctness 审查；src/api/login.ts、src/auth/token.ts 和 src/auth/session.ts 作为 auth 代码，按 full 档审查。`,
      (run) =>
        `${run.bundles.length} 个 bundle 产生 ${run.tasks.length} 个任务：${run.tasks.map((t) => t.id).join("、")}。`,
      (run) =>
        `agent 报告了 ${run.claims.length} 条候选意见。“${run.finding.title}”引用了 ${run.finding.path} 第 ${run.finding.line} 行，被确认为 ${run.finding.severity}；“Expiry compares seconds with milliseconds”并入了它；“user may be undefined”与仓库记忆一致，不报告；“Token stays valid after logout”被代码证伪。`,
      (run) =>
        `这次运行调用了 ${run.calls.length} 次模型：输入 ${n(run.usage.input)} 个 token（其中 ${n(run.usage.cached)} 个命中缓存），输出 ${n(run.usage.output)} 个，推理 ${n(run.usage.reasoning)} 个，合计 $${run.usage.dollars.toFixed(4)}。`,
    ],
    desk: {
      page: "第 2 页，共 2 页",
      setAside: "已搁置 · 生成文件",
      bundle: (run) => `${run.bundles[0].label} · ${run.bundles[0].files.length} 个文件`,
      docs: (run) => `${run.bundles[1].label} · ${run.bundles[1].files.length} 个文件`,
      skip: "跳过：文档",
      outcomes: {
        confirmed: "已确认",
        remembered: "与仓库记忆一致 · 不报告",
        merged: "并入 #1",
        disproved: "被代码证伪",
      },
      calls: (run) => `${run.calls.length} 次模型调用 · 输入 ${n(run.usage.input)}`,
      tokens: (run) => `缓存 ${n(run.usage.cached)} · 输出 ${n(run.usage.output)}`,
      output: (run) => `推理 ${n(run.usage.reasoning)}`,
      total: "本次运行",
    },
    claimGloss: {
      expired: "每个会话都被当成已过期",
      user: "user 可能是 undefined",
      twin: "过期判断拿秒和毫秒比较",
      token: "登出后 token 仍然有效",
    },
  },
};
