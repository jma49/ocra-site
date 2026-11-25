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
    body: "File selection, bundling, line anchoring, and the final verdict are deterministic, tested code. Models handle judgment—reviewing, verifying, and judging—and every response passes schema validation before moving on.",
    steps: {
      select: {
        label: "01 · select",
        lines: ["Only the files", "worth reading"],
        body: "Binaries, lock files, generated output, and suspected secrets are filtered out before spending a cent on models—each with a logged reason.",
      },
      bundle: {
        label: "02 · bundle",
        lines: ["One task per group", "and reviewer"],
        body: "Related files are clustered into coherent bundles, and a tested planner assigns the right reviewers. Correctness always runs; security and performance skip docs.",
      },
      review: {
        label: "03 · review",
        lines: ["Findings quote", "the code they mean"],
        body: `Each task runs an isolated, read-only agent with no shell on the exact revision, capped at ${MAX_AGENT_STEPS} steps. Every finding anchors to verbatim code—never a guessed line number.`,
      },
      verify: {
        label: "04 · verify",
        lines: ["A second read", "before any comment"],
        body: "A dedicated verifier discards anything the source disproves, a judge merges duplicate root causes and calibrates severity, and deterministic code computes the verdict.",
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
    body: "选文件、分组、行号锚定与最终结论，全是有测试保障的确定性代码。模型只做需要判断的事——审查、核查与裁决——每次输出都先通过 schema 校验才进入下一步。",
    steps: {
      select: {
        label: "01 · 选择",
        lines: ["只读", "值得读的文件"],
        body: "二进制、锁文件、生成代码与疑似密钥在花一分钱调用模型前就被自动过滤，每一项都记明原因。",
      },
      bundle: {
        label: "02 · 分组",
        lines: ["每个分组、每位审查员", "一个任务"],
        body: "相关文件自动聚成上下文完整的分组，由经过测试的规划器精准指派审查员。correctness 始终运行；security 与 performance 自动跳过文档。",
      },
      review: {
        label: "03 · 审查",
        lines: ["每条意见", "都引用它所指的代码"],
        body: `每个任务都是隔离的只读 agent：无 shell、锁定准确版本、最多执行 ${MAX_AGENT_STEPS} 步。每条意见按原样代码精确定位，从不由模型凭空编造行号。`,
      },
      verify: {
        label: "04 · 核查",
        lines: ["评论之前，", "再读一遍"],
        body: "独立核查员剔除被源码证伪的意见，裁决员合并同一根因并校准级别，最终结论由确定性代码算出。",
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
