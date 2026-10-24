import type { Bilingual, Lines } from "../define";

interface SecurityCopy {
  lines: Lines;
  body: string;
  flow: {
    repo: string;
    repoNote: string;
    gate: string;
    refused: string;
    // Read before the struck list, for screen readers.
    refusedSr: string;
    outside: string;
    agents: string;
    tools: string;
    builtins: string;
    // fill(more, { n })
    more: string;
    on: string;
    off: string;
    provider: string;
    providerNote: string;
  };
  props: { title: string; body: string }[];
  link: string;
}

export const security: Bilingual<SecurityCopy> = {
  en: {
    lines: ["Built for code you", "do not trust."],
    body: "A diff, a pull request title, an AGENTS.md: anything in the change can be written by an attacker. ocra assumes it is, and publishes its threat model with the code.",
    flow: {
      repo: "your repository at the revision under review",
      repoNote: "diff, files, pull request text: untrusted data",
      gate: "one gate, enforced in core",
      refused: "Refused at the gate",
      refusedSr: "Refused:",
      outside: "outside the repo",
      agents: "isolated agents · 20 steps each",
      tools: "Tools the example run's agents called",
      builtins: "Every OpenCode built-in, off",
      more: "and {n} more",
      on: "on",
      off: "off",
      provider: "your model provider",
      providerNote: "the only party that sees the code when you self-host",
    },
    props: [
      {
        title: "Untrusted text stays data",
        body: "Everything from the change is neutralized before it enters a prompt; control characters never reach your terminal.",
      },
      {
        title: "Nothing from the reviewed tree runs",
        body: "For pull requests no plugin, install script, repository tool or build executes. Forks run behind a gated workflow.",
      },
      {
        title: "Secrets never leave",
        body: "Files that look like secrets are refused at the gate. Keys never appear in logs, prompts, reports or session files.",
      },
      {
        title: "Least privilege for processes",
        body: "Argument arrays, no shell, and only the environment variables a child process needs.",
      },
    ],
    link: "Read the threat model",
  },
  zh: {
    lines: ["为你不信任的", "代码而设计。"],
    body: "diff、PR 标题、AGENTS.md：改动里的任何内容都可能出自攻击者之手。ocra 默认就是这样，并把威胁模型和代码一起公开。",
    flow: {
      repo: "被审查版本的仓库",
      repoNote: "diff、文件、PR 文本：都是不可信数据",
      gate: "唯一的关口，在核心里强制执行",
      refused: "在关口被拒绝",
      refusedSr: "被拒绝：",
      outside: "仓库之外",
      agents: "隔离的 agent · 每个 20 步",
      tools: "示例运行里 agent 调用的工具",
      builtins: "OpenCode 内置工具，全部关闭",
      more: "另外 {n} 个",
      on: "开启",
      off: "关闭",
      provider: "你的模型服务商",
      providerNote: "自托管时，唯一能看到代码的一方",
    },
    props: [
      {
        title: "不可信文本始终只是数据",
        body: "改动里的一切在放进提示词之前都会被中和；控制字符永远到不了你的终端。",
      },
      {
        title: "被审查的代码不会被执行",
        body: "审查 PR 时，不运行任何插件、安装脚本、仓库工具或构建。来自 fork 的 PR 走受控的 workflow。",
      },
      {
        title: "密钥不会外泄",
        body: "看起来像密钥的文件在关口就被拒绝。key 不会出现在日志、提示词、报告或会话文件里。",
      },
      {
        title: "子进程最小权限",
        body: "参数数组、不经过 shell，子进程只拿到它需要的环境变量。",
      },
    ],
    link: "阅读威胁模型",
  },
};
