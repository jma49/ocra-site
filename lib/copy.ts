export type StageKind = "code" | "model" | "planned";

export interface Copy {
  hero: {
    status: string;
    title: string;
    subtitle: string;
    start: string;
    github: string;
    note: string;
  };
  run: {
    title: string;
    body: string;
    window: string;
    legend: Record<StageKind, string>;
    stages: {
      name: string;
      kind: StageKind;
      summary: string;
      detail: string;
    }[];
  };
  decisions: {
    title: string;
    body: string;
    items: { title: string; body: string }[];
  };
  anatomy: {
    title: string;
    body: string;
    callouts: {
      quote: string;
      lines: string;
      evidence: string;
      suggestion: string;
    };
  };
  plugins: { title: string; body: string; points: string[]; cta: string };
  status: {
    title: string;
    window: string;
    items: {
      milestone: string;
      title: string;
      body: string;
      state: string;
      done: boolean;
    }[];
  };
  start: {
    title: string;
    body: string;
    copy: string;
    copied: string;
    docs: string;
  };
  footer: { tagline: string; github: string; license: string; manual: string };
}

const en: Copy = {
  hero: {
    status: "M1 shipped · runs locally · Apache-2.0",
    title: "A code reviewer that reads before it comments.",
    subtitle:
      "ocra splits a change into focused review tasks. Each agent can only read your repository, has to quote the code it means, and must say what it checked. Most runs end with a handful of findings. Some end with none, and that is fine.",
    start: "Quickstart",
    github: "Source on GitHub",
    note: "Node 22+, any model OpenCode supports",
  },
  run: {
    title: "What happens when you run ocra review",
    window: "ocra — pipeline",
    body: "The steps that must not go wrong are plain, tested code. Models are only asked for judgment.",
    legend: { code: "code", model: "model", planned: "planned" },
    stages: [
      {
        name: "Select",
        kind: "code",
        summary: "Decide which files are worth reading",
        detail:
          "Binaries, lock files, vendored and generated code, likely secrets and oversized diffs are set aside, each with a recorded reason. Migrations are always kept. A secret can never be opted back in.",
      },
      {
        name: "Triage",
        kind: "code",
        summary: "Size up the risk",
        detail:
          "Churn and sensitive paths such as auth/ or crypto/ put the change in a trivial, lite or full tier.",
      },
      {
        name: "Bundle",
        kind: "model",
        summary: "Group files that belong together",
        detail:
          "A cheap model groups files by index: an interface with its implementation, translations together. Bad answers are repaired or fall back to one file per task.",
      },
      {
        name: "Review",
        kind: "model",
        summary: "One isolated agent per group",
        detail:
          "The agent reads the exact revision under review through three tools and reports each issue by quoting code. It has no shell, cannot write, and stops after 20 steps.",
      },
      {
        name: "Anchor",
        kind: "code",
        summary: "Find the lines ocra will point at",
        detail:
          "The quote is matched in the changed hunks, then the whole file, then the other changed files. If nothing matches, the finding stays on the file instead of disappearing.",
      },
      {
        name: "Verify",
        kind: "planned",
        summary: "Check each finding against the diff",
        detail:
          "Coming in M2. Only findings the diff proves wrong will be dropped.",
      },
      {
        name: "Judge",
        kind: "planned",
        summary: "Merge duplicates, settle severity",
        detail:
          "Coming in M2. A stronger model reads all reviewers' findings together and decides the verdict.",
      },
    ],
  },
  decisions: {
    title: "Decisions we made on purpose",
    body: "Each of these costs something. We think the trade is worth it.",
    items: [
      {
        title: "The model never picks the line.",
        body: "Models are bad at line numbers and good at quoting. So they quote, and ocra finds the lines.",
      },
      {
        title: "Reviewers are told what to leave alone.",
        body: "Style, speculation, missing tests and untouched code are out of scope in every prompt. You get fewer comments, not weaker ones.",
      },
      {
        title: "Nothing runs with write access.",
        body: "Agents can read files, read diffs and search. Editing, shell and network tools are switched off.",
      },
      {
        title: "Your machine stays out of the prompt.",
        body: "Local OpenCode config, installed skills and instruction files are disabled before the first request.",
      },
      {
        title: "Every attempt shows its bill.",
        body: "Input, output, reasoning and cached tokens, with cost, per model call and per run.",
      },
      {
        title: "When a model falls over, the next one takes the task.",
        body: "Give each tier a list of models. Overloads and quota errors move on; a model that keeps failing is skipped for the rest of the run.",
      },
    ],
  },
  anatomy: {
    title: "What a finding looks like",
    body: "Enough to decide in a few seconds whether to fix it or dismiss it.",
    callouts: {
      quote: "The line the agent quoted",
      lines: "Where ocra located it",
      evidence: "What the agent checked with its tools",
      suggestion: "The smallest fix, when there is one",
    },
  },
  plugins: {
    title: "Your team's rules, as a plugin",
    body: "The Git adapter, the OpenCode runtime and the reviewer that ships today are plugins too. Yours get the same small contract: register rules, reviewers, tools or listeners, and receive your own settings.",
    points: [
      "Three lifecycle hooks, run in a fixed order",
      "Settings validated per plugin",
      "Clashing or late registrations fail with the plugin's name",
    ],
    cta: "Plugin guide",
  },
  status: {
    title: "Where it stands",
    window: "ocra — roadmap",
    items: [
      {
        milestone: "M1",
        title: "Local review",
        body: "CLI, selection, bundling, anchoring, the correctness reviewer, OpenCode runtime, plugins, benchmark harness.",
        state: "shipped",
        done: true,
      },
      {
        milestone: "M2",
        title: "More reviewers",
        body: "Security and performance reviewers, verification, a judge, risk-based routing.",
        state: "next",
        done: false,
      },
      {
        milestone: "M3",
        title: "GitHub",
        body: "Inline comments on pull requests and incremental re-review.",
        state: "planned",
        done: false,
      },
      {
        milestone: "M4",
        title: "Hardening",
        body: "Circuit breakers, remote config, review memory, an --ultra mode for recall.",
        state: "planned",
        done: false,
      },
    ],
  },
  start: {
    title: "Try it on a repository you know",
    body: "It runs against any Git repository on your machine. Your model provider sees the change under review and the files the agents open, nothing else.",
    copy: "Copy",
    copied: "Copied",
    docs: "Read the quickstart",
  },
  footer: {
    tagline: "Open-source code review with agents that read first.",
    github: "GitHub",
    license: "Apache-2.0",
    manual: "Manual",
  },
};

const zh: Copy = {
  hero: {
    status: "M1 已发布 · 本地运行 · Apache-2.0",
    title: "先读懂代码，\n再开口的代码审查。",
    subtitle:
      "ocra 把一次改动拆成几个聚焦的审查任务。每个 agent 只能读你的仓库，必须引用它说的那段代码，还要交代自己查过什么。多数时候你会收到几条意见，有时一条也没有，这也是正常结果。",
    start: "快速上手",
    github: "GitHub 源码",
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
        name: "Review",
        kind: "model",
        summary: "每组一个隔离的 agent",
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
        name: "Verify",
        kind: "planned",
        summary: "对照 diff 核查每条问题",
        detail: "M2 实现。只会删掉能被 diff 证明是错的问题。",
      },
      {
        name: "Judge",
        kind: "planned",
        summary: "合并重复，定下严重程度",
        detail: "M2 实现。由更强的模型通读所有审查员的意见，给出最终结论。",
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
        body: "给每个层级配一串模型。遇到过载或额度用完就换下一个；反复失败的模型在本次运行里会被跳过。",
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
    body: "Git 适配器、OpenCode 运行时和目前唯一的审查员本身也是插件。你写的插件用的是同一套接口：注册规则、审查员、工具或事件监听，并拿到只属于自己的设置。",
    points: [
      "三个生命周期钩子，按固定顺序执行",
      "每个插件的设置单独校验",
      "注册冲突或越界注册时报错，并指出是哪个插件",
    ],
    cta: "插件指南",
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
        body: "安全与性能审查员、逐条核查、最终裁决、按风险分派。",
        state: "下一步",
        done: false,
      },
      {
        milestone: "M3",
        title: "GitHub",
        body: "PR 行内评论和增量复审。",
        state: "规划中",
        done: false,
      },
      {
        milestone: "M4",
        title: "加固",
        body: "熔断器、远程配置、审查记忆，以及追求召回率的 --ultra 模式。",
        state: "规划中",
        done: false,
      },
    ],
  },
  start: {
    title: "拿一个你熟悉的仓库试试",
    body: "它可以在你本机的任何 Git 仓库上运行。模型供应商能看到的，只有被审查的改动和 agent 打开过的文件。",
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

export function getCopy(locale: string): Copy {
  return locale === "zh" ? zh : en;
}
