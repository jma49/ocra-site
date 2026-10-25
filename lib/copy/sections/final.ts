import type { Bilingual, FromRun, Lines } from "../define";

interface FinalCopy {
  lines: Lines;
  cloud: string;
  manual: string;
  // `requires`: the CLI's engines field (packages/cli/package.json) and
  // the manual's installation page.
  install: { label: string; requires: string; copy: string; copied: string };
  // The last sheet on the evening desk: the example run's fix, printed.
  sheet: { label: FromRun; meta: FromRun; foot: FromRun; example: string };
}

export const final: Bilingual<FinalCopy> = {
  en: {
    lines: ["Point it at", "a pull request", "you already know."],
    cloud: "Start with ocra Cloud",
    manual: "Read the manual",
    install: { label: "Install the CLI", requires: "Node 22.19+", copy: "Copy", copied: "Copied" },
    sheet: {
      label: (run) =>
        `The example run's suggested fix for line ${run.finding.line} of ${run.finding.path}, and the command that installs the CLI`,
      meta: (run) => `suggested fix · line ${run.finding.line}`,
      foot: (run) => `${run.repo.replace(/^~\//, "")} · pull request #${run.pr.number}`,
      example: "example run",
    },
  },
  zh: {
    lines: ["拿一个你熟悉的", "PR 试试看。"],
    cloud: "开始使用 ocra Cloud",
    manual: "阅读手册",
    install: { label: "安装 CLI", requires: "Node 22.19+", copy: "复制", copied: "已复制" },
    sheet: {
      label: (run) =>
        `示例运行对 ${run.finding.path} 第 ${run.finding.line} 行建议的修改，以及安装 CLI 的命令`,
      meta: (run) => `建议的修改 · 第 ${run.finding.line} 行`,
      foot: (run) => `${run.repo.replace(/^~\//, "")} · pull request #${run.pr.number}`,
      example: "示例运行",
    },
  },
};
