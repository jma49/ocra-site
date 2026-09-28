import type { Copy } from "./types";

export const en: Copy = {
  hero: {
    title: "A code reviewer that reads before it comments.",
    subtitle:
      "ocra splits a change into focused review tasks. Each agent can only read your repository, has to quote the code it means, and is asked to say what it checked. Most runs end with a finding or two, many with none, and that is fine.",
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
    demo: {
      label: "Video of an example ocra review run",
      caption:
        "An example run, sped up. The pipeline, the output and the verdict are ocra's own; the model's answers were scripted for the recording.",
      play: "Play the example run",
      pause: "Pause the example run",
    },
    groups: [
      {
        title: "Only the files worth reading",
        stages: [
          { name: "select", kind: "code" },
          { name: "triage", kind: "code" },
        ],
        text: "Binaries, lock files, vendored and generated code, media, likely secrets and oversized diffs are set aside, each with a recorded reason. Sensitive paths such as auth/ or CI workflows, or more than 20 files, make the change full tier; otherwise its size decides between trivial, lite and full.",
      },
      {
        title: "One task per group and reviewer",
        stages: [
          { name: "bundle", kind: "model" },
          { name: "matrix", kind: "code" },
        ],
        text: "From four files up, a light model groups files that belong together; smaller changes are split in code. Correctness always runs; security and performance join from the lite tier and skip docs and tests. Skipped pairs are recorded with their reason, and --plan lists every task before a model is paid.",
      },
      {
        title: "Findings quote the code they mean",
        stages: [
          { name: "review", kind: "model" },
          { name: "anchor", kind: "code" },
        ],
        text: "An isolated agent per group and reviewer reads the exact revision under review with read-only tools, stops after 20 steps, and reports each issue by quoting code. ocra looks the quote up in the diff, then in the whole file, and pins it to those lines; a quote it cannot find stays on the file. The model never picks the line.",
      },
      {
        title: "Only what holds up on a second read",
        stages: [
          { name: "filter", kind: "code" },
          { name: "verify", kind: "model" },
          { name: "judge", kind: "model" },
          { name: "verdict", kind: "code" },
        ],
        text: "Findings the team accepted in ocra's memory are dropped before a model is paid to check them. A verifier rereads each one next to the code and drops what the code disproves; a judge merges the same root cause and drops nitpicks, but can never drop or downgrade a confirmed critical. The verdict is computed in code: only a critical the verifier confirmed blocks.",
      },
    ],
    figures: {
      read: "read",
      lockSetAside: "set aside: generated",
      tier: "tier",
      touches: "touches auth/",
      authCode: "auth code",
      docs: "docs",
      threeFiles: "3 files",
      oneFile: "1 file",
      skip: "skip",
      tasks: "4 review tasks",
      skipped: "2 skipped: no matching files",
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
        body: "Style, speculation and unchanged code are out of scope for every reviewer, and each has its own list on top, such as missing tests for correctness. Reporting nothing is a valid outcome.",
      },
      {
        title: "No agent can write.",
        body: "Agents can read files, read diffs and search the repository. Editing, shell and web tools are switched off, along with every other OpenCode built-in.",
      },
      {
        title: "Your own setup stays out of the review.",
        body: "Your global OpenCode config, installed skills and instruction files are switched off before the first request, and the runtime gets only the environment variables it needs.",
      },
      {
        title: "Every attempt shows its bill.",
        body: "Steps, tool calls, tokens and cost for every review attempt as it finishes; the run's total adds cached tokens and every helper call.",
      },
      {
        title: "When a model falls over, the next one takes the task.",
        body: "Give each tier a list of models. Overloads move on to the next model, a model that keeps failing is paused for a while, short rate limits are waited out, and a model out of quota is dropped for the rest of the run.",
      },
    ],
    visuals: {
      outOfScope: ["style", "speculation", "unchanged code", "missing tests"],
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
        text: "The code the finding pointed at is no longer in the file, so ocra resolves the thread itself. That is the only evidence it takes for a fix.",
        resolved: "github-actions resolved this conversation",
      },
      dismissed: {
        tab: "Dismissed",
        text: "A maintainer declined it. ocra stops reporting it and it no longer counts towards the verdict, unless it comes back more severe. The pull request's own author cannot do this.",
        reply: "Won't fix in this PR: tracked in #812.",
        resolved: "maintainer resolved this conversation",
        who: "maintainer",
      },
    },
  },
  plugins: {
    title: "Your team's rules, as a plugin",
    body: "The Git and GitHub adapters, the OpenCode runtime and the three reviewers that ship today are plugins too. Yours get the same small contract: register rules, reviewers, tools or listeners, and receive your own settings. Plugins run code, so they load only in local reviews; for pull requests, the same rules go in .ocra/rules.json on the base branch.",
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
        state: "built",
        done: true,
      },
      {
        milestone: "M2",
        title: "More reviewers",
        body: "Security and performance reviewers, risk tiers, a review matrix, verification, a judge and a fixed verdict rubric.",
        state: "built",
        done: true,
      },
      {
        milestone: "M3",
        title: "GitHub",
        body: "ocra review --pr and a GitHub Action: inline comments, one summary comment, and re-reviews of only what changed that resolve fixed threads and respect dismissals. Tested against a simulated GitHub API; the first live pull request comes with M7.",
        state: "built",
        done: true,
      },
      {
        milestone: "M4",
        title: "Hardening",
        body: "Circuit breakers per model, shared configuration over https, a review memory, and --ultra for recall.",
        state: "built",
        done: true,
      },
      {
        milestone: "M5",
        title: "Measure",
        body: "A golden set of expected findings plus AACR-Bench, until the numbers are stable enough to publish. First baselines are in; nothing is published yet. Deeper reviews are built and merge only once a measurement shows they help.",
        state: "now",
        done: false,
      },
      {
        milestone: "M6",
        title: "Recall",
        body: "Reviewers report every defect they can back with evidence, and verification and the judge own precision, one measured prompt change at a time.",
        state: "next",
        done: false,
      },
      {
        milestone: "M7",
        title: "Ship v0.1",
        body: "npm packages and a one-line install, the Action on real pull requests for a month, and the evaluation published here. Today ocra installs from source.",
        state: "planned",
        done: false,
      },
    ],
  },
  start: {
    title: "Try it on a repository you know",
    body: "It runs against any Git repository on your machine, or on pull requests through the GitHub Action. Your model provider sees the change with its title and description, your AGENTS.md and review rules, and what the agents open or search in the repository; never files that look like secrets, or anything outside the repository.",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Select and copy",
    docs: "Read the quickstart",
    tabs: { cli: "Local CLI", action: "GitHub Action" },
    actionNote:
      "Save it as .github/workflows/ocra.yml and store your model key as a repository secret. Models come from the env block, or from .ocra/config.json on the base branch. Every pull request then gets inline comments and one summary.",
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
