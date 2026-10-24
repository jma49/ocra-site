import type { Bilingual, Lines } from "../define";

type LifeState = "reported" | "fixed" | "dismissed";

interface LifecycleCopy {
  label: string;
  lines: Lines;
  body: string;
  tabs: Record<LifeState, string>;
  tablist: string;
  pause: { pause: string; play: string };
  notes: Record<LifeState, string>;
  // Visible under the thread: its pushes and replies are not in the recording.
  caption: string;
  illustration: string;
  status: { open: string; resolved: string };
  outdated: string;
  pushed: string;
  reply: string;
  maintainer: string;
  resolvedBot: string;
  resolvedMaintainer: string;
  keys: { title: string; body: string }[];
}

export const lifecycle: Bilingual<LifecycleCopy> = {
  en: {
    label: "One finding, after you push",
    lines: ["A comment you can", "decide on in seconds."],
    body: "It follows the code after you push. Fix the line and ocra resolves the thread; decline it and ocra stops asking.",
    tabs: { reported: "Reported", fixed: "Fixed", dismissed: "Dismissed" },
    tablist: "The finding's states",
    pause: { pause: "Pause the states", play: "Play the states" },
    notes: {
      reported:
        "The finding stays open on the next push as long as its code is unchanged, even if no reviewer reports it again, so the same code keeps the same verdict.",
      fixed:
        "The code the finding pointed at is no longer in the file, so ocra resolves the thread itself. That is the only evidence it takes for a fix.",
      dismissed:
        "A maintainer declined it. ocra stops reporting it and it no longer counts towards the verdict, unless it comes back more severe. The pull request's own author cannot do this.",
    },
    caption:
      "What happens to the example run's finding after a push, illustrated: these pushes and replies are not in the recording.",
    illustration: "Illustration",
    status: { open: "Open", resolved: "Resolved" },
    outdated: "Outdated",
    pushed: "the author pushed a commit",
    reply: "Won't fix in this PR; tracked separately.",
    maintainer: "maintainer",
    resolvedBot: "github-actions resolved this conversation",
    resolvedMaintainer: "maintainer resolved this conversation",
    keys: [
      {
        title: "The quoted line",
        body: "The agent quoted it; ocra found it in the diff and anchored the comment there.",
      },
      {
        title: "Severity and evidence",
        body: "Whether the verifier confirmed it, which reviewer found it, and an id that survives pushes.",
      },
      {
        title: "Why it is wrong",
        body: "In plain words, with the consequence.",
      },
      {
        title: "The smallest fix",
        body: "Written at the end of the comment as a suggestion, when there is one.",
      },
    ],
  },
  zh: {
    label: "推送之后的一条意见",
    lines: ["一条几秒就能", "拿定主意的评论。"],
    body: "推送之后它会跟着代码走。改掉那一行，ocra 自己解决讨论；拒绝它，ocra 就不再追问。",
    tabs: { reported: "已报告", fixed: "已修复", dismissed: "已拒绝" },
    tablist: "这条意见的状态",
    pause: { pause: "暂停切换", play: "继续切换" },
    notes: {
      reported:
        "只要被引用的代码没变，下次推送时这条意见仍然保持打开，即使没有审查员再次报告，同样的代码得到同样的结论。",
      fixed: "意见指向的代码已经不在文件里，ocra 自己解决这个讨论。这是它认定修复的唯一依据。",
      dismissed:
        "维护者拒绝了它。ocra 不再报告，它也不再计入结论，除非它以更严重的级别再次出现。PR 的作者本人不能这样做。",
    },
    caption: "示意：示例运行的这条意见在推送之后会怎样。这些推送和回复不在录制里。",
    illustration: "示意",
    status: { open: "未解决", resolved: "已解决" },
    outdated: "已过时",
    pushed: "作者推送了一个提交",
    reply: "这个 PR 先不修，另行跟踪。",
    maintainer: "维护者",
    resolvedBot: "github-actions 解决了这个讨论",
    resolvedMaintainer: "维护者解决了这个讨论",
    keys: [
      {
        title: "被引用的那一行",
        body: "agent 引用了它；ocra 在 diff 中找到它，把评论钉在那里。",
      },
      {
        title: "严重度和证据",
        body: "核查是否确认、哪个审查员发现的，以及一个跨推送不变的 id。",
      },
      { title: "为什么有问题", body: "用平实的话说明，并说清后果。" },
      {
        title: "最小的修复",
        body: "有可行的修复时，以建议的形式写在评论末尾。",
      },
    ],
  },
};
