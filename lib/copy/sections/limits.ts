import type { Bilingual, FromRun, Lines } from "../define";

// Your model, your limits: four promises about cost, rules and models, with
// the recorded run's bill as the picture. Inline `code` in a body is set in
// the code face.
interface LimitsCopy {
  lines: Lines;
  rows: { title: string; body: string }[];
  bill: {
    label: FromRun;
    example: string;
    total: string;
    task: string;
    input: string;
    cost: string;
    helpers: string;
    note: string;
  };
}

export const limits: Bilingual<LimitsCopy> = {
  en: {
    lines: ["Your model,", "your limits"],
    rows: [
      {
        title: "Every call shows its exact bill",
        body: "Tokens and dollars itemized per task, helper calls included. Set `maxCostUsd` and a run stops cleanly near your cap—preserving confirmed findings and reporting what remains unreviewed.",
      },
      {
        title: "Your team's rules, right in the repo",
        body: "Keep review rules in `.ocra/rules.json` and institutional memory in `.ocra/learnings/`, always read from the base branch.",
      },
      {
        title: "When one model stalls, the next takes over",
        body: "Configure ordered model chains per tier; an out-of-quota model is tripped off for the rest of the run.",
      },
      {
        title: "Reviewed against what the change was meant to do",
        body: "Reviewers read linked issues for intent. Plain-language pre-merge checks return pass or fail with concrete evidence.",
      },
    ],
    bill: {
      label: (run) => `${run.repo.replace("~/", "")} · pull request #${run.pr.number}`,
      example: "example run",
      total: "Run total",
      task: "Task",
      input: "Input tokens",
      cost: "Cost",
      helpers: "grouping, verification ×2, judge",
      note: "This example run's bill, not a typical one",
    },
  },
  zh: {
    lines: ["你的模型，", "你的上限"],
    rows: [
      {
        title: "每次调用都列出精确账单",
        body: "按任务逐项记录 token 与花费，辅助调用一并计入。设好 `maxCostUsd`，运行在接近上限时优雅停下，保留已确认发现并注明未审部分。",
      },
      {
        title: "团队规则，直接留在仓库里",
        body: "审查规则存于 `.ocra/rules.json`，团队沉淀存于 `.ocra/learnings/`，始终从目标分支读取。",
      },
      {
        title: "一个模型受阻，下一个无缝接棒",
        body: "每一档都可配置有序模型链；额度耗尽的模型自动熔断，本次运行不再重试。",
      },
      {
        title: "对照改动的真实意图来审查",
        body: "审查员会阅读关联 issue 把握上下文。自然语言写的合并前检查，逐条给出通过与否及明确依据。",
      },
    ],
    bill: {
      label: (run) => `${run.repo.replace("~/", "")} · PR #${run.pr.number}`,
      example: "示例运行",
      total: "本次合计",
      task: "任务",
      input: "输入 token",
      cost: "花费",
      helpers: "分组、核查 ×2、裁判",
      note: "这是示例运行的账单，不代表典型花费",
    },
  },
};
