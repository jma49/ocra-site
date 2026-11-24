import type { Bilingual, FromRun } from "../define";

// Why the reviewer is quiet: what it leaves out, and the run's tally.
interface QuietCopy {
  title: string;
  body: string;
  out: string[];
  outNote: string;
  tally: { candidates: FromRun; reported: FromRun };
}

export const quiet: Bilingual<QuietCopy> = {
  en: {
    title: "Quiet by design",
    body: "A reviewer that comments on everything gets ignored. Ocra speaks only when a finding quotes the code, says what it checked and holds up on a second read. A run with nothing worth saying leaves one summary and no inline comment.",
    out: ["Style", "Speculation", "Unchanged code"],
    outNote: "Out of scope for every reviewer",
    tally: {
      candidates: (run) => `${run.claims.length} candidates`,
      reported: (run) => `${run.outcome.reported} reported`,
    },
  },
  zh: {
    title: "生来安静",
    body: "什么都评论的审查者，最后会被所有人忽略。Ocra 只在一条意见引用了代码、说明了它查过什么、并经得住第二遍核查时才开口。没有值得说的问题时，它只留一条总结，不发行内评论。",
    out: ["代码风格", "臆测", "未改动的代码"],
    outNote: "不在任何审查员的范围内",
    tally: {
      candidates: (run) => `${run.claims.length} 条候选`,
      reported: (run) => `报告 ${run.outcome.reported} 条`,
    },
  },
};
