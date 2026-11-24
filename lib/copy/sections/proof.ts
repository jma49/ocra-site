import { PROVIDERS } from "@/lib/landing/engine-facts";
import type { Bilingual } from "../define";

// The strip under the hero: four facts, each with the line that backs it.
interface ProofCopy {
  label: string;
  items: { title: string; body: string }[];
}

export const proof: Bilingual<ProofCopy> = {
  en: {
    label: "At a glance",
    items: [
      {
        title: "Open source, Apache-2.0",
        body: "Engine, CLI and GitHub Action, no account needed",
      },
      { title: "GitHub and GitLab", body: "Cloud or self-managed, GitHub Enterprise Server too" },
      {
        title: `${PROVIDERS} model providers`,
        body: "Or your own OpenAI- or Anthropic-compatible endpoint",
      },
      { title: "Safe on forks", body: "Nothing from the reviewed tree ever runs" },
    ],
  },
  zh: {
    label: "概览",
    items: [
      { title: "开源，Apache-2.0", body: "引擎、CLI 和 GitHub Action，无需账号" },
      { title: "GitHub 和 GitLab", body: "云端或自建实例，也支持 GitHub Enterprise Server" },
      { title: `${PROVIDERS} 家模型服务商`, body: "也可以接你自己的 OpenAI 或 Anthropic 兼容端点" },
      { title: "Fork 的 PR 也安全", body: "被审查代码树里的任何东西都不会运行" },
    ],
  },
};
