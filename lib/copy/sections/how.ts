import { MAX_AGENT_STEPS } from "@/lib/landing/engine-facts";
import type { FileId } from "@/lib/landing/example-run";
import type { Bilingual, FromRun, Lines } from "../define";

export type StepId = "select" | "bundle" | "review" | "verify";
type StageKind = "code" | "model";

interface HowCopy {
  label: string;
  lines: Lines;
  example: string;
  // The chip in every figure's sheet bar.
  exampleChip: string;
  body: string;
  legend: Record<StageKind, string>;
  steps: Record<
    StepId,
    // zh titles mark where a line may break (U+200B; 30-how.css keeps the
    // phrases whole), so a narrow column never splits a word.
    { title: string; stages: { name: string; kind: StageKind }[]; text: string }
  >;
  figures: {
    // fill(pass, { n })
    pass: string;
    meter: string;
    files: FromRun;
    // Why ocra read or set aside each changed file.
    why: Record<FileId, string>;
    tier: string;
    // Under the three tiers: why this change got its tier.
    tierWhy: string;
    tasks: FromRun;
    // fill(bundleFiles[n === 1 ? "one" : "other"], { n })
    bundleFiles: { one: string; other: string };
    task: string;
    // The matrix table's caption and its row-header column (screen readers).
    matrix: string;
    reviewer: string;
    skipDocs: string;
    readOnly: string;
    quotes: string;
    found: string;
    // Under figure 3's anchor methods: what each one tries.
    anchorNote: string;
    planNote: string;
    agentRun: FromRun;
    candidates: FromRun;
    ledger: {
      confirmed: string;
      remembered: string;
      merged: string;
      disproved: string;
      verdict: string;
      critical: FromRun;
    };
    // Glosses under the English claim titles; empty (not rendered) in en.
    claimGloss: { expired: string; user: string; twin: string; token: string };
  };
}

export const how: Bilingual<HowCopy> = {
  en: {
    label: "How it works",
    lines: ["A model answers.", "Code checks the answer."],
    example: "Every figure replays the example run from the top of the page.",
    exampleChip: "Example run",
    body: "Selection, bundling, anchoring and the verdict are tested code. A model is asked to group files, review, verify and judge, and every answer is checked against a schema before it moves on.",
    legend: { code: "deterministic", model: "judgment" },
    steps: {
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
    },
    figures: {
      pass: "{n} of 4",
      meter: "Pipeline stages",
      files: (run) => `${run.files.length} files`,
      why: {
        session: "read · auth code, full tier",
        token: "read · auth code",
        login: "read · auth code",
        docs: "read · docs: correctness only",
        lock: "set aside · generated",
      },
      tier: "Risk tier",
      tierWhy: "The change touches auth/, so it is full; otherwise its size decides.",
      tasks: (run) => `${run.tasks.length} tasks`,
      bundleFiles: { one: "{n} file", other: "{n} files" },
      task: "task",
      matrix: "Review tasks per bundle and reviewer",
      reviewer: "Reviewer",
      skipDocs: "skip: docs",
      readOnly: `read-only · capped at ${MAX_AGENT_STEPS} steps`,
      quotes: "The agent quotes",
      found: "ocra finds it in the diff",
      anchorNote:
        "The changed lines first, then the whole file, the other changed files and a light model's second quote. Failing all, the finding stays on its file.",
      planNote:
        "lists the tasks before any model is paid for. It skips grouping, so it shows one bundle per file.",
      agentRun: (run) => {
        const t = run.tasks[0];
        return `${t.id}: ${t.steps} steps, ${t.toolCalls} tool calls`;
      },
      candidates: (run) => `${run.claims.length} candidates`,
      ledger: {
        confirmed: "confirmed",
        remembered: "matches the repository's memory · not reported",
        merged: "merged into #1",
        disproved: "disproved by the code",
        verdict: "Verdict: significant concerns",
        critical: (run) => `${run.outcome.reported} verified critical`,
      },
      claimGloss: { expired: "", user: "", twin: "", token: "" },
    },
  },
  zh: {
    label: "工作原理",
    lines: ["模型作答，", "代码核对。"],
    example: "每张图都重现页面顶部的示例运行。",
    exampleChip: "示例运行",
    body: "选文件、分组、定位行号和给出结论，都是有测试的代码。模型只负责分组、审查、核实和裁决，它的每个回答都先通过 schema 校验，才进入下一步。",
    legend: { code: "确定性", model: "需判断" },
    steps: {
      select: {
        title: "只读\u200b值得读的文件",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "二进制、锁文件、生成的代码和疑似密钥会被搁置，每个都记录原因。涉及 auth/、CI workflow 这类敏感路径的改动直接定为 full 档。",
      },
      bundle: {
        title: "每组、\u200b每个审查员\u200b一个任务",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "由轻量模型把该一起看的文件分成组。correctness 总会运行；security 和 performance 跳过文档和测试。`--plan` 能在调用模型之前列出全部任务。",
      },
      review: {
        title: "每条意见\u200b都引用它说的代码",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: `每个隔离的 agent 用只读工具读取被审查的那个版本，最多执行 ${MAX_AGENT_STEPS} 步。它引用代码，ocra 在 diff 里找到这段引用，把评论钉在那里。行号从来不由模型决定。`,
      },
      verify: {
        title: "只留下\u200b经得起重读的意见",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "核查去掉被代码证伪的意见；judge 合并同一根因，但不能去掉已确认的 critical。结论由代码计算。",
      },
    },
    figures: {
      pass: "第 {n} 步，共 4 步",
      meter: "流水线阶段",
      files: (run) => `${run.files.length} 个文件`,
      why: {
        session: "已读 · auth 代码，full 档",
        token: "已读 · auth 代码",
        login: "已读 · auth 代码",
        docs: "已读 · 文档：只做 correctness",
        lock: "已搁置 · 生成文件",
      },
      tier: "风险档位",
      tierWhy: "改动涉及 auth/，所以是 full；否则按改动大小决定。",
      tasks: (run) => `${run.tasks.length} 个任务`,
      bundleFiles: { one: "{n} 个文件", other: "{n} 个文件" },
      task: "任务",
      matrix: "每个 bundle 与审查员的审查任务",
      reviewer: "审查员",
      skipDocs: "跳过：文档",
      readOnly: `只读 · 最多 ${MAX_AGENT_STEPS} 步`,
      quotes: "agent 的引用",
      found: "ocra 在 diff 中找到它",
      anchorNote:
        "先找变更的行，再找整个文件、其他变更文件，最后请轻量模型重新引用；都找不到，意见就挂在文件上。",
      planNote: "在付费调用任何模型之前列出任务。它跳过分组，所以每个文件一个 bundle。",
      agentRun: (run) => {
        const t = run.tasks[0];
        return `${t.id}：${t.steps} 步，${t.toolCalls} 次工具调用`;
      },
      candidates: (run) => `${run.claims.length} 条候选意见`,
      ledger: {
        confirmed: "已确认",
        remembered: "与仓库记忆一致 · 不报告",
        merged: "并入 #1",
        disproved: "被代码证伪",
        verdict: "结论：存在重大问题",
        critical: (run) => `${run.outcome.reported} 个已核实的 critical`,
      },
      claimGloss: {
        expired: "每个会话都被当成已过期",
        user: "user 可能是 undefined",
        twin: "过期判断拿秒和毫秒比较",
        token: "登出后 token 仍然有效",
      },
    },
  },
};
