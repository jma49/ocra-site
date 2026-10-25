import type { Bilingual, Lines } from "../define";

type LifeState = "open" | "fixed" | "dismissed";

interface LifecycleCopy {
  label: string;
  lines: Lines;
  // The states of a finding after a push; Dismissed is the other ending.
  statesLabel: string;
  states: Record<LifeState, { name: string; body: string }>;
  // Visible beside the desk: its pushes are not in the recording.
  illustration: string;
  caption: string;
  // The desk for screen readers, once it has played.
  scene: string;
  // A sheet's head: fill(push, { n }).
  push: string;
  // The card's last line: the thread's state.
  thread: { key: string; open: string; resolved: string };
}

export const lifecycle: Bilingual<LifecycleCopy> = {
  en: {
    label: "One finding, after you push",
    lines: ["It follows", "the code."],
    statesLabel: "What happens to a finding on the next push",
    states: {
      open: {
        name: "Open",
        body: "Its code is unchanged, so it stays open on the next push, even if no reviewer reports it again.",
      },
      fixed: {
        name: "Fixed",
        body: "The quoted line is gone from the file, so ocra resolves the thread. That is the only evidence it takes.",
      },
      dismissed: {
        name: "Dismissed",
        body: "A maintainer declined it, so ocra stops reporting it unless it returns more severe. The author cannot.",
      },
    },
    illustration: "Illustration",
    caption: "The example run's finding after a push. These pushes are not in the recording.",
    scene:
      "Two printouts of src/auth/session.ts. The second push lies on the first. On the first, line 42 is marked in red, with the fix, times 1000, in the margin; on the second, line 42 is printed with the fix. The finding's card, Every session is treated as expired, critical, has moved to the second push, and the old red mark is ticked: resolved by ocra.",
    push: "push {n}",
    thread: { key: "thread", open: "open", resolved: "resolved by ocra" },
  },
  zh: {
    label: "推送之后的一条意见",
    lines: ["它跟着", "代码走。"],
    statesLabel: "下次推送时，一条意见会怎样",
    states: {
      open: {
        name: "未解决",
        body: "被引用的代码没变，下次推送时它仍然打开，即使没有审查员再次报告。",
      },
      fixed: {
        name: "已修复",
        body: "被引用的那一行已不在文件里，ocra 自己解决这个讨论。这是它认定修复的唯一依据。",
      },
      dismissed: {
        name: "已拒绝",
        body: "维护者拒绝了它，ocra 不再报告，除非它以更严重的级别再次出现。作者本人不能这样做。",
      },
    },
    illustration: "示意",
    caption: "示例运行的这条意见在推送之后会怎样。这些推送不在录制里。",
    scene:
      "两张打印出来的 src/auth/session.ts。第二次推送叠在第一次上面。第一张的第 42 行有红笔标记，页边写着修复：乘以 1000；第二张的第 42 行印着修复后的代码。这条意见的卡片（Every session is treated as expired，critical）已经移到第二张上，旧的红笔标记被打了勾：已由 ocra 解决。",
    push: "推送 {n}",
    thread: { key: "讨论", open: "未解决", resolved: "已由 ocra 解决" },
  },
};
