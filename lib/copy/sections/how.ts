import { MAX_AGENT_STEPS } from "@/lib/landing/engine-facts";
import type { Bilingual, FromRun, Lines } from "../define";

// How it works: four panels that stack as the page scrolls, each with the
// recorded run's own files, tasks, tool calls and claims as its picture.
// File names, reviewer names, task ids and tool names are identifiers and
// come from the run; the words around them are copy.

type StepId = "select" | "bundle" | "review" | "verify";
type ClaimOutcome = "confirmed" | "remembered" | "merged" | "disproved";

interface HowCopy {
  lines: Lines;
  body: string;
  steps: Record<StepId, { label: string; lines: Lines; body: string }>;
  generated: string;
  files: { one: string; other: string };
  skipped: string;
  tasks: FromRun;
  stepCount: string;
  outcomes: Record<ClaimOutcome, string>;
  severity: { critical: string; warning: string };
}

export const how: Bilingual<HowCopy> = {
  en: {
    lines: ["A model answers,", "code checks the answer"],
    body: "Selection, bundling, anchoring and the verdict are tested code. Models only review, verify and judge, and every answer is checked against a schema before it moves on.",
    steps: {
      select: {
        label: "01 · select",
        lines: ["Only the files", "worth reading"],
        body: "Binaries, lock files, generated code and likely secrets are set aside before any model is paid, each with a recorded reason.",
      },
      bundle: {
        label: "02 · bundle",
        lines: ["One task per group", "and reviewer"],
        body: "Related files are grouped, and a tested planner decides which reviewer reads which group. Correctness always runs; security and performance skip docs.",
      },
      review: {
        label: "03 · review",
        lines: ["Findings quote", "the code they mean"],
        body: `Each task is an isolated agent with read-only tools and no shell, on the exact revision, ${MAX_AGENT_STEPS} steps at most. A finding is anchored by the code it quotes.`,
      },
      verify: {
        label: "04 · verify",
        lines: ["A second read", "before any comment"],
        body: "A verifier drops what the code disproves, a judge merges duplicates and sets severity, and code, not a model, computes the verdict.",
      },
    },
    generated: "generated",
    files: { one: "1 file", other: "{n} files" },
    skipped: "skipped",
    tasks: (run) => `${run.tasks.length} tasks · listed before a model is paid`,
    stepCount: "{n} steps",
    outcomes: {
      confirmed: "reported",
      remembered: "remembered",
      merged: "merged",
      disproved: "disproved",
    },
    severity: { critical: "Critical", warning: "Warning" },
  },
  zh: {
    lines: ["模型给出回答，", "代码检查回答"],
    body: "选文件、分组、定位和最终结论都是经过测试的代码。模型只负责审查、核查和裁决，每个回答进入下一步之前都要通过 schema 校验。",
    steps: {
      select: {
        label: "01 · 选择",
        lines: ["只读", "值得读的文件"],
        body: "二进制、锁文件、生成的代码和疑似密钥，在付费调用模型之前就被剔除，每一项都记录原因。",
      },
      bundle: {
        label: "02 · 分组",
        lines: ["每个分组、每位审查员", "一个任务"],
        body: "相关的文件分到一组，由经过测试的规划器决定哪位审查员读哪一组。correctness 总会运行；security 和 performance 跳过文档。",
      },
      review: {
        label: "03 · 审查",
        lines: ["每条意见", "都引用它所指的代码"],
        body: `每个任务是一个隔离的 agent：只读工具、没有 shell、在确切的版本上运行，最多 ${MAX_AGENT_STEPS} 步。一条意见靠它引用的代码定位。`,
      },
      verify: {
        label: "04 · 核查",
        lines: ["评论之前，", "再读一遍"],
        body: "核查员丢掉代码能证伪的意见，裁判合并重复项并定级，最终结论由代码而不是模型算出。",
      },
    },
    generated: "生成文件",
    files: { one: "1 个文件", other: "{n} 个文件" },
    skipped: "跳过",
    tasks: (run) => `${run.tasks.length} 个任务 · 在付费调用模型之前列出`,
    stepCount: "{n} 步",
    outcomes: { confirmed: "报告", remembered: "记下", merged: "合并", disproved: "驳回" },
    severity: { critical: "Critical", warning: "Warning" },
  },
};
