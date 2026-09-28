export type StageKind = "code" | "model";

export interface Copy {
  hero: {
    title: string;
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
    // The recorded example run under the stage row (public/demo).
    demo: { label: string; caption: string; play: string; pause: string };
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
      reported: { tab: string; text: string };
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
    copyFailed: string;
    docs: string;
    tabs: { cli: string; action: string };
    actionNote: string;
    actionDocs: string;
  };
  footer: {
    tagline: string;
    github: string;
    license: string;
    manual: string;
    wordmark: string;
  };
}
