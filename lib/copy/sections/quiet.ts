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
    body: "A reviewer that nitpicks everything trains teams to ignore it. Ocra anchors findings to quoted code, drops what verification disproves, and marks what it could not confirm. No inline findings? One summary, updated in place.",
    out: ["Style", "Speculation", "Guessing line numbers"],
    outNote: "Out of scope for every reviewer",
    tally: {
      candidates: (run) => `${run.claims.length} candidates`,
      reported: (run) => `${run.outcome.reported} reported`,
    },
  },
  zh: {
    title: "生来安静",
    body: "事无巨细都评论的审查工具，很快就会被团队静音。Ocra 用引用的代码定位问题，剔除已证伪的意见，并标注未能确认的问题。没有行内意见时，只保留一条原地更新的总结。",
    out: ["代码风格", "臆测", "猜测行号"],
    outNote: "不在任何审查员的范围内",
    tally: {
      candidates: (run) => `${run.claims.length} 条候选`,
      reported: (run) => `报告 ${run.outcome.reported} 条`,
    },
  },
};
