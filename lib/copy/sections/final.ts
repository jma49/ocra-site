import { CLOUD } from "../brand";
import type { Bilingual, Lines } from "../define";

// The closing call on the shapes.
interface FinalCopy {
  lines: Lines;
  start: string;
  command: string;
  copy: string;
  copied: string;
}

export const final: Bilingual<FinalCopy> = {
  en: {
    lines: ["Point it at a pull request", "you already know"],
    start: `Start with ${CLOUD}`,
    command: "npm install -g @open-cr-agent/cli",
    copy: "Copy",
    copied: "Copied",
  },
  zh: {
    lines: ["拿一个你熟悉的 PR", "试试看"],
    start: `开始使用 ${CLOUD}`,
    command: "npm install -g @open-cr-agent/cli",
    copy: "复制",
    copied: "已复制",
  },
};
