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
        title: "Every call shows its bill",
        body: "Tokens and dollars per task, helpers included. Set `maxCostUsd` and a run stops near it, keeps what it found, and says what it left unreviewed.",
      },
      {
        title: "Your team's rules, in the repository",
        body: "Rules in `.ocra/rules.json`, learnings in `.ocra/learnings/`, read from the base branch.",
      },
      {
        title: "When a model falls over, the next takes the task",
        body: "Each tier can name several models; one out of quota is dropped for the rest of the run.",
      },
      {
        title: "Checked against what the change was for",
        body: "Reviewers read the issues it closes. Pre-merge checks written as sentences pass or fail with a reason.",
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
        title: "每次调用都有账单",
        body: "每个任务的 token 和花费，连辅助调用也算在内。设置 `maxCostUsd` 后，运行会在接近上限时停下，保留已有的发现，并说明哪些没审完。",
      },
      {
        title: "团队的规则放在仓库里",
        body: "规则在 `.ocra/rules.json`，learnings 在 `.ocra/learnings/`，都从目标分支读取。",
      },
      {
        title: "一个模型倒下，下一个接手",
        body: "每一档可以列出多个模型；额度用尽的那个在本次运行中不再使用。",
      },
      {
        title: "对照改动的初衷来检查",
        body: "审查员会读这次改动关闭的 issue。用一句话写成的合并前检查，通过或不通过都会给出理由。",
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
