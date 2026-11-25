import { CLOUD } from "../brand";
import type { Bilingual, Lines } from "../define";

// The console: the inbox as the picture, and four things a pull request's
// page does.
interface ProductCopy {
  lines: Lines;
  body: string;
  alt: string;
  note: string;
  features: { title: string; body: string }[];
}

export const product: Bilingual<ProductCopy> = {
  en: {
    lines: ["From finding to merge,", "on one page"],
    body: "One cross-repo inbox for every pull request waiting on you, with Ocra's verdict beside each. Open a PR to read the review inline, commit verified fixes, clear merge blockers, and ship.",
    alt: "Ocra Cloud's inbox: pull requests grouped into Needs my review, My open PRs and Waiting on others, with Ocra's verdict, size, author and keyboard shortcuts",
    note: `${CLOUD}'s inbox, with sample data`,
    features: [
      {
        title: "A walkthrough first",
        body: "The files in reading order and a sequence diagram, before you open the diff",
      },
      {
        title: "Fixes you can commit",
        body: "A checked fix under the line it changes, committed as you while the branch is unchanged",
      },
      {
        title: "Ready to merge",
        body: "One live checklist: conflicts, approvals, code owners, required checks, open threads",
      },
      {
        title: "Merge when ready",
        body: "Arm the platform's auto-merge or merge queue, or merge a whole stack bottom up",
      },
    ],
  },
  zh: {
    lines: ["从发现问题到合并，", "都在一页里"],
    body: "跨仓库汇总所有待你处理的 PR，每条旁都附有 Ocra 结论。点开即可在 diff 上查看审查、一键提交修复、扫清合并阻碍，直接合入。",
    alt: "Ocra Cloud 的收件箱：PR 按“需要我审查”“我的 PR”“等待他人”分组，附 Ocra 的结论、改动大小、作者和快捷键",
    note: `${CLOUD} 的收件箱，示例数据`,
    features: [
      { title: "先看导读", body: "按阅读顺序排列的文件和一张时序图，然后再打开 diff" },
      {
        title: "可以直接提交的修复",
        body: "核查过的修复就在它要改的那一行下面，分支没变时以你的身份提交",
      },
      {
        title: "可以合并了吗",
        body: "一张实时清单：冲突、批准、code owner、必需的检查、未解决的讨论",
      },
      { title: "就绪即合并", body: "开启平台的自动合并或合并队列，或者自底向上合并一整串 PR" },
    ],
  },
};
