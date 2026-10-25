import type { Bilingual, FromRun, Lines } from "../define";

// The hero: the brand line, the two ways in, and the desk, where the
// example run's page is read, marked and given its one comment. What is
// printed on the desk (code, the finding card) is the engine's own output,
// English in every language; the zh gloss sits in the caption.

interface HeroCopy {
  lines: Lines;
  lede: string;
  cloud: string;
  selfHost: string;
  note: string;
  desk: {
    // The scene for screen readers: what the desk shows once it has played.
    label: FromRun;
    // The caption on the desk: what the example is.
    caption: FromRun;
    // The printed page's head, right: the change's size and the page.
    meta: FromRun;
    card: { where: FromRun; foot: FromRun };
    replay: string;
    replayLabel: string;
    // "line 42", for the lifecycle's thread.
    onLine: FromRun;
  };
}

export const hero: Bilingual<HeroCopy> = {
  en: {
    lines: ["Reads first.", "Comments last."],
    lede: "Open-source AI code review for GitHub and GitLab. It stays quiet unless a finding quotes the code it means and holds up on a second read.",
    cloud: "Start with ocra Cloud",
    selfHost: "Self-host, Apache-2.0",
    note: "Free during early access. Bring your own model key.",
    desk: {
      label: (run) =>
        `Example run, pull request #${run.pr.number}: a printed page of ${run.finding.path}. A reading ruler stops under line ${run.finding.line}, ${run.finding.quote} A red pen underlines session.expiresAt, rings Date.now() and writes the fix, * 1000, in the margin. The verified finding, “${run.finding.title}”, is clipped to the page below the line.`,
      caption: (run) =>
        `Example run · pull request #${run.pr.number} · recorded with the real ocra CLI and a scripted model`,
      meta: (run) => `+${run.diff.additions} −${run.diff.deletions} · page 2 of 2`,
      card: {
        where: (run) => `${run.finding.path.split("/").pop()}:${run.finding.line}`,
        foot: (run) => `verified · #${run.finding.fingerprint}`,
      },
      replay: "Replay",
      replayLabel: "Replay the review",
      onLine: (run) => `line ${run.finding.line}`,
    },
  },
  zh: {
    lines: ["先读懂，", "再开口。"],
    lede: "开源的 AI 代码审查，支持 GitHub 和 GitLab。一条意见要引用它所指的代码、经得起第二遍核查，否则它不开口。",
    cloud: "开始使用 ocra Cloud",
    selfHost: "自托管，Apache-2.0",
    note: "早期体验期间免费，自带模型 key。",
    desk: {
      label: (run) =>
        `示例运行，拉取请求 #${run.pr.number}：打印出来的 ${run.finding.path} 一页。阅读尺停在第 ${run.finding.line} 行 ${run.finding.quote} 下方。红笔划出 session.expiresAt、圈出 Date.now()，在页边写下修复 * 1000。核实过的意见“${run.finding.title}”（每个会话都被当成已过期）夹在这一行下面。`,
      caption: (run) =>
        `示例运行 · 拉取请求 #${run.pr.number} · 用真实的 ocra CLI 和脚本化模型录制 · 意见：每个会话都被当成已过期`,
      meta: (run) => `+${run.diff.additions} −${run.diff.deletions} · page 2 of 2`,
      card: {
        where: (run) => `${run.finding.path.split("/").pop()}:${run.finding.line}`,
        foot: (run) => `verified · #${run.finding.fingerprint}`,
      },
      replay: "重播",
      replayLabel: "重播这次审查",
      onLine: (run) => `第 ${run.finding.line} 行`,
    },
  },
};
