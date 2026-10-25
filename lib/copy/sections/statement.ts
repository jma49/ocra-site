import type { Bilingual, FromRun, Lines } from "../define";

// One side of the example run's count: the number, with the words set
// before and after it in the language's order.
interface Count {
  before?: string;
  n: FromRun;
  after: string;
}

interface StatementCopy {
  lines: Lines;
  lead: string;
  // Struck by the pen: the reviewers' out-of-scope list.
  outOfScope: readonly [string, string, string];
  caption: string;
  // Set large under the statement: what the example run found, and what it
  // reported.
  proof: { label: string; from: Count; to: Count };
}

export const statement: Bilingual<StatementCopy> = {
  en: {
    lines: ["Quiet", "by design."],
    lead: "A reviewer that comments on everything gets ignored. ocra stays quiet unless it can quote the code, say what it checked, and survive a second read.",
    outOfScope: ["Style", "Speculation", "Unchanged code"],
    caption: "Out of scope for every reviewer. Reporting nothing is a valid outcome.",
    proof: {
      label: "The example run",
      from: { n: (run) => String(run.claims.length), after: "candidate findings" },
      to: { n: (run) => String(run.outcome.reported), after: "reported" },
    },
  },
  zh: {
    lines: ["安静，", "是设计", "出来的。"],
    lead: "什么都评论的审查者，很快就没人理。ocra 只在能引用代码、说清查过什么、并经得起第二遍复核时才开口。",
    outOfScope: ["风格", "猜测", "未改动的代码"],
    caption: "不在任何审查员的范围内。什么都不报，也是正常结果。",
    proof: {
      label: "示例运行",
      from: { n: (run) => String(run.claims.length), after: "条候选意见" },
      to: { before: "报告", n: (run) => String(run.outcome.reported), after: "条" },
    },
  },
};
