import { PROVIDERS } from "@/lib/landing/engine-facts";
import { CLOUD } from "../brand";
import type { Bilingual, Lines } from "../define";

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
        q: "Is Ocra free?",
        a: `The engine, CLI and GitHub Action are Apache-2.0 and need no Ocra account. Each run reports its cost: pay your model provider for tokens, or review locally on your ChatGPT plan through Codex. ${CLOUD} is free during early access; you bring a model key.`,
      },
      {
        q: "Who sees my code?",
        a: `Self-hosted, only your model provider: the change with its title and description, your AGENTS.md and review rules, and what the agents open or search in the repository. Never files that look like secrets, or anything outside the repository. With ${CLOUD} the request also passes through its gateway, and a review it runs for you clones the repository you enrolled.`,
      },
      {
        q: "Which models does it work with?",
        a: `Use OpenCode's supported models, your own OpenAI- or Anthropic-compatible endpoint, or one of ${PROVIDERS} providers through ${CLOUD}. For local reviews, you can also use your signed-in Codex CLI without an API key. Each tier can list several models for failover.`,
      },
      {
        q: "Does it work with GitLab?",
        a: "Yes: merge requests on GitLab.com or self-managed, with the same inline comments, summary and incremental re-reviews as on GitHub.",
      },
      {
        q: "Will it bury my pull requests in comments?",
        a: "Ocra merges duplicates, marks whether findings were verified, and can limit inline comments. Pre-existing findings can be reported but do not count toward the verdict. A confirmed critical finding can trigger blocking only if you opt in; the GitHub review check itself never fails.",
      },
      {
        q: "Can I ask it about the change?",
        a: "Yes. With the GitHub comment workflow enabled, mention @ocra for a reply in the same thread, or run @ocra review to review the whole pull request again (/ocra review still works). The summary can include a walkthrough with the files in reading order and a sequence diagram.",
      },
      {
        q: "What else can it do on a pull request?",
        a: "ocra generate writes tests or doc comments for the changed code as one commit on the branch. ocra stack keeps a stack of dependent pull requests rebased, submitted and merged in order. ocra mcp lets your coding agent ask for a review before you commit.",
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
        q: "Ocra 免费吗？",
        a: `引擎、CLI 和 GitHub Action 都采用 Apache-2.0 许可，不需要 Ocra 账号。每次运行都会报告花费：你可以按 token 向模型服务商付费，也可以用 Codex 在本地使用 ChatGPT 套餐审查。${CLOUD} 早期体验期间免费，模型 key 自带。`,
      },
      {
        q: "谁能看到我的代码？",
        a: `自托管时，只有你的模型服务商：改动及其标题和描述、你的 AGENTS.md 和审查规则，以及 agent 在仓库里打开或搜索的内容。看起来像密钥的文件、仓库之外的任何东西都不会发送。使用 ${CLOUD} 时，请求还会经过它的网关；由它替你运行的审查会克隆你登记的仓库。`,
      },
      {
        q: "支持哪些模型？",
        a: `可以使用 OpenCode 支持的模型、你自己的 OpenAI 或 Anthropic 兼容端点，或通过 ${CLOUD} 使用 ${PROVIDERS} 家服务商。本地审查还可以用已登录的 Codex CLI，无需 API key。每一档都可以配置多个模型以便故障切换。`,
      },
      {
        q: "支持 GitLab 吗？",
        a: "支持：GitLab.com 或自建实例上的 merge request，行内评论、摘要和增量复审都和 GitHub 上一样。",
      },
      {
        q: "会不会把我的 PR 淹没在评论里？",
        a: "Ocra 会合并重复意见，标明核查状态，并可限制行内评论数量。已有问题可以报告，但不计入结论。只有主动开启拦截时，经确认的严重问题才可能阻止合并；GitHub 上的审查检查本身不会失败。",
      },
      {
        q: "可以就这次改动向它提问吗？",
        a: "可以。启用 GitHub 评论 workflow 后，在评论中提到 @ocra，它会在原讨论中回复；输入 @ocra review 可重审整个 PR（/ocra review 仍可用）。总结可以附上改动导读，包括按阅读顺序排列的文件和时序图。",
      },
      {
        q: "在 PR 上它还能做什么？",
        a: "ocra generate 为改动的代码写测试或文档注释，作为一个提交放到分支上。ocra stack 管理一串相互依赖的 PR，按顺序 rebase、提交和合并。ocra mcp 让你的编程 agent 在提交前请它审查。",
      },
      {
        q: "效果怎么样？",
        a: "在 golden set 和 AACR-Bench 上的结果连同局限一起发布在手册里：样本小、只测了两个模型家族，召回率是我们正在改进的弱项。",
      },
    ],
  },
};
