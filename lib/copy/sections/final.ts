import type { Bilingual, Lines } from "../define";

interface FinalCopy {
  lines: Lines;
  cloud: string;
  manual: string;
  // `requires`: the CLI's engines field (packages/cli/package.json) and
  // the manual's installation page.
  install: { label: string; requires: string; copy: string; copied: string };
}

export const final: Bilingual<FinalCopy> = {
  en: {
    lines: ["Point it at", "a pull request", "you already know."],
    cloud: "Start with ocra Cloud",
    manual: "Read the manual",
    install: { label: "Install the CLI", requires: "Node 22.19+", copy: "Copy", copied: "Copied" },
  },
  zh: {
    lines: ["拿一个你熟悉的", "PR 试试看。"],
    cloud: "开始使用 ocra Cloud",
    manual: "阅读手册",
    install: { label: "安装 CLI", requires: "Node 22.19+", copy: "复制", copied: "已复制" },
  },
};
