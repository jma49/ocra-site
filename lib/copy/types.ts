export type StageKind = "code" | "model";

export interface Copy {
  nav: {
    home: string;
    how: string;
    manual: string;
    plugins: string;
    roadmap: string;
    github: string;
    start: string;
    // The link to the other language, in that language.
    language: string;
  };
  hero: {
    // Two tones: the lead is muted, the rest is bright.
    titleLead: string;
    titleRest: string;
    subtitle: string;
    start: string;
    github: string;
    note: string;
  };
  run: {
    // `{command}` marks where `ocra review` goes, set in mono.
    title: string;
    body: string;
    legend: Record<StageKind, string>;
    region: string;
    previous: string;
    next: string;
    example: string;
    groups: {
      title: string;
      stages: { name: string; kind: StageKind }[];
      text: string;
    }[];
    // Words inside the illustrations; file names, tiers, reviewers and tool
    // names are identifiers and stay untranslated.
    figures: {
      read: string;
      lockSetAside: string;
      tier: string;
      touches: string;
      authCode: string;
      docs: string;
      threeFiles: string;
      oneFile: string;
      skip: string;
      tasks: string;
      skipped: string;
      agent: string;
      on: string;
      off: string;
      quote: string;
      matched: string;
      confirmed: string;
      merged: string;
      disproved: string;
      accepted: string;
      verdict: string;
      verifiedCritical: string;
    };
  };
  decisions: {
    title: string;
    body: string;
    items: { title: string; body: string }[];
    // Words inside the small illustrations; code tokens stay untranslated.
    visuals: { outOfScope: string[]; machine: string[]; located: string };
  };
  anatomy: {
    title: string;
    body: string;
    example: string;
    callouts: {
      quote: string;
      lines: string;
      verified: string;
      suggestion: string;
    };
    states: {
      reported: { tab: string; text: string; open: string };
      fixed: { tab: string; text: string; resolved: string };
      dismissed: {
        tab: string;
        text: string;
        reply: string;
        resolved: string;
        who: string;
      };
    };
  };
  plugins: { title: string; body: string; points: string[]; cta: string };
  status: {
    title: string;
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
    titleRest: string;
    body: string;
    copy: string;
    copied: string;
    copyFailed: string;
    docs: string;
    tabs: { cli: string; action: string };
    actionNote: string;
    actionDocs: string;
  };
  footer: {
    tagline: string;
    project: string;
    source: string;
    language: string;
    license: string;
    backToTop: string;
    wordmark: string;
  };
}
