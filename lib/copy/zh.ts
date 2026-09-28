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
    title: "运行 {command}\n时发生了什么",
    body: "不能出错的步骤，都是普通的、有测试的代码。只有需要判断的地方才交给模型。",
    legend: { code: "代码", model: "模型" },
    region: "一次审查的各个阶段",
    previous: "上一组阶段",
    next: "下一组阶段",
    example: "示例运行",
    groups: [
      {
        title: "只读值得读的文件",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "二进制、锁文件、第三方和生成的代码、疑似密钥、过大的 diff 会被放到一边，每个都记录原因。改动量和 auth/ 这类敏感路径，决定这次改动属于 trivial、lite 还是 full 档。",
      },
      {
        title: "每组、每个审查员一个任务",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "由便宜的模型把该一起看的文件分成组。correctness 总会运行；security 和 performance 从 lite 档开始加入，并跳过文档和测试。每个被跳过的组合都写进报告，省下的钱不会掩盖覆盖上的缺口。",
      },
      {
        title: "每条意见都引用它说的代码",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: "每组每个审查员一个隔离的 agent，用只读工具读取被审查的那个版本，最多执行 20 步，用引用代码的方式报告问题。ocra 在 diff 里找到引用并定位到具体行；行号从来不由模型决定。",
      },
      {
        title: "只留下经得起重读的意见",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
        ],
        text: "团队已经接受过的问题，在花钱让模型核查之前就被去掉。核查模型把每条问题和代码放在一起重读，Judge 合并同一根因。只有经核查确认的 critical 才能拦下改动。",
      },
    ],
    figures: {
      read: "读取",
      lockSetAside: "锁文件，放到一边",
      tier: "档位",
      touches: "涉及 auth/",
      authCode: "auth 代码",
      docs: "文档",
      threeFiles: "3 个文件",
      oneFile: "1 个文件",
      skip: "跳过",
      tasks: "4 个审查任务",
      skipped: "跳过 2 个组合，写进报告",
      agent: "agent",
      on: "开",
      off: "关",
      quote: "引用",
      matched: "在 diff 里匹配到",
      confirmed: "已确认",
      merged: "并入 #1",
      disproved: "被证伪",
      accepted: "已被记忆接受",
      verdict: "结论：significant concerns",
      verifiedCritical: "1 条已核实的 critical",
    },
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
    visuals: {
      outOfScope: ["代码风格", "没有依据的推测", "缺少测试", "没改动的代码"],
      machine: ["OpenCode 全局配置", "已安装的 skill", "指令文件"],
      located: "定位到",
    },
  },
  anatomy: {
    title: "一条意见长什么样",
    body: "PR 上的一条行内评论，信息刚好够你在几秒内决定修还是忽略。之后怎么处理，取决于代码和审查者。",
    example: "示例 PR",
    callouts: {
      quote: "agent 引用的那一行，由 ocra 在 diff 里定位",
      lines: "严重程度、是否经过核查确认，以及是哪个审查员发现的",
      verified: "用平实的话说明错在哪里",
      suggestion: "有必要时，最小的修复",
    },
    states: {
      reported: {
        tab: "已报告",
        text: "下一次 push 时，只要这段代码没变，这条问题就保持打开，即使没有审查员再报一次。同样的代码，结论不会变。",
      },
      fixed: {
        tab: "已修复",
        text: "问题指向的那一行在新提交里已经不存在，ocra 会自己关闭这个讨论串。这是它认定已修复的唯一依据。",
        resolved: "github-actions 关闭了这个讨论",
      },
      dismissed: {
        tab: "已驳回",
        text: "维护者拒绝了这条问题。ocra 不再报告它，它也不再计入结论，除非它以更高的严重程度再次出现。PR 作者本人不能这样做。",
        reply: "Won't fix：这个服务里的 expiresAt 存的是毫秒。",
        resolved: "维护者关闭了这个讨论",
        who: "维护者",
      },
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
      {
        milestone: "下一步",
        title: "可度量的质量",
        body: "用更强的模型在 AACR-Bench 上测出准确率和召回率的基线，再据此调优提示词和各个阶段。",
        state: "规划中",
        done: false,
      },
      {
        milestone: "下一步",
        title: "更深入的审查",
        body: "文档和 AGENTS.md 审查员、--ultra 的计划阶段和调用方影响分析、难以定位的问题交给模型重新定位，以及由 Judge 重新评估“我不同意”的回复。",
        state: "规划中",
        done: false,
      },
      {
        milestone: "下一步",
        title: "发布到 npm",
        body: "发布 @open-cr-agent 的各个包；目前 ocra 需要从源码安装。",
        state: "规划中",
        done: false,
      },
    ],
  },
  start: {
    title: "拿一个你熟悉的仓库试试",
    body: "它可以在你本机的任何 Git 仓库上运行，也可以通过 GitHub Action 审查 PR。模型供应商能看到的，只有被审查的改动和 agent 打开过的文件。",
    copy: "复制",
    copied: "已复制",
    copyFailed: "请手动选中复制",
    docs: "阅读快速上手",
    tabs: { cli: "本地 CLI", action: "GitHub Action" },
    actionNote:
      "保存为 .github/workflows/ocra.yml，并把模型 key 存为仓库 secret。之后每个 PR 都会收到行内评论和一条摘要。",
    actionDocs: "阅读 GitHub 指南",
  },
  footer: {
    tagline: "先读代码再下结论的开源代码审查。",
    github: "GitHub",
    license: "Apache-2.0",
    manual: "手册",
    wordmark: "ocra",
  },
};
