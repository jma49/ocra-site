import type { Copy } from "./types";

export const zh: Copy = {
  hero: {
    title: "先读懂代码，\n再开口的代码审查。",
    subtitle:
      "ocra 把一次改动拆成几个聚焦的审查任务。每个 agent 只能读你的仓库，必须引用它说的那段代码，还要交代自己查过什么。多数时候你会收到几条意见，有时一条也没有，这也是正常结果。",
    start: "快速上手",
    github: "在 GitHub 查看源码",
    note: "Node 22+，支持 OpenCode 能用的任何模型",
  },
  run: {
    title: "运行 ocra review 时发生了什么",
    window: "ocra — 流水线",
    body: "不能出错的步骤，都是普通的、有测试的代码。只有需要判断的地方才交给模型。",
    legend: { code: "代码", model: "模型", planned: "规划中" },
    stages: [
      {
        name: "Select",
        kind: "code",
        summary: "决定哪些文件值得读",
        detail:
          "二进制、锁文件、第三方和生成的代码、疑似密钥、过大的 diff 会被放到一边，每个都记录原因。数据库迁移始终保留。密钥文件无论如何都不会被重新纳入。",
      },
      {
        name: "Triage",
        kind: "code",
        summary: "判断风险",
        detail:
          "根据改动量和 auth/、crypto/ 这类敏感路径，把改动分到 trivial、lite 或 full 档。",
      },
      {
        name: "Bundle",
        kind: "model",
        summary: "把该一起看的文件放一组",
        detail:
          "由便宜的模型按文件编号分组：接口和实现放一起，各语言的翻译文件放一起。答案不合格就修补，或者退回一个文件一个任务。",
      },
      {
        name: "Matrix",
        kind: "code",
        summary: "为每组挑选审查员",
        detail:
          "correctness 总会运行。security 和 performance 从 lite 档开始加入，并跳过文档和测试。每个被跳过的组合都会写进报告，省下的钱不会掩盖覆盖上的缺口。",
      },
      {
        name: "Review",
        kind: "model",
        summary: "每组每个审查员一个隔离的 agent",
        detail:
          "agent 通过三个工具读取被审查的那个版本，用引用代码的方式报告问题。它没有 shell，不能写文件，最多执行 20 步。",
      },
      {
        name: "Anchor",
        kind: "code",
        summary: "找到 ocra 要指向的那几行",
        detail:
          "引用的代码依次在改动过的代码段、整个文件、其他改动文件里匹配。都匹配不上，问题就挂在文件上，而不是消失。",
      },
      {
        name: "Filter",
        kind: "code",
        summary: "去掉团队已经定过的问题",
        detail:
          "仓库记忆里已接受的问题、PR 上被审查者驳回的问题，会在花钱让模型核查之前就去掉。审查 PR 时还会和上一次的结果对比：只有问题指向的代码已经不在了，才算修复。",
      },
      {
        name: "Verify",
        kind: "model",
        summary: "对照 diff 核查每条问题",
        detail:
          "模型把每个文件的问题和它的 diff、问题附近的代码放在一起重读。只有当代码能证明某条问题是错的，它才会被删掉，原因会留在报告里；其余的标为已确认或未确认。",
      },
      {
        name: "Judge",
        kind: "model",
        summary: "合并重复，定下严重程度",
        detail:
          "由更强的模型通读所有审查员的意见：合并同一根因，去掉吹毛求疵，校准严重程度。结论本身由固定规则给出，相同的问题总会得到相同的结论，而且只有经核查确认的 critical 才能拦下改动。",
      },
    ],
  },
  decisions: {
    title: "刻意做出的几个取舍",
    body: "每一条都有代价，我们认为值得。",
    items: [
      {
        title: "行号从来不由模型决定。",
        body: "模型不擅长行号，却很擅长引用。所以让它引用，由 ocra 去找行号。",
      },
      {
        title: "审查员被明确告知哪些别管。",
        body: "代码风格、没有依据的推测、缺少测试、没改动的代码，每个提示词里都排除在外。意见变少了，但没有变弱。",
      },
      {
        title: "没有任何东西拥有写权限。",
        body: "agent 能读文件、读 diff、搜索代码。编辑、shell 和网络工具全部关闭。",
      },
      {
        title: "你本机的东西不进提示词。",
        body: "在发出第一个请求之前，本机的 OpenCode 配置、已安装的 skill 和指令文件都会被关掉。",
      },
      {
        title: "每次调用都有账单。",
        body: "输入、输出、推理和缓存 token，以及花费，按每次模型调用和每次运行分别列出。",
      },
      {
        title: "一个模型倒下，下一个接手。",
        body: "给每个层级配一串模型。遇到过载就换下一个；反复失败的模型会暂停一段时间，短暂限流会等待后重试，额度用尽的模型在本次运行里不再使用。",
      },
    ],
  },
  anatomy: {
    title: "一条意见长什么样",
    body: "信息刚好够你在几秒内决定修还是忽略。",
    callouts: {
      quote: "agent 引用的那一行",
      lines: "ocra 定位到的位置",
      evidence: "agent 用工具查证过的事实",
      suggestion: "有必要时，最小的修复",
    },
  },
  plugins: {
    title: "把团队规范写成插件",
    body: "Git 和 GitHub 适配器、OpenCode 运行时，以及目前自带的三个审查员，本身也是插件。你写的插件用的是同一套接口：注册规则、审查员、工具或事件监听，并拿到只属于自己的设置。",
    points: [
      "三个生命周期钩子，按固定顺序执行",
      "每个插件的设置单独校验",
      "注册冲突或越界注册时报错，并指出是哪个插件",
    ],
    cta: "阅读插件指南",
  },
  status: {
    title: "目前进展",
    window: "ocra — 路线图",
    items: [
      {
        milestone: "M1",
        title: "本地审查",
        body: "CLI、文件选择、分组、行号定位、correctness 审查员、OpenCode 运行时、插件、评测工具。",
        state: "已发布",
        done: true,
      },
      {
        milestone: "M2",
        title: "更多审查员",
        body: "安全与性能审查员、审查矩阵、逐条核查、最终裁决，以及固定的结论规则。",
        state: "已发布",
        done: true,
      },
      {
        milestone: "M3",
        title: "GitHub",
        body: "ocra review --pr 和 GitHub Action：行内评论、一条摘要评论；之后的 push 只复审改动过的部分，自动关闭已修复的评论串，并尊重人工驳回。",
        state: "已发布",
        done: true,
      },
      {
        milestone: "M4",
        title: "加固",
        body: "每个模型的熔断器、通过 https 共享的配置、审查记忆，以及追求召回率的 --ultra 模式。",
        state: "已发布",
        done: true,
      },
    ],
  },
  start: {
    title: "拿一个你熟悉的仓库试试",
    body: "它可以在你本机的任何 Git 仓库上运行，也可以通过 GitHub Action 审查 PR。模型供应商能看到的，只有被审查的改动和 agent 打开过的文件。",
    copy: "复制",
    copied: "已复制",
    docs: "阅读快速上手",
  },
  footer: {
    tagline: "先读代码再下结论的开源代码审查。",
    github: "GitHub",
    license: "Apache-2.0",
    manual: "手册",
  },
};
