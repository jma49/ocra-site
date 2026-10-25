import type { Bilingual, Lines } from "../define";

interface WorksCopy {
  eyebrow: string;
  // The poster's two lines; Chinese may break each once at its \u200b.
  lines: Lines;
  body: string;
  local: string;
  // What ocra leaves on each platform, under its name: one or two things.
  // GitHub and GitLab from "What gets posted" in docs/manual/en/github.mdx
  // and gitlab.mdx (posted with --publish, as the Action does); a local
  // review prints its text report to stdout by default (cli.mdx, --format).
  leaves: Record<"github" | "gitlab" | "git", readonly [string] | readonly [string, string]>;
  // Under the summary heading: who posts it on GitHub (the Action's
  // GITHUB_TOKEN, github.mdx), and that GitLab's note is updated in place.
  posted: Record<"github" | "gitlab", string>;
  threadOn: string;
  resolve: string;
  reply: string;
  // The line the finding quotes, before and after its number: the pen
  // rings the number in each column.
  at: readonly [string, string];
  // Each column's source: the run's own output, or drawn after it.
  example: string;
  illustration: string;
  recorded: string;
  // Beside the provider count that heads the provider index.
  gauge: string;
  more: string;
}

export const works: Bilingual<WorksCopy> = {
  en: {
    eyebrow: "Works where you work",
    lines: ["Reviews where you work,", "on the model you pay for."],
    body: "Pull requests on GitHub, merge requests on GitLab, or any local branch. The same finding lands in each, on the line it quotes.",
    local: "Local branches",
    leaves: {
      github: ["summary comment", "inline comments"],
      gitlab: ["summary note", "inline threads"],
      git: ["a\u00a0report\u00a0in your\u00a0terminal"],
    },
    posted: { github: "posted as github-actions[bot]", gitlab: "one note, updated in place" },
    threadOn: "thread on",
    resolve: "Resolve thread",
    reply: "Reply…",
    at: ["line ", ""],
    example: "Example run",
    illustration: "Illustration",
    recorded: "Example run · recorded",
    gauge: "model providers through ocra Cloud",
    more: "Store a key for any of them in ocra Cloud, or point ocra at any OpenAI-compatible endpoint you run.",
  },
  zh: {
    eyebrow: "在你工作的地方",
    lines: ["在你工作的\u200b地方审查，", "用你付费的\u200b模型。"],
    body: "GitHub 上的 pull request、GitLab 上的 merge request，或任何本地分支。同一条发现出现在每一处，落在它引用的那一行。",
    local: "本地分支",
    leaves: {
      github: ["总结评论", "行内评论"],
      gitlab: ["总结评论", "行内讨论串"],
      git: ["终端里的\u200b审查报告"],
    },
    posted: { github: "以 github-actions[bot] 发布", gitlab: "一条评论，原地更新" },
    threadOn: "讨论串",
    resolve: "解决讨论串",
    reply: "回复…",
    at: ["第 ", " 行"],
    example: "示例运行",
    illustration: "示意",
    recorded: "示例运行 · 录制",
    gauge: "家模型服务商，经 ocra Cloud 接入",
    more: "在 ocra Cloud 中保存其中任意一家的 key，或把 ocra 指向你自己运行的任何 OpenAI 兼容端点。",
  },
};
