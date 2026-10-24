import type { Bilingual, FromRun, Lines } from "../define";

interface StatementCopy {
  lines: Lines;
  lead: string;
  // Struck by the pen: the reviewers' out-of-scope list.
  outOfScope: readonly [string, string, string];
  caption: string;
  proof: FromRun;
}

export const statement: Bilingual<StatementCopy> = {
  en: {
    lines: ["Quiet", "by design."],
    lead: "A reviewer that comments on everything gets ignored. ocra stays quiet unless it can quote the code, say what it checked, and survive a second read.",
    outOfScope: ["Style", "Speculation", "Unchanged code"],
    caption: "Out of scope for every reviewer. Reporting nothing is a valid outcome.",
    proof: (run) =>
      `The example run: ${run.claims.length} candidate findings → ${run.outcome.reported} reported.`,
  },
  zh: {
    lines: ["安静，", "是设计", "出来的。"],
    lead: "什么都评论的审查者，很快就没人理。ocra 只在能引用代码、说清查过什么、并经得起第二遍复核时才开口。",
    outOfScope: ["风格", "猜测", "未改动的代码"],
    caption: "不在任何审查员的范围内。什么都不报，也是正常结果。",
    proof: (run) => `示例运行：${run.claims.length} 条候选意见 → 报告 ${run.outcome.reported} 条。`,
  },
};
