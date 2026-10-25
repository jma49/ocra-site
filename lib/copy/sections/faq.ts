import { PROVIDERS } from "@/lib/landing/engine-facts";
import type { Bilingual, Lines } from "../define";

// The product's name never breaks across lines in prose: a no-break space
// (written as an escape, so the source stays ASCII).
const CLOUD = "ocra\u00a0Cloud";

interface FaqCopy {
  lines: Lines;
  more: string;
  items: { q: string; a: string }[];
}

export const faq: Bilingual<FaqCopy> = {
  en: {
    lines: ["Questions,", "answered plainly."],
    more: "More answers in the manual",
    items: [
      {
        q: "Is ocra free?",
        a: `The engine, the CLI and the GitHub Action are Apache-2.0 and need no account. You pay your model provider for the tokens a review uses, and every run prints its cost. ${CLOUD} is free during early access.`,
      },
      {
        q: "Who sees my code?",
        a: `Self-hosted, only your model provider: the change with its title and description, your AGENTS.md and review rules, and what the agents open or search in the repository. Never files that look like secrets, or anything outside the repository. With ${CLOUD} the request also passes through its gateway.`,
      },
      {
        q: "Which models does it work with?",
        a: `Any of ${PROVIDERS} providers through ${CLOUD}, any model OpenCode supports, or your own OpenAI-compatible endpoint with a price per model. Each tier can list several models; when one falls over, the next takes the task.`,
      },
      {
        q: "Does it work with GitLab?",
        a: "Yes: merge requests on GitLab.com or self-managed, with the same inline comments, summary and incremental re-reviews as on GitHub.",
      },
      {
        q: "Will it bury my pull requests in comments?",
        a: "It is built not to. Findings are verified against the code and merged by root cause, and the verdict only blocks on a critical the verifier confirmed. A run with nothing worth saying posts no inline comment, only its one summary, updated in place.",
      },
      {
        q: "How good is it?",
        a: "Results on a golden set and AACR-Bench are published in the manual with their limits: a small sample on two model families, with recall the weak point we are working on.",
      },
    ],
  },
  zh: {
    lines: ["常见问题，", "直接回答。"],
    more: "手册里还有更多回答",
    items: [
      {
        q: "ocra 免费吗？",
        a: `引擎、CLI 和 GitHub Action 都是 Apache-2.0，不需要账号。你只需向模型服务商支付审查用掉的 token，每次运行都会打印花费。${CLOUD} 在早期体验期间免费。`,
      },
      {
        q: "谁能看到我的代码？",
        a: `自托管时，只有你的模型服务商：改动及其标题和描述、你的 AGENTS.md 和审查规则，以及 agent 在仓库里打开或搜索的内容。看起来像密钥的文件、仓库之外的任何东西都不会发送。使用 ${CLOUD} 时，请求还会经过它的网关。`,
      },
      {
        q: "支持哪些模型？",
        a: `通过 ${CLOUD} 可用 ${PROVIDERS} 家服务商中的任意一家，也可以用 OpenCode 支持的任何模型，或你自己按模型定价的 OpenAI 兼容端点。每一档可以列出多个模型，一个倒下，下一个接手。`,
      },
      {
        q: "支持 GitLab 吗？",
        a: "支持：GitLab.com 或自建实例上的 merge request，行内评论、摘要和增量复审都和 GitHub 上一样。",
      },
      {
        q: "会不会把我的 PR 淹没在评论里？",
        a: "它就是为避免这一点而设计的。每条意见都会对照代码核实、按根因合并，只有经核查确认的 critical 才会拦下改动。没有值得说的问题时，它不发行内评论，只更新那一条总结评论。",
      },
      {
        q: "效果怎么样？",
        a: "在 golden set 和 AACR-Bench 上的结果连同局限一起发布在手册里：样本小、只测了两个模型家族，召回率是我们正在改进的弱项。",
      },
    ],
  },
};
