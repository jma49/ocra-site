import type { Copy } from "./types";

export const en: Copy = {
  hero: {
    title: "A code reviewer that reads before it comments.",
    subtitle:
      "ocra splits a change into focused review tasks. Each agent can only read your repository, has to quote the code it means, and must say what it checked. Most runs end with a handful of findings. Some end with none, and that is fine.",
    start: "Get started",
    github: "View source on GitHub",
    note: "Node 22+, any model OpenCode supports",
  },
  run: {
    title: "What happens when you run {command}",
    body: "The steps that must not go wrong are plain, tested code. Models are only asked for judgment.",
    legend: { code: "code", model: "model" },
    region: "The stages of a review",
    previous: "Previous stages",
    next: "Next stages",
    example: "example run",
    groups: [
      {
        title: "Only the files worth reading",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "Binaries, lock files, vendored and generated code, likely secrets and oversized diffs are set aside, each with a recorded reason. Churn and sensitive paths such as auth/ put the change in a trivial, lite or full tier.",
      },
      {
        title: "One task per group and reviewer",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "A cheap model groups files that belong together. Correctness always runs; security and performance join from the lite tier and skip documentation and tests. Every skipped pair is listed in the report, so a cheaper plan never hides a gap.",
      },
      {
        title: "Findings quote the code they mean",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: "An isolated agent per group and reviewer reads the exact revision under review with read-only tools, stops after 20 steps, and reports each issue by quoting code. ocra finds the quote in the diff and pins it to a line; the model never picks the line.",
      },
      {
        title: "Only what holds up on a second read",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
        ],
        text: "Findings the team already accepted are dropped before a model is paid to check them. A verifier rereads each one next to the code, and a judge merges the same root cause. Only a critical finding the verifier confirmed can block.",
      },
    ],
    figures: {
      read: "read",
      lockSetAside: "lock file, set aside",
      tier: "tier",
      touches: "touches auth/",
      authCode: "auth code",
      docs: "docs",
      threeFiles: "3 files",
      oneFile: "1 file",
      skip: "skip",
      tasks: "4 review tasks",
      skipped: "2 skipped pairs, listed in the report",
      agent: "agent",
      on: "on",
      off: "off",
      quote: "quote",
      matched: "matched in the diff",
      confirmed: "confirmed",
      merged: "merged into #1",
      disproved: "disproved",
      accepted: "accepted in memory",
      verdict: "verdict: significant concerns",
      verifiedCritical: "1 verified critical",
    },
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
        body: "Give each tier a list of models. Overloads move on to the next model, a model that keeps failing is paused for a while, short rate limits are waited out, and a model out of quota is dropped for the rest of the run.",
      },
    ],
    visuals: {
      outOfScope: ["style", "speculation", "missing tests", "untouched code"],
      machine: [
        "global OpenCode config",
        "installed skills",
        "instruction files",
      ],
      located: "located",
    },
  },
  anatomy: {
    title: "What a finding looks like",
    body: "An inline comment on the pull request, with enough to decide in a few seconds whether to fix it or dismiss it. What happens next is up to the code and the reviewers.",
    example: "Example pull request",
    callouts: {
      quote: "The line the agent quoted, found in the diff by ocra",
      lines:
        "Severity, whether the verifier confirmed it, and which reviewer found it",
      verified: "Why it is wrong, in plain words",
      suggestion: "The smallest fix, when there is one",
    },
    states: {
      reported: {
        tab: "Reported",
        text: "The finding stays open on the next push as long as its code is unchanged, even if no reviewer reports it again, so the same code keeps the same verdict.",
      },
      fixed: {
        tab: "Fixed",
        text: "The line the finding pointed at is gone from the new commit, so ocra resolves the thread itself. That is the only evidence it takes for a fix.",
        resolved: "github-actions resolved this conversation",
      },
      dismissed: {
        tab: "Dismissed",
        text: "A maintainer declined it. ocra stops reporting it and it no longer counts towards the verdict, unless it comes back more severe. The pull request's own author cannot do this.",
        reply: "Won't fix: this service stores expiresAt in milliseconds.",
        resolved: "maintainer resolved this conversation",
        who: "maintainer",
      },
    },
  },
  plugins: {
    title: "Your team's rules, as a plugin",
    body: "The Git and GitHub adapters, the OpenCode runtime and the three reviewers that ship today are plugins too. Yours get the same small contract: register rules, reviewers, tools or listeners, and receive your own settings.",
    points: [
      "Three lifecycle hooks, run in a fixed order",
      "Settings validated per plugin",
      "Clashing or late registrations fail with the plugin's name",
    ],
    cta: "Read the plugin guide",
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
        body: "Security and performance reviewers, a review matrix, verification, a judge and a fixed verdict rubric.",
        state: "shipped",
        done: true,
      },
      {
        milestone: "M3",
        title: "GitHub",
        body: "ocra review --pr and a GitHub Action: inline comments, one summary comment, and re-reviews of only what changed since the last push that resolve fixed threads and respect dismissals.",
        state: "shipped",
        done: true,
      },
      {
        milestone: "M4",
        title: "Hardening",
        body: "Circuit breakers per model, shared configuration over https, a review memory, and --ultra for recall.",
        state: "shipped",
        done: true,
      },
      {
        milestone: "Next",
        title: "Measured quality",
        body: "A baseline of precision and recall on AACR-Bench with a stronger model, then tuning prompts and stages against it.",
        state: "planned",
        done: false,
      },
      {
        milestone: "Next",
        title: "Deeper reviews",
        body: "Reviewers for docs and AGENTS.md, a planning phase and caller impact analysis for --ultra, model re-location of hard-to-anchor findings, and the judge reassessing disagreements.",
        state: "planned",
        done: false,
      },
      {
        milestone: "Next",
        title: "npm release",
        body: "Publishing the @open-cr-agent packages; today ocra installs from source.",
        state: "planned",
        done: false,
      },
    ],
  },
  start: {
    title: "Try it on a repository you know",
    body: "It runs against any Git repository on your machine, or on pull requests through the GitHub Action. Your model provider sees the change under review and the files the agents open, nothing else.",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Select and copy",
    docs: "Read the quickstart",
    tabs: { cli: "Local CLI", action: "GitHub Action" },
    actionNote:
      "Save it as .github/workflows/ocra.yml and store your model key as a repository secret. Every pull request gets inline comments and one summary.",
    actionDocs: "Read the GitHub guide",
  },
  footer: {
    tagline: "Open-source code review with agents that read first.",
    github: "GitHub",
    license: "Apache-2.0",
    manual: "Manual",
    wordmark: "ocra",
  },
};
