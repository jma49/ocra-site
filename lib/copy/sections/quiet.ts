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
    body: "A reviewer that nitpicks everything trains teams to ignore it. Ocra speaks only when a finding quotes exact code, explains what it verified, and survives a second read. Nothing worth saying? One clean summary and zero inline noise.",
    out: ["Style", "Speculation", "Unchanged code"],
    outNote: "Out of scope for every reviewer",
    tally: {
      candidates: (run) => `${run.claims.length} candidates`,
      reported: (run) => `${run.outcome.reported} reported`,
    },
  },
  zh: {
    title: "生来安静",
    body: "事无巨细都评论的审查工具，很快就会被团队静音。Ocra 只在能引用确切代码、说清核查依据并经得起第二遍复核时才开口。没有真问题时，只留一条简洁总结，零行内噪音。",
    out: ["代码风格", "臆测", "未改动的代码"],
    outNote: "不在任何审查员的范围内",
    tally: {
      candidates: (run) => `${run.claims.length} 条候选`,
      reported: (run) => `报告 ${run.outcome.reported} 条`,
    },
  },
};
