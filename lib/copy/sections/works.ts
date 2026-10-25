import { PROVIDERS } from "@/lib/landing/engine-facts";
import type { Bilingual, Lines } from "../define";

interface WorksCopy {
  // Two set lines from 1200 px; one balanced sentence below. Chinese keeps
  // its two lines and, below 600 px, splits each once at its \u200b (after
  // 已经), so the two halves pair up (20-works.css).
  lines: Lines;
  body: string;
  // The platform tiles' list label (not shown).
  platforms: string;
  // `{count}` is the number of providers not shown in the rows.
  more: string;
  local: string;
  // Beside the provider count that heads the provider index.
  gauge: string;
  marquee: { pause: string; play: string };
}

export const works: Bilingual<WorksCopy> = {
  en: {
    lines: ["Reviews where your team already works,", "with the model you already pay for."],
    body: `Pull requests on GitHub, merge requests on GitLab, or any local branch. Bring a key from any of ${PROVIDERS} providers, or your own OpenAI-compatible endpoint.`,
    platforms: "Platforms",
    more: "and {count} more through ocra Cloud, or any OpenAI-compatible endpoint you run.",
    local: "Local branches",
    gauge: "model providers through ocra Cloud",
    marquee: { pause: "Pause the provider marks", play: "Play the provider marks" },
  },
  zh: {
    lines: ["在团队已经\u200b在用的地方审查，", "用你已经\u200b在付费的模型。"],
    body: `GitHub 上的 pull request、GitLab 上的 merge request，或任何本地分支。可以用 ${PROVIDERS}\u00a0家模型服务商中任意一家的 key，或你自己的 OpenAI 兼容端点。`,
    platforms: "平台",
    more: "另有 {count}\u00a0家可通过 ocra Cloud 接入，也可以接你自己运行的任何 OpenAI 兼容端点。",
    local: "本地分支",
    gauge: "家模型服务商，经 ocra Cloud 接入",
    marquee: { pause: "暂停滚动", play: "继续滚动" },
  },
};
