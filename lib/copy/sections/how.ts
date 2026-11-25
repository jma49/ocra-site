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
    body: "Tested code selects files, assigns reviewers, anchors findings, and computes the verdict. Models review, verify, and judge findings. On larger changes a light model can also group related files.",
    steps: {
      select: {
        label: "01 · select",
        lines: ["Only the files", "worth reading"],
        body: "Binaries, lock files, generated output, and suspected secrets are filtered out before spending a cent on models—each with a logged reason.",
      },
      bundle: {
        label: "02 · bundle",
        lines: ["Match reviewers", "to related files"],
        body: "After grouping, the planner assigns reviewers. Docs and AGENTS.md reviewers can read across the change; security and performance can review neighboring bundles together.",
      },
      review: {
        label: "03 · review",
        lines: ["Findings quote", "the code they mean"],
        body: `Each task runs an isolated, read-only agent with no shell on the exact revision. Review attempts have a cap of ${MAX_AGENT_STEPS} steps on OpenCode and direct, or tool calls on Codex. Code resolves quoted findings to lines.`,
      },
      verify: {
        label: "04 · verify",
        lines: ["A second read", "against the code"],
        body: "The verifier drops what the code disproves, without treating doubt as confirmation. A judge merges duplicate root causes and calibrates severity before code computes the verdict.",
      },
    },
    generated: "generated",
    files: { one: "1 file", other: "{n} files" },
    skipped: "skipped",
    tasks: (run) => `${run.tasks.length} planned review tasks`,
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
    body: "经过测试的代码负责选文件、分派审查员、定位问题和计算结论。模型负责审查、核查和裁决；改动较大时，也可用轻量模型给相关文件分组。",
    steps: {
      select: {
        label: "01 · 选择",
        lines: ["只读", "值得读的文件"],
        body: "二进制、锁文件、生成代码与疑似密钥在花一分钱调用模型前就被自动过滤，每一项都记明原因。",
      },
      bundle: {
        label: "02 · 分组",
        lines: ["按文件分组", "分派审查员"],
        body: "分组后由规划器分派审查员。文档和 AGENTS.md 审查员可以查看整个改动，安全与性能审查员可以把相邻分组放在一起审查。",
      },
      review: {
        label: "03 · 审查",
        lines: ["每条意见", "都引用它所指的代码"],
        body: `每个任务由隔离的只读 agent 审查准确版本，不提供 shell。OpenCode 和 direct 每次尝试最多 ${MAX_AGENT_STEPS} 步，Codex 按工具调用次数计。代码根据引用定位行号。`,
      },
      verify: {
        label: "04 · 核查",
        lines: ["对照代码，", "再读一遍"],
        body: "核查员剔除被源码证伪的意见，不把存疑当成确认。裁决员合并根因相同的意见并校准级别，最终由代码计算结论。",
      },
    },
    generated: "生成文件",
    files: { one: "1 个文件", other: "{n} 个文件" },
    skipped: "跳过",
    tasks: (run) => `${run.tasks.length} 个计划审查任务`,
    stepCount: "{n} 步",
    outcomes: { confirmed: "报告", remembered: "记下", merged: "合并", disproved: "驳回" },
    severity: { critical: "Critical", warning: "Warning" },
  },
};
