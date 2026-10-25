import { PROVIDERS } from "@/lib/landing/engine-facts";
import type { Bilingual, FromRun, Lines } from "../define";

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
  // What ocra leaves on each platform, the tile's last line: one or two
  // things. GitHub and GitLab from "What gets posted" in
  // docs/manual/en/github.mdx and gitlab.mdx (posted with --publish, as the
  // Action does); a local review prints its text report to stdout by
  // default (cli.mdx, --format). Desktop tiles set two things on two lines,
  // the second after "+"; a phone runs them on one line. One thing breaks
  // only where it has an ordinary space or a U+200B.
  leaves: Record<"github" | "gitlab" | "git", readonly [string] | readonly [string, string]>;
  // The miniature of what lands on each platform (works-outputs.tsx): the
  // chips that say which are the example run and which is drawn, where the
  // inline comment sits, and GitLab's reply field under its thread.
  example: string;
  illustration: string;
  onLine: FromRun;
  reply: string;
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
    leaves: {
      github: ["summary comment", "inline comments"],
      gitlab: ["summary note", "inline threads"],
      git: ["a\u00a0report\u00a0in your\u00a0terminal"],
    },
    example: "Example run",
    illustration: "Illustration",
    onLine: (run) => `line ${run.finding.line}`,
    reply: "Reply…",
    gauge: "model providers through ocra Cloud",
    marquee: { pause: "Pause the provider marks", play: "Play the provider marks" },
  },
  zh: {
    lines: ["在团队已经\u200b在用的地方审查，", "用你已经\u200b在付费的模型。"],
    body: `GitHub 上的 pull request、GitLab 上的 merge request，或任何本地分支。可以用 ${PROVIDERS}\u00a0家模型服务商中任意一家的 key，或你自己的 OpenAI 兼容端点。`,
    platforms: "平台",
    more: "另有 {count}\u00a0家可通过 ocra Cloud 接入，也可以接你自己运行的任何 OpenAI 兼容端点。",
    local: "本地分支",
    leaves: {
      github: ["总结评论", "行内评论"],
      gitlab: ["总结评论", "行内讨论串"],
      git: ["终端里的\u200b审查报告"],
    },
    example: "示例运行",
    illustration: "示意",
    onLine: (run) => `第 ${run.finding.line} 行`,
    reply: "回复…",
    gauge: "家模型服务商，经 ocra Cloud 接入",
    marquee: { pause: "暂停滚动", play: "继续滚动" },
  },
};
