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
