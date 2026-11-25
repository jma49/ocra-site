import type { Bilingual, Lines } from "../define";

// Every review in one history, and what the console does with it. The first
// item is open; the others open one at a time.
interface RecordCopy {
  lines: Lines;
  body: string;
  items: { title: string; body: string }[];
  alt: string;
  note: string;
  views: {
    learning: { tag: string; path: string; summary: string; action: string };
    ask: { header: string; question: string; answer: string; meta: string };
    thread: {
      header: string;
      author: string;
      mention: string;
      bot: string;
      reply: string;
    };
    alerts: {
      channel: string;
      alertTitle: string;
      alertMeta: string;
      digestTitle: string;
      digestStats: string;
    };
  };
}

export const record: Bilingual<RecordCopy> = {
  en: {
    lines: ["Every review on record,", "and it learns from you"],
    body: "Reviews from CI, your terminal, and the GitHub app converge in one searchable history—complete with verdicts, findings, token spend, and latency.",
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
    views: {
      learning: {
        tag: "Proposed learning",
        path: ".ocra/learnings/session-ttl.md",
        summary: "Always compare Unix timestamps in matching units (seconds vs. milliseconds).",
        action: "Open PR to merge",
      },
      ask: {
        header: "acme/api #812 · Ask Ocra",
        question: "Why is line 42 marked critical instead of a warning?",
        answer:
          "session.expiresAt is stored in Unix seconds while Date.now() returns milliseconds, so every active session evaluates as expired immediately after login.",
        meta: "Grounded in src/auth/session.ts:42 · your model key",
      },
      thread: {
        header: "PR #812 · src/auth/session.ts",
        author: "alex",
        mention: "@ocra does multiplying by 1000 break legacy rows?",
        bot: "ocra",
        reply:
          "No — schema migration 004 already normalized expires_at to Unix seconds across all rows. Multiplying by 1000 aligns the comparison with Date.now().",
      },
      alerts: {
        channel: "#eng-reviews · Slack / WeCom",
        alertTitle: "Critical finding on acme/api #812",
        alertMeta: "src/auth/session.ts:42 · Verified on second read",
        digestTitle: "Daily digest · 7 reviews",
        digestStats: "1 critical · 3 warnings · 1.2M tokens",
      },
    },
  },
  zh: {
    lines: ["每次审查都有记录，", "并从你的决定中学习"],
    body: "来自 CI、终端与 GitHub App 的每次审查都汇入同一份可检索历史，完整记录结论、发现、token 消耗与耗时。",
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
    views: {
      learning: {
        tag: "提议的 Learning",
        path: ".ocra/learnings/session-ttl.md",
        summary: "比较 Unix 时间戳时必须统一单位（秒与毫秒）。",
        action: "发起 PR 审阅并合并",
      },
      ask: {
        header: "acme/api #812 · 问 Ocra",
        question: "为什么第 42 行被标为 Critical 而不是 Warning？",
        answer:
          "session.expiresAt 以秒存储，而 Date.now() 返回毫秒，导致所有有效会话在登录后立刻被判定为已过期。",
        meta: "依据 src/auth/session.ts:42 · 使用你的模型 key",
      },
      thread: {
        header: "PR #812 · src/auth/session.ts",
        author: "alex",
        mention: "@ocra 乘以 1000 会影响历史旧数据吗？",
        bot: "ocra",
        reply:
          "不会——004 号迁移脚本已将全部历史记录的 expires_at 统一为秒级时间戳，乘以 1000 刚好与 Date.now() 对齐。",
      },
      alerts: {
        channel: "#eng-reviews · Slack / 企业微信",
        alertTitle: "acme/api #812 发现严重问题",
        alertMeta: "src/auth/session.ts:42 · 经第二遍核查确认",
        digestTitle: "每日摘要 · 7 次审查",
        digestStats: "1 条严重 · 3 条警告 · 1.2M tokens",
      },
    },
  },
};
