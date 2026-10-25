import type { Bilingual, FromRun, Lines } from "../define";

// The hero and its product window. The window's comment, code and terminal
// are the engine's own output (exampleRun), English in every language; a zh
// gloss sits in the caption, outside the window.

interface HeroCopy {
  lines: Lines;
  lede: string;
  cloud: string;
  selfHost: string;
  note: string;
}

export const hero: Bilingual<HeroCopy> = {
  en: {
    lines: ["Reads first.", "Comments last."],
    lede: "Open-source AI code review for GitHub and GitLab. It stays quiet unless a finding quotes the code it means and holds up on a second read.",
    cloud: "Start with ocra Cloud",
    selfHost: "Self-host, Apache-2.0",
    note: "Free during early access. Bring your own model key.",
  },
  zh: {
    lines: ["先读懂，", "再开口。"],
    lede: "开源的 AI 代码审查，支持 GitHub 和 GitLab。一条意见要引用它所指的代码、经得起第二遍核查，否则它不开口。",
    cloud: "开始使用 ocra Cloud",
    selfHost: "自托管，Apache-2.0",
    note: "早期体验期间免费，自带模型 key。",
  },
};

interface WindowCopy {
  tabs: { pr: string; terminal: string };
  tablist: string;
  exampleChip: string;
  urls: { pr: FromRun; terminal: FromRun };
  example: string;
  pr: {
    // The theatre's placeholder where the comment will land, before it does:
    // what the reader is doing (13-hero-run.css). Never in the final state.
    pending: { reading: string; checking: FromRun };
    replay: string;
    replayLabel: string;
    summaryLabel: string;
    // Not rendered when empty (en): the comment itself stays English.
    gloss: string;
    onLine: FromRun;
    notes: { seconds: string; milliseconds: string };
    codeLabel: FromRun;
    commentLabel: FromRun;
    // A fold row's label: fill(fold, { from, to }).
    fold: string;
    key: { units: string; fix: string; anchor: string };
  };
}

// Mounted as the `window` key by lib/copy/index.ts.
export const productWindow: Bilingual<WindowCopy> = {
  en: {
    tabs: { pr: "Pull request", terminal: "Terminal" },
    tablist: "The example run",
    exampleChip: "Example run",
    urls: {
      pr: (run) => `pull request #${run.pr.number} · ${run.pr.title}`,
      terminal: (run) => `${run.repo} · ${run.command}`,
    },
    example:
      "Recorded with the real ocra CLI and a scripted model: the pipeline, the output and the verdict are ocra's own. The pull request view shows the run's finding as ocra posts it on GitHub.",
    pr: {
      pending: {
        reading: "ocra is reading the change",
        checking: (run) => `ocra is checking line ${run.finding.line}`,
      },
      replay: "Replay",
      replayLabel: "Replay the review",
      summaryLabel: "summary comment",
      gloss: "",
      onLine: (run) => `line ${run.finding.line}`,
      notes: { seconds: "seconds", milliseconds: "milliseconds" },
      codeLabel: (run) => `${run.finding.path}, part of the change`,
      commentLabel: (run) => `ocra's comment on line ${run.finding.line}`,
      fold: "lines {from}–{to}",
      key: {
        units: "the two units the code mixes",
        fix: "the fix it suggested",
        anchor: "the line it anchored",
      },
    },
  },
  zh: {
    tabs: { pr: "拉取请求", terminal: "终端" },
    tablist: "这次示例运行",
    exampleChip: "示例运行",
    urls: {
      pr: (run) => `拉取请求 #${run.pr.number} · ${run.pr.title}`,
      terminal: (run) => `${run.repo} · ${run.command}`,
    },
    example:
      "用真实的 ocra CLI 和脚本化的模型录制，流水线、输出和结论都来自 ocra 本身。拉取请求视图按 ocra 在 GitHub 上发布的样子展示这次运行的意见。",
    pr: {
      pending: {
        reading: "ocra 正在阅读这次改动",
        checking: (run) => `ocra 正在核查第 ${run.finding.line} 行`,
      },
      replay: "重播",
      replayLabel: "重播这次审查",
      summaryLabel: "总结评论",
      gloss:
        "评论译文：每个会话都被当成已过期。isExpired() 把以秒存储的 expiresAt 和以毫秒计的 Date.now() 比较，结果总是 true：loadSession() 会删掉每个会话，用户登录后会立刻被登出。",
      onLine: (run) => `第 ${run.finding.line} 行`,
      notes: { seconds: "秒", milliseconds: "毫秒" },
      codeLabel: (run) => `${run.finding.path}，改动的一部分`,
      commentLabel: (run) => `ocra 在第 ${run.finding.line} 行的评论`,
      fold: "第 {from}–{to} 行",
      key: {
        units: "代码混用的两种单位",
        fix: "它建议的修复",
        anchor: "它锚定的那一行",
      },
    },
  },
};
