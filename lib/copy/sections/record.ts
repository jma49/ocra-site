import type { Bilingual, Lines } from "../define";

// Every review in one history, and what the console does with it. The first
// item is open; the others open one at a time.
interface RecordCopy {
  lines: Lines;
  body: string;
  items: { title: string; body: string }[];
  alt: string;
  note: string;
}

export const record: Bilingual<RecordCopy> = {
  en: {
    lines: ["Every review on record,", "and it learns from you"],
    body: "Reviews from CI, from your terminal and from the bot land in one history, with verdict, findings, tokens and time.",
    items: [
      {
        title: "Learnings from your decisions",
        body: "What your team fixes and dismisses is proposed as a learning, reviewed like code in a pull request, and read by the next review.",
      },
      {
        title: "Ask Ocra about a review",
        body: "A review's page answers questions about it and its pull request, like why a finding is critical, with your own model key.",
      },
      {
        title: "Mention @ocra in a thread",
        body: "On an enrolled repository, a comment that mentions @ocra gets its answer in the same thread.",
      },
      {
        title: "Alerts in Slack or WeCom, and a digest",
        body: "Hear about every review, reviews with findings or only critical ones, plus a daily digest and a weekly report.",
      },
    ],
    alt: "Ocra Cloud's Reviews page: seven reviews with verdicts, findings by severity, files, tokens, duration and time",
    note: "The Reviews page, with sample data",
  },
  zh: {
    lines: ["每次审查都有记录，", "并从你的决定中学习"],
    body: "来自 CI、终端和 bot 的审查都汇入同一份历史，附带结论、发现、token 和耗时。",
    items: [
      {
        title: "从你的决定里学习",
        body: "团队修复和忽略了什么，会被提议成一条 learning，像代码一样在 PR 里审，下一次审查就会读到它。",
      },
      {
        title: "就一次审查问 Ocra",
        body: "审查页面可以回答关于这次审查和它的 PR 的问题，比如某条发现为什么是严重的，用的是你自己的模型 key。",
      },
      {
        title: "在讨论里提到 @ocra",
        body: "在已登记的仓库里，提到 @ocra 的评论会在同一个讨论里得到回答。",
      },
      {
        title: "Slack 或企业微信提醒，以及摘要",
        body: "每次审查、有发现的审查或只有严重问题时提醒你，另有每日摘要和每周报告。",
      },
    ],
    alt: "Ocra Cloud 的审查页：七次审查及其结论、按严重程度统计的发现、文件数、token、耗时和时间",
    note: "审查页，示例数据",
  },
};
