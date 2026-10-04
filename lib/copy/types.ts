import type { ExampleRun, FileId } from "@/lib/landing/example-run";

export type StageKind = "code" | "model";

// Copy that quotes the recorded example run takes the run, so a new
// recording changes lib/landing/example-run.ts only. getCopy resolves these
// on the server: functions cannot be passed to client components.
export type FromRun = (run: ExampleRun) => string;

type Resolved<T> = T extends FromRun
  ? string
  : T extends object
    ? { [K in keyof T]: Resolved<T[K]> }
    : T;

// The copy as components receive it, with the run filled in.
export type Copy = Resolved<CopySource>;

export type StepId = "select" | "bundle" | "review" | "verify";
export type BillRow = "input" | "cached" | "output" | "total";
export type PlanId = "self" | "cloud" | "team";

// Every landing page string, in one shape per language. Code, file names,
// reviewer names and tool names are identifiers and stay untranslated.
export interface CopySource {
  announce: { label: string; text: string; link: string };
  nav: {
    links: {
      how: string;
      product: string;
      security: string;
      pricing: string;
      docs: string;
    };
    github: string;
    signIn: string;
    start: string;
    menu: string;
    theme: string;
  };
  hero: {
    // `emphasis` is the tail of the headline, set in the brand colour.
    title: string;
    emphasis: string;
    lede: string;
    cloud: string;
    selfHost: string;
    note: string;
    poke: { up: string; down: string };
  };
  window: {
    tabs: { pr: string; terminal: string; cloud: string };
    urls: { pr: FromRun; terminal: FromRun; cloud: string };
    example: string;
    pr: {
      title: string;
      meta: { into: string; from: string; files: FromRun };
      reviewing: string;
      reviewed: string;
      replay: string;
      verdict: string;
      rows: {
        reviewed: string;
        tasks: string;
        findings: string;
        cost: string;
      };
      values: {
        reviewed: FromRun;
        tasks: FromRun;
        findings: FromRun;
        tokens: FromRun;
      };
      onLine: string;
      quoteTip: string;
      findingTitle: string;
      findingBody: string;
      side: {
        reviewers: string;
        checks: string;
        files: string;
        reviewing: string;
        changes: string;
        running: string;
        blocking: FromRun;
        // Why ocra read or set aside each file listed beside the pull
        // request; a file without a reason is not listed.
        why: Partial<Record<FileId, string>>;
      };
    };
    console: {
      nav: string[];
      stats: { reviews: string; requests: string; spend: string };
    };
  };
  works: {
    title: string;
    body: string;
    platforms: string;
    providers: string;
    // `{count}` is the number of providers not shown in the rows.
    more: string;
    local: string;
  };
  how: {
    title: string;
    emphasis: string;
    body: string;
    legend: Record<StageKind, string>;
    steps: Record<
      StepId,
      {
        title: string;
        stages: { name: string; kind: StageKind }[];
        text: string;
      }
    >;
    figures: {
      read: string;
      setAside: string;
      tier: string;
      tierValue: string;
      task: string;
      skipDocs: string;
      planLine: string;
      readOnly: string;
      quotes: string;
      found: string;
      ledger: {
        confirmed: string;
        merged: string;
        disproved: string;
        verdict: string;
        critical: FromRun;
      };
      claims: { sessions: string; refresh: string; token: string };
    };
  };
  statement: { title: string; emphasis: string; body: string };
  features: {
    title: string;
    emphasis: string;
    rules: { title: string; body: string };
    write: { title: string; body: string };
    bill: {
      title: string;
      body: string;
      rows: Record<BillRow, string>;
    };
    fallback: {
      title: string;
      body: string;
      chain: [string, string, string];
    };
  };
  lifecycle: {
    title: string;
    emphasis: string;
    body: string;
    tabs: { reported: string; fixed: string; dismissed: string };
    notes: { reported: string; fixed: string; dismissed: string };
    caption: string;
    reply: FromRun;
    maintainer: string;
    resolvedBot: string;
    resolvedMaintainer: string;
    keys: { title: string; body: string }[];
  };
  security: {
    title: string;
    emphasis: string;
    body: string;
    flow: {
      repo: string;
      repoNote: string;
      gate: string;
      agents: string;
      provider: string;
      providerNote: string;
      outside: string;
    };
    props: { title: string; body: string }[];
    link: string;
  };
  plans: {
    title: string;
    emphasis: string;
    body: string;
    items: Record<
      PlanId,
      {
        state: string;
        name: string;
        price: string;
        unit: string;
        points: string[];
        cta: string;
        planned?: boolean;
      }
    >;
    fine: string;
  };
  faq: { title: string; emphasis: string; items: { q: string; a: string }[] };
  final: { title: string; emphasis: string; cloud: string; manual: string };
  footer: {
    tagline: string;
    columns: { title: string; links: { label: string; href: string }[] }[];
  };
  dock: { start: string; copy: string; copied: string };
}
