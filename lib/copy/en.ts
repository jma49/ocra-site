import type { Copy } from "./types";

export const en: Copy = {
  announce: {
    label: "Announcement",
    text: "ocra Cloud is in early access. Sign in with GitHub and bring your own model key.",
    link: "What it stores",
  },
  nav: {
    links: {
      how: "How it works",
      product: "Product",
      security: "Security",
      pricing: "Pricing",
      docs: "Docs",
    },
    github: "GitHub",
    signIn: "Sign in",
    start: "Start free",
    menu: "Open menu",
    theme: "Toggle colour theme",
  },
  hero: {
    title: "Code review that reads",
    emphasis: "before it comments.",
    lede: "ocra splits a change into focused review tasks. Each agent can only read your repository, has to quote the code it means, and must survive a second read before it reaches your pull request.",
    cloud: "Start with ocra Cloud",
    selfHost: "Self-host, Apache-2.0",
    note: "Free during early access. Bring your own model key.",
    poke: { up: "Send the spider up", down: "Let the spider down" },
  },
  window: {
    tabs: { pr: "Pull request", terminal: "Terminal", cloud: "ocra Cloud" },
    urls: {
      pr: "pull request #812 · Keep sessions alive after sign-in",
      terminal: "~/acme-app · ocra review --from main",
      cloud: "ocra Cloud · Overview",
    },
    example:
      "An example run: the pipeline, output and verdict are ocra's own; the console shows sample data.",
    pr: {
      title: "Keep sessions alive after sign-in",
      meta: {
        into: "wants to merge into",
        from: "from",
        files: "4 files changed",
      },
      reviewing: "is reviewing this pull request",
      reviewed: "reviewed this pull request",
      replay: "Replay",
      verdict: "Verdict: significant concerns",
      rows: {
        reviewed: "Reviewed",
        tasks: "Tasks",
        findings: "Findings",
        cost: "Cost",
      },
      values: {
        reviewed: "4 files in 2 bundles · 1 set aside (generated)",
        tasks: "correctness, security · 2 pairs skipped with a reason",
        findings: "1 critical, verified · 1 merged · 1 disproved",
        tokens: "tokens in (209,152 cached)",
      },
      onLine: "line",
      quoteTip: "the agent quoted this line · ocra found it in the diff",
      findingTitle: "Every session is treated as expired.",
      findingBody:
        "expiresAt is stored in seconds and compared with Date.now() in milliseconds, so users are logged out right after signing in.",
      side: {
        reviewers: "Reviewers",
        checks: "Checks",
        files: "Files",
        reviewing: "ocra · reviewing",
        changes: "ocra · changes requested",
        running: "ocra review · running",
        blocking: "ocra review · 1 blocking",
        why: {
          session: "read · auth code, full tier",
          login: "read · auth code",
          docs: "read · docs: correctness only",
          lock: "set aside · generated",
        },
      },
    },
    console: {
      nav: [
        "Overview",
        "Activity",
        "Reviews",
        "Provider keys",
        "Default models",
        "CLI sessions",
        "Settings",
      ],
      stats: {
        reviews: "Reviews, 14 days",
        requests: "Requests",
        spend: "Spend",
      },
    },
  },
  works: {
    title:
      "Reviews where your team already works, with the model you already pay for.",
    body: "Pull requests on GitHub, merge requests on GitLab, or any local branch. Bring a key from any of 45 providers, or your own OpenAI-compatible endpoint.",
    platforms: "Platforms",
    providers: "Model providers",
    more: "and {count} more through ocra Cloud, or any OpenAI-compatible endpoint you run.",
    local: "Local branches",
  },
  how: {
    title: "Plain code for what must not go wrong.",
    emphasis: "Models only for judgment.",
    body: "Selection, bundling, anchoring and the verdict are tested code. A model is asked to group files, review, verify and judge, and every answer is checked against a schema before it moves on.",
    legend: { code: "deterministic", model: "judgment" },
    steps: [
      {
        title: "Only the files worth reading",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "Binaries, lock files, generated code and likely secrets are set aside, each with a recorded reason. Sensitive paths such as auth/ or CI workflows make the change full tier.",
      },
      {
        title: "One task per group and reviewer",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "A light model groups files that belong together. Correctness always runs; security and performance skip docs and tests. --plan lists every task before a model is paid.",
      },
      {
        title: "Findings quote the code they mean",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: "An isolated agent reads the exact revision with read-only tools and stops after 20 steps. It quotes the code; ocra finds the quote in the diff and pins the comment there. The model never picks the line.",
      },
      {
        title: "Only what holds up on a second read",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "A verifier drops what the code disproves. A judge merges the same root cause, but can never drop a confirmed critical. The verdict is computed in code.",
      },
    ],
    figures: {
      read: "read",
      setAside: "set aside: generated",
      tier: "Risk tier",
      tierValue: "full · touches auth/",
      task: "task",
      skipDocs: "skip: docs",
      planLine: "$ ocra review --plan · lists these before a model is called",
      readOnly: "read-only, 20 steps",
      quotes: "The agent quotes",
      found: "ocra finds it in the diff",
      ledger: {
        confirmed: "confirmed",
        merged: "merged into #1",
        disproved: "disproved by the code",
        verdict: "Verdict: significant concerns",
        critical: "1 verified critical",
      },
      claims: {
        sessions: "Sessions always read as expired",
        refresh: "Same check repeated in refresh()",
        token: "Session token is not rotated",
      },
    },
  },
  statement: {
    title: "Quiet",
    emphasis: "by design.",
    body: "A reviewer that comments on everything gets ignored. ocra stays quiet unless it can quote the code, say what it checked, and survive a second read. Style, speculation and unchanged code are out of scope for every reviewer. Reporting nothing is a valid outcome.",
  },
  features: {
    title: "Built to be trusted with",
    emphasis: "a real repository.",
    rules: {
      title: "Your team's rules, without writing a plugin",
      body: "Put review rules in .ocra/rules.json on the base branch. For local reviews, plugins can add rules, reviewers, tools and listeners through one small contract.",
    },
    write: {
      title: "No agent can write",
      body: "Read, diff and search. Everything else is off before the first request.",
    },
    bill: {
      title: "Every attempt shows its bill",
      body: "Tokens and dollars per task, helpers included. Set maxCostUsd and the run stops spending there.",
      rows: ["input", "cached", "output and reasoning", "run total"],
    },
    fallback: {
      title: "When a model falls over, the next takes the task",
      body: "Each tier lists several models. Overloads move on; a model out of quota is dropped for the rest of the run.",
      chain: [
        "model A · overloaded",
        "model B · out of quota",
        "model C · reviewing",
      ],
    },
  },
  lifecycle: {
    title: "A comment you can decide on",
    emphasis: "in seconds.",
    body: "It follows the code after you push. Fix the line and ocra resolves the thread; decline it and ocra stops asking.",
    tabs: { reported: "Reported", fixed: "Fixed", dismissed: "Dismissed" },
    notes: {
      reported:
        "The finding stays open on the next push as long as its code is unchanged, even if no reviewer reports it again, so the same code keeps the same verdict.",
      fixed:
        "The code the finding pointed at is no longer in the file, so ocra resolves the thread itself. That is the only evidence it takes for a fix.",
      dismissed:
        "A maintainer declined it. ocra stops reporting it and it no longer counts towards the verdict, unless it comes back more severe. The pull request's own author cannot do this.",
    },
    caption: "quoted · verified",
    reply: "Won't fix in this PR: tracked in #812.",
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
  security: {
    title: "Built for code you",
    emphasis: "do not trust.",
    body: "A diff, a pull request title, an AGENTS.md: anything in the change can be written by an attacker. ocra assumes it is, and publishes its threat model with the code.",
    flow: {
      repo: "your repository at the revision under review",
      repoNote: "diff, files, pull request text: untrusted data",
      gate: "one gate, enforced in core",
      agents: "isolated agents · 20 steps each",
      provider: "your model provider",
      providerNote: "the only party that sees the code when you self-host",
      outside: "outside the repo",
    },
    props: [
      {
        title: "Untrusted text stays data",
        body: "Everything from the change is neutralized before it enters a prompt; control characters never reach your terminal.",
      },
      {
        title: "Nothing from the reviewed tree runs",
        body: "For pull requests no plugin, install script, repository tool or build executes. Forks run behind a gated workflow.",
      },
      {
        title: "Secrets never leave",
        body: "Files that look like secrets are refused at the gate. Keys never appear in logs, prompts, reports or session files.",
      },
      {
        title: "Least privilege for processes",
        body: "Argument arrays, no shell, and only the environment variables a child process needs.",
      },
    ],
    link: "Read the threat model",
  },
  plans: {
    title: "Open core.",
    emphasis: "Hosted when you want it.",
    body: "The engine stays Apache-2.0 and complete without an account. ocra Cloud is free while it is in early access; you bring the model key.",
    items: [
      {
        state: "available now",
        name: "Self-hosted",
        price: "Free",
        unit: "Apache-2.0",
        points: [
          "CLI, GitHub Action, GitLab, container image",
          "Your runner and your model key",
          "Only your model provider sees the code",
          "Your own rules, reviewers and plugins",
        ],
        cta: "Read the quickstart",
      },
      {
        state: "early access",
        name: "ocra Cloud",
        price: "Free",
        unit: "bring your own key",
        points: [
          "Sign in with GitHub; `ocra login` from any machine",
          "Keys for 45 providers, encrypted, checked on save where the provider allows",
          "Usage, spend and review counts by day",
          "Default models chosen once, on the web",
        ],
        cta: "Sign in with GitHub",
      },
      {
        state: "planned",
        name: "Team",
        price: "Later",
        unit: "pricing not set",
        points: [
          "A hosted GitHub App: no workflow, no secrets",
          "Organizations with shared rules and policy",
          "Models provided by ocra, no key needed",
          "Review history per repository",
        ],
        cta: "Follow the roadmap",
        planned: true,
      },
    ],
    fine: "With ocra Cloud your change passes through its gateway on the way to your model provider, and the console keeps counts by default; findings and the code they quote only if you turn on findings sharing. If nothing but your provider may see the code, self-host: it is the same engine.",
  },
  faq: {
    title: "Questions,",
    emphasis: "answered plainly.",
    items: [
      {
        q: "Is ocra free?",
        a: "The engine, the CLI and the GitHub Action are Apache-2.0 and need no account. You pay your model provider for the tokens a review uses, and every run prints its cost. ocra Cloud is free during early access.",
      },
      {
        q: "Who sees my code?",
        a: "Self-hosted, only your model provider: the change with its title and description, your AGENTS.md and review rules, and what the agents open or search in the repository. Never files that look like secrets, or anything outside the repository. With ocra Cloud the request also passes through its gateway.",
      },
      {
        q: "Which models does it work with?",
        a: "Any of 45 providers through ocra Cloud, any model OpenCode supports, or your own OpenAI-compatible endpoint with a price per model. Each tier can list several models; when one falls over, the next takes the task.",
      },
      {
        q: "Does it work with GitLab?",
        a: "Yes: merge requests on GitLab.com or self-managed, with the same inline comments, summary and incremental re-reviews as on GitHub.",
      },
      {
        q: "Will it bury my pull requests in comments?",
        a: "It is built not to. Findings are verified against the code and merged by root cause, and the verdict only blocks on a critical the verifier confirmed. Many runs end with no comment at all.",
      },
      {
        q: "How good is it?",
        a: "Results on a golden set and AACR-Bench are published in the manual with their limits: a small sample on one model family, with recall the weak point we are working on.",
      },
    ],
  },
  final: {
    title: "Point it at a pull request",
    emphasis: "you already know.",
    cloud: "Start with ocra Cloud",
    manual: "Read the manual",
  },
  footer: {
    tagline: "Open-source code review with agents that read first.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "How it works", href: "#how" },
          { label: "Product", href: "#product" },
          { label: "Pricing", href: "#plans" },
          { label: "Changelog", href: "{repo}/blob/main/CHANGELOG.md" },
        ],
      },
      {
        title: "Run it",
        links: [
          { label: "Quickstart", href: "/docs/quickstart" },
          { label: "GitHub Action", href: "/docs/github" },
          { label: "GitLab", href: "/docs/gitlab" },
          { label: "Model providers", href: "/docs/providers" },
        ],
      },
      {
        title: "Trust",
        links: [
          { label: "Threat model", href: "/docs/threat-model" },
          { label: "Data policy", href: "{cloud}/privacy" },
          { label: "Security policy", href: "{repo}/security/policy" },
          { label: "Quality results", href: "/docs/quality" },
        ],
      },
      {
        title: "Project",
        links: [
          { label: "GitHub", href: "{repo}" },
          { label: "Roadmap", href: "{repo}/blob/main/docs/roadmap.md" },
          { label: "Apache-2.0", href: "{repo}/blob/main/LICENSE" },
          { label: "中文", href: "{other}" },
        ],
      },
    ],
  },
  dock: { start: "Start with ocra Cloud", copy: "Copy", copied: "Copied" },
};
