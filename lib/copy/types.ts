export type StageKind = "code" | "model" | "planned";

export interface Copy {
  hero: {
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
    // The animated walk-through: one caption per stage, then the report.
    flow: {
      captions: string[];
      report: string;
      play: string;
      pause: string;
      label: string;
    };
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
      dismissed: { tab: string; text: string; reply: string; resolved: string };
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
