import type { Bilingual, Lines } from "../define";

export type PlanId = "self" | "cloud" | "team";

interface PlansCopy {
  lines: Lines;
  body: string;
  items: Record<
    PlanId,
    {
      state: string;
      name: string;
      price: string;
      unit: string;
      points: string[];
      cta: string;
      planned?: boolean;
    }
  >;
  fine: string;
}

export const plans: Bilingual<PlansCopy> = {
  en: {
    lines: ["Open core.", "Hosted when", "you want it."],
    body: "The engine stays Apache-2.0 and complete without an account. ocra Cloud is free while it is in early access; you bring the model key.",
    items: {
      self: {
        state: "available now",
        name: "Self-hosted",
        price: "Free",
        unit: "Apache-2.0",
        points: [
          "CLI, GitHub Action, GitLab, container image",
          "Your runner and your model key",
          "Only your model provider sees the code",
          "Your own rules, reviewers and plugins",
        ],
        cta: "Read the quickstart",
      },
      cloud: {
        state: "early access",
        name: "ocra Cloud",
        price: "Free",
        unit: "bring your own key",
        points: [
          "Sign in with GitHub; `ocra login` from any machine",
          "Keys for 45 providers, encrypted, checked on save where the provider allows",
          "Usage, spend and review counts by day",
          "Default models chosen once, on the web",
        ],
        cta: "Start with ocra Cloud",
      },
      team: {
        state: "planned",
        name: "Team",
        price: "Later",
        unit: "pricing not set",
        points: [
          "A hosted GitHub App: no workflow, no secrets",
          "Organizations with shared rules and policy",
          "Models provided by ocra, no key needed",
          "Review history per repository",
        ],
        cta: "Follow the roadmap",
        planned: true,
      },
    },
    fine: "With ocra Cloud your change passes through its gateway on the way to your model provider, and the console keeps counts by default; findings and the code they quote only if you turn on findings sharing. If nothing but your provider may see the code, self-host: it is the same engine.",
  },
  zh: {
    lines: ["开源核心，", "需要时", "再托管。"],
    body: "引擎保持 Apache-2.0，不需要账号也完整可用。ocra Cloud 早期体验期间免费，模型 key 由你自带。",
    items: {
      self: {
        state: "现已可用",
        name: "自托管",
        price: "免费",
        unit: "Apache-2.0",
        points: [
          "CLI、GitHub Action、GitLab、容器镜像",
          "你的运行环境，你的模型 key",
          "只有你的模型服务商能看到代码",
          "自定义规则、审查员和插件",
        ],
        cta: "阅读快速上手",
      },
      cloud: {
        state: "早期体验",
        name: "ocra Cloud",
        price: "免费",
        unit: "自带 key",
        points: [
          "用 GitHub 登录；任何机器上 `ocra login`",
          "45 家服务商的 key，加密保存，服务商支持时在保存时校验",
          "按天统计用量、花费和审查次数",
          "在网页上一次选好默认模型",
        ],
        cta: "开始使用 ocra Cloud",
      },
      team: {
        state: "规划中",
        name: "团队版",
        price: "稍后",
        unit: "价格未定",
        points: [
          "托管的 GitHub App：不用 workflow，不用 secret",
          "组织级共享规则和策略",
          "由 ocra 提供模型，不需要 key",
          "按仓库保存审查历史",
        ],
        cta: "关注路线图",
        planned: true,
      },
    },
    fine: "使用 ocra Cloud 时，你的改动会经过它的网关再到达你的模型服务商。控制台默认只保存计数，只有开启发现共享后，才会保存发现及其引用的代码。如果只能让模型服务商看到代码，请自托管：引擎是同一个。",
  },
};
