import type { Bilingual, Lines } from "../define";

// The bill's totals as the CLI prints them, and its last line.
export type BillRow = "input" | "cached" | "output" | "reasoning" | "total";

interface ChainStep {
  model: string;
  state: string;
}

interface FeaturesCopy {
  lines: Lines;
  rules: { title: string; body: string };
  bill: {
    title: string;
    body: string;
    rows: Record<BillRow, string>;
    cols: { task: string; bundle: string; share: string; input: string; cost: string };
    helpers: string;
    note: string;
  };
  fallback: {
    title: string;
    body: string;
    // An illustrated chain: each model and what happened to it.
    chain: readonly [ChainStep, ChainStep, ChainStep];
    illustration: string;
  };
}

export const features: Bilingual<FeaturesCopy> = {
  en: {
    lines: ["You set the limits."],
    rules: {
      title: "Your team's rules, without writing a plugin",
      body: "Put review rules in `.ocra/rules.json` on the base branch. For local reviews, plugins can add rules, reviewers, tools and listeners through one small contract.",
    },
    bill: {
      title: "Every attempt shows its bill",
      body: "Tokens and dollars per task, helpers included. Set `maxCostUsd` and a run stops near that limit, keeping what it found.",
      rows: {
        input: "input",
        cached: "cached",
        output: "out",
        reasoning: "reasoning",
        total: "run total",
      },
      cols: {
        task: "task",
        bundle: "bundle",
        share: "share of the run",
        input: "input tokens",
        cost: "cost",
      },
      helpers: "grouping, verification ×2, judge",
      note: "This example run's bill, not a typical one.",
    },
    fallback: {
      title: "When a model falls over, the next takes the task",
      body: "Each tier can list several models. Overloads move on; a model out of quota is dropped for the rest of the run.",
      chain: [
        { model: "model A", state: "overloaded" },
        { model: "model B", state: "out of quota" },
        { model: "model C", state: "reviewing" },
      ],
      illustration: "Illustration",
    },
  },
  zh: {
    lines: ["限度由你来定。"],
    rules: {
      title: "团队规则，不用写插件",
      body: "把审查规则写进基础分支上的 `.ocra/rules.json`。本地审查时，插件还能通过一套很小的接口添加规则、审查员、工具和监听器。",
    },
    bill: {
      title: "每次尝试都有账单",
      body: "每个任务的 token 和花费，辅助调用也算在内。设置 `maxCostUsd`，运行会在接近这个额度时停下，并保留已有的发现。",
      rows: {
        input: "输入",
        cached: "缓存",
        output: "输出",
        reasoning: "推理",
        total: "本次合计",
      },
      cols: {
        task: "任务",
        bundle: "bundle",
        share: "占本次花费",
        input: "输入 token",
        cost: "花费",
      },
      helpers: "分组、核实 ×2、裁判",
      note: "这是示例运行的账单，不代表一般花费。",
    },
    fallback: {
      title: "一个模型倒下，下一个接手",
      body: "每一档都可以列出多个模型。过载就换下一个；额度用尽的模型在本次运行中不再使用。",
      chain: [
        { model: "模型 A", state: "过载" },
        { model: "模型 B", state: "额度用尽" },
        { model: "模型 C", state: "审查中" },
      ],
      illustration: "示意",
    },
  },
};
