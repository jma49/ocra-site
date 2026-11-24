import { CLOUD } from "../brand";
import type { Bilingual, FromRun, Lines } from "../define";

// The hero: the claim, the two ways in, and the recorded example run as
// Ocra Cloud shows it, a finding that becomes a commit.
interface HeroCopy {
  lines: Lines;
  lede: string;
  start: string;
  selfHost: string;
  // The window around the screenshot: the pull request and file, and the
  // review's state as the loop plays.
  bar: FromRun;
  reviewing: string;
  reviewed: string;
  alt: string;
  committed: FromRun;
  chips: { candidates: FromRun; verified: string; calls: FromRun };
  note: FromRun;
}

const calls = (run: Parameters<FromRun>[0]) => run.calls.length;
const dollars = (run: Parameters<FromRun>[0]) => `$${run.usage.dollars}`;

export const hero: Bilingual<HeroCopy> = {
  en: {
    lines: ["Code review agents that check", "before they comment"],
    lede: "Ocra reviews your GitHub and GitLab pull requests on your own model key. A finding reaches you only when it quotes the code and holds up on a second read, often with a fix you commit in one click.",
    start: `Start with ${CLOUD}`,
    selfHost: "Self-host with the CLI",
    bar: (run) => `acme/api #${run.pr.number} · ${run.finding.path}`,
    reviewing: "Reviewing",
    reviewed: "Reviewed",
    alt: "Ocra Cloud's pull request page: a critical finding under line 42 of src/auth/session.ts, and Ocra's fix with a Commit fix button",
    committed: (run) => `Fix committed to ${run.pr.head}`,
    chips: {
      candidates: (run) => `${run.claims.length} candidates → ${run.outcome.reported} reported`,
      verified: "Verified on a second read",
      calls: (run) => `${calls(run)} model calls · ${dollars(run)}`,
    },
    note: (run) =>
      `${CLOUD}, on the recorded example run #${run.pr.number}. Repository names are sample data`,
  },
  zh: {
    lines: ["先核实，再开口的", "代码审查 agent"],
    lede: "Ocra 用你自己的模型 key 审查 GitHub 和 GitLab 上的 PR。一条意见要引用到具体代码、经得住第二遍核查，才会出现在你面前，往往还附带一个一键提交的修复。",
    start: `开始使用 ${CLOUD}`,
    selfHost: "用 CLI 自托管",
    bar: (run) => `acme/api #${run.pr.number} · ${run.finding.path}`,
    reviewing: "审查中",
    reviewed: "已审查",
    alt: "Ocra Cloud 的 PR 页面：src/auth/session.ts 第 42 行下的一条严重问题，以及 Ocra 给出的修复和 Commit fix 按钮",
    committed: (run) => `修复已提交到 ${run.pr.head}`,
    chips: {
      candidates: (run) => `${run.claims.length} 条候选 → 报告 ${run.outcome.reported} 条`,
      verified: "经第二遍核查确认",
      calls: (run) => `${calls(run)} 次模型调用 · ${dollars(run)}`,
    },
    note: (run) => `${CLOUD} 中录制的示例运行 #${run.pr.number}。界面为英文，仓库名是示例数据`,
  },
};
