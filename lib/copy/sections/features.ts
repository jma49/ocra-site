import type { Bilingual, FromRun, Lines } from "../define";

interface Item {
  title: string;
  body: string;
}

interface FeaturesCopy {
  eyebrow: string;
  lines: Lines;
  // The bill leads; the sheet beside the list is its printout.
  bill: Item;
  rules: Item;
  fallback: Item;
  // The example run's bill, printed (features-bill.tsx): its head, what it
  // lists, the columns, the helper calls' row, and the token footnote the
  // CLI prints under it. The pen writes the total; `total` names it for
  // assistive tech.
  sheet: {
    head: FromRun;
    tag: string;
    caption: string;
    cols: { task: string; input: string; cost: string };
    helpers: string;
    total: string;
    foot: readonly [FromRun, FromRun];
    note: string;
  };
}

const n = (v: number) => v.toLocaleString("en-US");

export const features: Bilingual<FeaturesCopy> = {
  en: {
    eyebrow: "Features",
    lines: ["You set", "the limits."],
    bill: {
      title: "Every attempt shows its bill",
      body: "Tokens and dollars per task, helpers included. Set `maxCostUsd` and a run stops near that limit, keeping what it found.",
    },
    rules: {
      title: "Your team's rules, without writing a plugin",
      body: "Put review rules in `.ocra/rules.json` on the base branch. For local reviews, plugins can add rules, reviewers, tools and listeners through one small contract.",
    },
    fallback: {
      title: "When a model falls over, the next takes the task",
      body: "Each tier can list several models. Overloads move on; a model out of quota is dropped for the rest of the run.",
    },
    sheet: {
      head: (run) => `acme-api · pull request #${run.pr.number}`,
      tag: "example run",
      caption: "What this review cost, task by task",
      cols: { task: "task", input: "input", cost: "cost" },
      helpers: "grouping, verification ×2, judge",
      total: "Run total",
      foot: [
        (run) => `tokens ${n(run.usage.input)} in (${n(run.usage.cached)} cached)`,
        (run) => `${n(run.usage.output)} out · ${n(run.usage.reasoning)} reasoning`,
      ],
      note: "This example run's bill, not a typical one.",
    },
  },
  zh: {
    eyebrow: "功能",
    lines: ["限度", "由你来定。"],
    bill: {
      title: "每次尝试都有账单",
      body: "每个任务的 token 和花费，辅助调用也算在内。设置 `maxCostUsd`，运行会在接近这个额度时停下，并保留已有的发现。",
    },
    rules: {
      title: "团队规则，不用写插件",
      body: "把审查规则写进基础分支上的 `.ocra/rules.json`。本地审查时，插件还能通过一套很小的接口添加规则、审查员、工具和监听器。",
    },
    fallback: {
      title: "一个模型倒下，下一个接手",
      body: "每一档都可以列出多个模型。过载就换下一个；额度用尽的模型在本次运行中不再使用。",
    },
    sheet: {
      head: (run) => `acme-api · pull request #${run.pr.number}`,
      tag: "示例运行",
      caption: "这次审查的花费，按任务列出",
      cols: { task: "任务", input: "输入", cost: "花费" },
      helpers: "分组、核实 ×2、裁判",
      total: "本次合计",
      foot: [
        (run) => `输入 ${n(run.usage.input)} token（缓存 ${n(run.usage.cached)}）`,
        (run) => `输出 ${n(run.usage.output)} · 推理 ${n(run.usage.reasoning)}`,
      ],
      note: "这是示例运行的账单，不代表一般花费。",
    },
  },
};
