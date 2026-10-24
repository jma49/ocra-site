import type { Bilingual, Lines } from "../define";

interface FinalCopy {
  lines: Lines;
  cloud: string;
  manual: string;
  install: { label: string; copy: string; copied: string };
}

export const final: Bilingual<FinalCopy> = {
  en: {
    lines: ["Point it at", "a pull request", "you already know."],
    cloud: "Start with ocra Cloud",
    manual: "Read the manual",
    install: { label: "Install the CLI", copy: "Copy", copied: "Copied" },
  },
  zh: {
    lines: ["拿一个你熟悉的", "PR 试试看。"],
    cloud: "开始使用 ocra Cloud",
    manual: "阅读手册",
    install: { label: "安装 CLI", copy: "复制", copied: "已复制" },
  },
};
