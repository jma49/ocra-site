import type { Bilingual, Lines } from "../define";

interface SecurityCopy {
  label: string;
  lines: Lines;
  body: string;
  // The poster: the refused paths, each with the rule that refuses it.
  poster: {
    caption: string;
    // Read before the list, for screen readers.
    refusedSr: string;
    kinds: { secret: string; git: string };
    // The typed exchange on the first row: who speaks, and its note.
    agent: string;
    gate: string;
    verbatim: string;
    also: string;
    alsoRest: string;
  };
  props: { title: string; body: string }[];
  // Before each property's source path, for screen readers.
  source: string;
  link: string;
  // The measured result, its {name} placeholders filled from
  // lib/landing/measured.ts, and the method's page.
  proof: { label: string; text: string; link: string };
  // fill(footnote, { steps, tools, n }): the agents' caps.
  footnote: string;
}

export const security: Bilingual<SecurityCopy> = {
  en: {
    label: "Security",
    lines: ["Built for code", "you do not trust."],
    body: "A diff, a pull request title, an AGENTS.md: anything in the change can be written by an attacker. ocra assumes it is, and publishes its threat model with the code.",
    poster: {
      caption: "Refused at the gate. One gate, in core, for every agent and every adapter.",
      refusedSr: "Paths the gate refuses, each with its rule:",
      kinds: { secret: "secret pattern", git: "git internals, any segment" },
      agent: "agent",
      gate: "gate",
      verbatim: "the refusal, verbatim",
      also: "Also refused",
      alsoRest: "and the rest of the secret patterns, and anything outside the repository.",
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
    source: "Enforced in",
    link: "Read the threat model",
    proof: {
      label: "Measured, with its limits",
      // No-break spaces keep each figure with its words.
      text: "On {changes} changes with {known} known issues, ocra found {found}, and every finding it reported was correct.",
      link: "Read the method",
    },
    footnote:
      "Agents are isolated, {steps} steps each. Every OpenCode built-in is off: {tools} and {n} more.",
  },
  zh: {
    label: "安全",
    lines: ["为你不信任的", "代码而设计。"],
    body: "diff、PR 标题、AGENTS.md：改动里的任何内容都可能出自攻击者之手。ocra 默认就是这样，并把威胁模型和代码一起公开。",
    poster: {
      caption: "在关口被拒绝。唯一的关口，在核心里，对每个 agent、每个适配器都一样。",
      refusedSr: "关口拒绝的路径，以及拒绝它的规则：",
      kinds: { secret: "密钥模式", git: "git 内部文件，任一路径段" },
      agent: "agent",
      gate: "关口",
      verbatim: "拒绝原文",
      also: "同样被拒绝：",
      alsoRest: "以及其余的密钥模式，和仓库之外的一切。",
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
    source: "执行于",
    link: "阅读威胁模型",
    proof: {
      label: "实测，连同局限",
      // No-break spaces keep each figure with its measure word and "ocra"
      // with its verb.
      text: "在 {changes} 个改动、{known} 个已知问题上，ocra 找到了 {found} 个，报出的每一条都正确。",
      link: "阅读测量方法",
    },
    footnote:
      "agent 彼此隔离，每个 {steps} 步。OpenCode 的内置工具全部关闭：{tools}，以及另外 {n} 个。",
  },
};
