import { CLOUD } from "../brand";
import type { Bilingual, Lines } from "../define";

// The dark block: the threat the product is built for, the gate every
// agent's read passes, and four properties.
interface SecurityCopy {
  lines: Lines;
  body: string;
  link: string;
  gate: string;
  props: { title: string; body: string }[];
}

export const security: Bilingual<SecurityCopy> = {
  en: {
    lines: ["Built for code", "you do not trust"],
    body: "A diff, a pull request title, an AGENTS.md: anything in the change can be written by an attacker. Ocra assumes it is, and publishes its threat model with the code.",
    link: "Read the threat model",
    gate: "One gate, in core, for every agent and adapter",
    props: [
      {
        title: "Untrusted text stays data",
        body: "Everything from the change is neutralized before it enters a prompt",
      },
      {
        title: "Forks reviewed safely",
        body: "No plugin, install script, repository tool or build from the pull request runs",
      },
      {
        title: "Secrets never leave",
        body: "Secret-like files are refused, and keys never reach logs, prompts or reports",
      },
      {
        title: "Your code stays yours",
        body: `Through ${CLOUD}, prompts and answers pass through and are never logged`,
      },
    ],
  },
  zh: {
    lines: ["为不可信的代码", "而设计"],
    body: "diff、PR 标题、AGENTS.md：改动里的任何内容都可能出自攻击者之手。Ocra 默认它就是，并把威胁模型和代码一起公开。",
    link: "阅读威胁模型",
    gate: "一道关口，在核心里，管住每个 agent 和适配器",
    props: [
      { title: "不可信的文本只是数据", body: "改动里的一切在进入提示词之前都会被中和" },
      { title: "Fork 的 PR 也能安全审查", body: "PR 里的插件、安装脚本、仓库工具和构建一概不运行" },
      { title: "密钥不会外泄", body: "疑似密钥的文件会被拒绝，key 不会进入日志、提示词或报告" },
      { title: "代码仍然是你的", body: `经过 ${CLOUD} 时，提示词和回答只是途经，从不记录日志` },
    ],
  },
};
