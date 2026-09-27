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
    title: "What happens when you run ocra review",
    window: "ocra — pipeline",
    body: "The steps that must not go wrong are plain, tested code. Models are only asked for judgment.",
    legend: { code: "code", model: "model", planned: "planned" },
    flow: {
      label: "Example run",
      report: "Report",
      play: "Play",
      pause: "Pause",
      previous: "Previous step",
      next: "Next step",
      files: "Changed files",
      findings: "Findings",
      tier: "full tier: the change touches auth/",
      bundle: "Bundle",
      skipped: "skipped by scope: docs only",
      verdict: "Verdict: significant concerns",
      reasons: {
        lock: "lock file, set aside",
        memory: "accepted in .ocra/memory.json",
        disproved: "disproved: token.ts:31 revokes the token on logout",
        merged: "merged into #1: same root cause",
        verified: "verified",
      },
      captions: [
        "Five files changed. The lock file is set aside with its reason; four are worth reading.",
        "A change under auth/ is sensitive, so the whole change gets the full tier and every reviewer.",
        "A cheap model groups the files: the auth code together, the docs on their own.",
        "Each bundle gets the reviewers whose scope fits. Security and performance skip the docs bundle, and the report lists why.",
        "Four isolated agents read the code with read-only tools and report four findings, each quoting the code it means.",
        "ocra finds each quote in the diff and pins it to a line. The model never picks the line.",
        "One finding was accepted by the team earlier, so it is dropped before a model is paid to check it.",
        "The verifier rereads each finding next to the code: one is disproved, two are confirmed.",
        "The judge sees every reviewer's findings together and merges the two that share a root cause.",
        "One verified critical finding is reported on src/auth/session.ts:42. A confirmed critical sets the verdict.",
      ],
    },
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
        name: "Matrix",
        kind: "code",
        summary: "Pick reviewers per group",
        detail:
          "Correctness always runs. Security and performance join from the lite tier and skip documentation and tests. Every skipped pair is listed in the report, so a cheaper plan never hides a gap.",
      },
      {
        name: "Review",
        kind: "model",
        summary: "One isolated agent per group and reviewer",
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
        name: "Filter",
        kind: "code",
        summary: "Drop what the team already settled",
        detail:
          "Findings the repository's memory accepts, and those a reviewer dismissed on the pull request, are removed before any model is paid to check them. On a pull request, earlier findings are compared too: one counts as fixed only when the code it pointed at is gone.",
      },
      {
        name: "Verify",
        kind: "model",
        summary: "Check each finding against the diff",
        detail:
          "A model rereads each file's findings next to its diff and the lines around them. A finding is dropped only when that code proves it wrong, with the reason kept in the report; the rest are marked confirmed or unconfirmed.",
      },
      {
        name: "Judge",
        kind: "model",
        summary: "Merge duplicates, settle severity",
        detail:
          "A stronger model reads every reviewer's findings together, merges the same root cause, drops nitpicks and fixes severities. The verdict itself comes from a fixed rubric, so the same findings always get the same verdict, and only a critical finding the verifier confirmed can block.",
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
  },
};
