import type { Copy } from "./types";

export const zh: Copy = {
  announce: {
    text: "ocra Cloud 早期体验中：用 GitHub 登录，自带模型 key。",
    link: "它保存什么",
  },
  nav: {
    links: {
      how: "工作原理",
      product: "产品",
      security: "安全",
      pricing: "价格",
      docs: "文档",
    },
    github: "GitHub",
    signIn: "登录",
    start: "免费开始",
    menu: "打开菜单",
    theme: "切换深浅色",
  },
  hero: {
    title: "先读懂代码，",
    emphasis: "再开口的代码审查。",
    lede: "ocra 把一次改动拆成几个聚焦的审查任务。每个 agent 只能读你的仓库，必须引用它说的那段代码，还要经得起第二遍复核，才能出现在你的 PR 里。",
    cloud: "开始使用 ocra Cloud",
    selfHost: "自托管，Apache-2.0",
    note: "早期体验期间免费，自带模型 key。",
    poke: { up: "让蜘蛛爬上去", down: "让蜘蛛下来" },
  },
  window: {
    tabs: { pr: "Pull request", terminal: "终端", cloud: "ocra Cloud" },
    urls: {
      pr: "pull request #812 · Keep sessions alive after sign-in",
      terminal: "~/acme-app · ocra review --from main",
      cloud: "ocra Cloud · 概览",
    },
    example:
      "示例运行：流水线、输出和结论都来自 ocra 本身；控制台显示的是示例数据。",
    pr: {
      title: "Keep sessions alive after sign-in",
      meta: { into: "请求合并到", from: "来自", files: "改动 4 个文件" },
      reviewing: "正在审查这个 PR",
      reviewed: "审查了这个 PR",
      rereviewing: "正在复审新的推送",
      rereviewed: "复审了新的推送",
      replay: "重播",
      verdict: "结论：存在重大问题",
      verdictFixed: "结论：没有阻塞问题",
      rows: {
        reviewed: "审查范围",
        tasks: "任务",
        findings: "发现",
        cost: "花费",
      },
      values: {
        reviewed: "2 组共 4 个文件 · 1 个被搁置（生成文件）",
        tasks: "correctness、security · 2 个组合被跳过，均记录原因",
        findings: "1 个 critical，已核实 · 1 个合并 · 1 个被证伪",
        findingsFixed: "0 个待处理 · 1 个已被修复解决",
        tokens: "输入 token（209,152 命中缓存）",
      },
      onLine: "第",
      quoteTip: "agent 引用了这一行 · ocra 在 diff 中找到了它",
      findingTitle: "每个会话都被当成已过期。",
      findingBody:
        "expiresAt 以秒存储，却和以毫秒计的 Date.now() 比较，用户登录后会立刻被登出。",
      suggested: "建议修改",
      commit: "提交建议",
      commitHint: "试一下：ocra 会复审新的推送",
      resolved: "已解决",
      resolvedLine: "github-actions 解决了这个讨论 · 被引用的代码已不存在",
      side: {
        reviewers: "审查者",
        checks: "检查",
        files: "文件",
        reviewing: "ocra · 审查中",
        changes: "ocra · 要求修改",
        approved: "ocra · 已批准",
        running: "ocra review · 运行中",
        blocking: "ocra review · 1 个阻塞",
        passed: "ocra review · 通过",
        why: {
          session: "已读 · auth 代码，full 档",
          login: "已读 · auth 代码",
          docs: "已读 · 文档：只做 correctness",
          lock: "已搁置 · 生成文件",
        },
      },
    },
    console: {
      nav: ["概览", "活动", "审查", "模型 key", "默认模型", "CLI 会话", "设置"],
      stats: { reviews: "近 14 天审查", requests: "请求数", spend: "花费" },
    },
  },
  works: {
    title: "在团队已经在用的地方审查，用你已经在付费的模型。",
    body: "GitHub 上的 pull request、GitLab 上的 merge request，或任何本地分支。可以用 45 家模型服务商中任意一家的 key，或你自己的 OpenAI 兼容端点。",
    platforms: "平台",
    providers: "模型服务商",
    more: "另有 {count} 家可通过 ocra Cloud 接入，也可以接你自己运行的任何 OpenAI 兼容端点。",
    local: "本地分支",
  },
  how: {
    title: "不能出错的部分交给普通代码，",
    emphasis: "模型只做判断。",
    body: "选文件、分组、定位行号和给出结论，都是有测试的代码。模型只负责分组、审查、核实和裁决，它的每个回答都先通过 schema 校验，才进入下一步。",
    legend: { code: "确定性", model: "需判断" },
    steps: [
      {
        title: "只读值得读的文件",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "二进制、锁文件、生成的代码和疑似密钥会被搁置，每个都记录原因。涉及 auth/、CI workflow 这类敏感路径的改动直接定为 full 档。",
      },
      {
        title: "每组、每个审查员一个任务",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "由轻量模型把该一起看的文件分成组。correctness 总会运行；security 和 performance 跳过文档和测试。--plan 能在调用模型之前列出全部任务。",
      },
      {
        title: "每条意见都引用它说的代码",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: "每个隔离的 agent 用只读工具读取被审查的那个版本，最多执行 20 步。它引用代码，ocra 在 diff 里找到这段引用，把评论钉在那里。行号从来不由模型决定。",
      },
      {
        title: "只留下经得起重读的意见",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "核查去掉被代码证伪的意见；judge 合并同一根因，但不能去掉已确认的 critical。结论由代码计算。",
      },
    ],
    figures: {
      read: "已读",
      setAside: "已搁置：生成文件",
      tier: "风险档位",
      tierValue: "full · 涉及 auth/",
      task: "任务",
      skipDocs: "跳过：文档",
      planLine: "$ ocra review --plan · 调用模型之前就列出这些任务",
      readOnly: "只读，20 步",
      quotes: "agent 的引用",
      found: "ocra 在 diff 中找到它",
      ledger: {
        confirmed: "已确认",
        merged: "并入 #1",
        disproved: "被代码证伪",
        verdict: "结论：存在重大问题",
        critical: "1 个已核实的 critical",
      },
      claims: {
        sessions: "会话总被判为过期",
        refresh: "refresh() 里重复了同样的判断",
        token: "会话 token 没有轮换",
      },
    },
  },
  statement: {
    title: "安静，",
    emphasis: "是设计出来的。",
    body: "什么都评论的审查者，很快就没人理。ocra 只在能引用代码、说清查过什么、并经得起第二遍复核时才开口。风格、猜测和未改动的代码，不在任何审查员的范围内。什么都不报，也是正常结果。",
  },
  features: {
    title: "放心交给它",
    emphasis: "一个真实的仓库。",
    rules: {
      title: "团队规则，不用写插件",
      body: "把审查规则写进基础分支上的 .ocra/rules.json。本地审查时，插件还能通过一套很小的接口添加规则、审查员、工具和监听器。",
    },
    write: {
      title: "没有 agent 能写",
      body: "只能读文件、读 diff 和搜索。其他能力在第一次请求之前就关掉了。",
    },
    bill: {
      title: "每次尝试都有账单",
      body: "每个任务的 token 和花费，辅助调用也算在内。设置 maxCostUsd，运行到这个额度就停止花钱。",
      rows: ["输入", "缓存", "输出和推理", "本次合计"],
    },
    fallback: {
      title: "一个模型倒下，下一个接手",
      body: "每一档可以列出多个模型。过载就换下一个；额度用尽的模型在本次运行中不再使用。",
      chain: ["模型 A · 过载", "模型 B · 额度用尽", "模型 C · 审查中"],
    },
  },
  lifecycle: {
    title: "一条几秒就能",
    emphasis: "拿定主意的评论。",
    body: "推送之后它会跟着代码走。改掉那一行，ocra 自己解决讨论；拒绝它，ocra 就不再追问。",
    tabs: { reported: "已报告", fixed: "已修复", dismissed: "已拒绝" },
    notes: {
      reported:
        "只要被引用的代码没变，下次推送时这条意见仍然保持打开，即使没有审查员再次报告，同样的代码得到同样的结论。",
      fixed:
        "意见指向的代码已经不在文件里，ocra 自己解决这个讨论。这是它认定修复的唯一依据。",
      dismissed:
        "维护者拒绝了它。ocra 不再报告，它也不再计入结论，除非它以更严重的级别再次出现。PR 的作者本人不能这样做。",
    },
    caption: "已引用 · 已核实",
    reply: "这个 PR 先不修：已在 #812 跟踪。",
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
      { title: "最小的修复", body: "有建议修改时，可以直接在 PR 里应用。" },
    ],
  },
  security: {
    title: "为你不信任的",
    emphasis: "代码而设计。",
    body: "diff、PR 标题、AGENTS.md：改动里的任何内容都可能出自攻击者之手。ocra 默认就是这样，并把威胁模型和代码一起公开。",
    flow: {
      repo: "被审查版本的仓库",
      repoNote: "diff、文件、PR 文本：都是不可信数据",
      gate: "唯一的关口，在核心里强制执行",
      agents: "隔离的 agent · 每个 20 步",
      provider: "你的模型服务商",
      providerNote: "自托管时，唯一能看到代码的一方",
      outside: "仓库之外",
    },
    props: [
      {
        title: "不可信文本始终只是数据",
        body: "改动里的一切在放进提示词之前都会被中和；控制字符永远到不了你的终端。",
      },
      {
        title: "被审查的代码不会被执行",
        body: "审查 PR 时，不运行任何插件、安装脚本、仓库工具或构建。来自 fork 的 PR 走受控的 workflow。",
      },
      {
        title: "密钥不会外泄",
        body: "看起来像密钥的文件在关口就被拒绝。key 不会出现在日志、提示词、报告或会话文件里。",
      },
      {
        title: "子进程最小权限",
        body: "参数数组、不经过 shell，子进程只拿到它需要的环境变量。",
      },
    ],
    link: "阅读威胁模型",
  },
  plans: {
    title: "开源核心，",
    emphasis: "需要时再托管。",
    body: "引擎保持 Apache-2.0，不需要账号也完整可用。ocra Cloud 早期体验期间免费，模型 key 由你自带。",
    items: [
      {
        state: "现已可用",
        name: "自托管",
        price: "免费",
        unit: "Apache-2.0",
        points: [
          "CLI、GitHub Action、GitLab、容器镜像",
          "你的运行环境，你的模型 key",
          "只有你的模型服务商能看到代码",
          "自定义规则、审查员和插件",
        ],
        cta: "阅读快速上手",
      },
      {
        state: "早期体验",
        name: "ocra Cloud",
        price: "免费",
        unit: "自带 key",
        points: [
          "用 GitHub 登录；任何机器上 `ocra login`",
          "45 家服务商的 key，加密保存，保存时校验",
          "按天统计用量、花费和审查次数",
          "在网页上一次选好默认模型",
        ],
        cta: "用 GitHub 登录",
      },
      {
        state: "规划中",
        name: "团队版",
        price: "稍后",
        unit: "价格未定",
        points: [
          "托管的 GitHub App：不用 workflow，不用 secret",
          "组织级共享规则和策略",
          "由 ocra 提供模型，不需要 key",
          "按仓库保存审查历史",
        ],
        cta: "关注路线图",
        planned: true,
      },
    ],
    fine: "使用 ocra Cloud 时，你的改动会经过它的网关再到达你的模型服务商；控制台只保存计数，从不保存代码。如果只能让模型服务商看到代码，请自托管：引擎是同一个。",
  },
  faq: {
    title: "常见问题，",
    emphasis: "直接回答。",
    items: [
      {
        q: "ocra 免费吗？",
        a: "引擎、CLI 和 GitHub Action 都是 Apache-2.0，不需要账号。你只需向模型服务商支付审查用掉的 token，每次运行都会打印花费。ocra Cloud 在早期体验期间免费。",
      },
      {
        q: "谁能看到我的代码？",
        a: "自托管时，只有你的模型服务商：改动及其标题和描述、你的 AGENTS.md 和审查规则，以及 agent 在仓库里打开或搜索的内容。看起来像密钥的文件、仓库之外的任何东西都不会发送。使用 ocra Cloud 时，请求还会经过它的网关。",
      },
      {
        q: "支持哪些模型？",
        a: "通过 ocra Cloud 可用 45 家服务商中的任意一家，也可以用 OpenCode 支持的任何模型，或你自己按模型定价的 OpenAI 兼容端点。每一档可以列出多个模型，一个倒下，下一个接手。",
      },
      {
        q: "支持 GitLab 吗？",
        a: "支持：GitLab.com 或自建实例上的 merge request，行内评论、摘要和增量复审都和 GitHub 上一样。",
      },
      {
        q: "会不会把我的 PR 淹没在评论里？",
        a: "它就是为避免这一点而设计的。每条意见都会对照代码核实、按根因合并，只有经核查确认的 critical 才会拦下改动。很多运行最后一条评论也没有。",
      },
      {
        q: "效果怎么样？",
        a: "在 golden set 和 AACR-Bench 上的结果连同局限一起发布在手册里：样本小、只测了一个模型家族，召回率是我们正在改进的弱项。",
      },
    ],
  },
  final: {
    title: "拿一个你熟悉的",
    emphasis: "PR 试试看。",
    cloud: "开始使用 ocra Cloud",
    manual: "阅读手册",
  },
  footer: {
    tagline: "开源的代码审查，agent 先读再评。",
    columns: [
      {
        title: "产品",
        links: [
          { label: "工作原理", href: "#how" },
          { label: "产品", href: "#product" },
          { label: "价格", href: "#plans" },
          { label: "更新日志", href: "{repo}/blob/main/CHANGELOG.md" },
        ],
      },
      {
        title: "使用",
        links: [
          { label: "快速上手", href: "/docs/quickstart" },
          { label: "GitHub Action", href: "/docs/github" },
          { label: "GitLab", href: "/docs/gitlab" },
          { label: "模型服务商", href: "/docs/providers" },
        ],
      },
      {
        title: "信任",
        links: [
          { label: "威胁模型", href: "/docs/threat-model" },
          { label: "数据政策", href: "{cloud}/privacy" },
          { label: "安全政策", href: "{repo}/security/policy" },
          { label: "质量结果", href: "/docs/quality" },
        ],
      },
      {
        title: "项目",
        links: [
          { label: "GitHub", href: "{repo}" },
          { label: "路线图", href: "{repo}/blob/main/docs/roadmap.md" },
          { label: "Apache-2.0", href: "{repo}/blob/main/LICENSE" },
          { label: "English", href: "{other}" },
        ],
      },
    ],
  },
  dock: { start: "开始使用 ocra Cloud", copy: "复制", copied: "已复制" },
};
