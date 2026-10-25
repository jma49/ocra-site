import type { CSSProperties, ReactNode } from "react";
import { InkUnderline } from "@/components/landing/desk/hover-ink";
import { InkLayer } from "@/components/landing/desk/ink";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { exampleRun, terminalLines } from "@/lib/landing/example-run";
import { ringAround } from "@/lib/landing/ink/marks";
import { localePath } from "@/lib/shared";

// The spread: one finding, three destinations, printed side by side on the
// works paper. Each column has the same rows (a subgrid from 1200 px), so
// the line it quotes sits on one axis across the page, where the pen rings
// it three times. Platform text as ocra writes it (vcs-platform's
// render.ts: the summary heading, the inline comment's first line); the
// terminal's lines verbatim from the recording, broken at COLS.

const { finding } = exampleRun;
const COLS = 40;

// A printed line broken at spaces, `cols` wide.
function wrap(text: string, cols = COLS): string[] {
  const out: string[] = [];
  let rest = text;
  while (rest.length > cols) {
    const k = rest.lastIndexOf(" ", cols);
    const at = k > cols * 0.4 ? k : cols;
    out.push(rest.slice(0, at).trimEnd());
    rest = rest.slice(at).replace(/^ (?! )/, "");
  }
  return [...out, rest];
}

const recorded = (start: string) => {
  const line = terminalLines
    .flatMap(([text]) => text.split("\n"))
    .find((l) => l.trimStart().startsWith(start));
  if (!line) throw new Error(`works: the recording prints no line starting ${start}`);
  return line;
};
const TERM = {
  pre: [terminalLines[0]?.[0] ?? "", "⋮", recorded("Verdict:")],
  post: [...wrap(recorded("critical")), "⋮", ...wrap(recorded("1 finding(s)"))],
};

// A ring around the number on the axis, in em of the number's type: the
// layer is `w` em wide and 1.2 em tall, centred on the number.
function Ring({ i, w }: { i: number; w: number }) {
  const W = Math.round(w * 100 + 48);
  const H = 120;
  const rx = W * 0.45;
  const ry = H * 0.4;
  const mark = ringAround(W / 2 - (rx - 7), H / 2 - (ry - 5), 2 * (rx - 7), 2 * (ry - 5), {
    width: 6.2,
    seed: 3 + i * 7,
  });
  return (
    <InkLayer
      id={`works-r${i}`}
      className="works-ring"
      width={W}
      height={H}
      marks={[{ name: "ring", mark }]}
      style={{ "--rw": `${W / 100}em` } as CSSProperties}
    />
  );
}

function Octagon() {
  return (
    <svg className="works-oct" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.2 1.5h5.6l3.7 3.7v5.6l-3.7 3.7H5.2l-3.7-3.7V5.2z" />
      <path className="works-oct-bar" d="M5 8h6" />
    </svg>
  );
}

type ColumnProps = {
  name: string;
  href: string;
  flag: string;
  leaves: readonly string[];
  pre: ReactNode;
  axis: ReactNode;
  post: ReactNode;
  source: string;
  term?: boolean;
  c: number;
};

function Column({ name, href, flag, leaves, pre, axis, post, source, term, c }: ColumnProps) {
  return (
    <article
      className={term ? "works-col works-term" : "works-col"}
      style={{ "--c": c } as CSSProperties}
    >
      <header className="works-name">
        <h3>
          <a className="ink-link works-link" href={href}>
            {name}
            <InkUnderline />
          </a>
        </h3>
        <code className="works-flag">{flag}</code>
      </header>
      <p className="works-leaves">{leaves.join(" + ")}</p>
      <div className="works-pr works-pre">{pre}</div>
      <div className="works-pr works-axis">{axis}</div>
      <div className="works-pr works-post">{post}</div>
      <p className="works-pr works-src">{source}</p>
    </article>
  );
}

const Tl = ({ lines, dim }: { lines: readonly string[]; dim?: (l: string) => boolean }) =>
  lines.map((l, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: printed lines are fixed
    <span key={i} className={dim?.(l) ? "works-tl works-tl-d" : "works-tl"}>
      {l}
    </span>
  ));

export function WorksSpread({ copy, locale }: { copy: Copy["works"]; locale: Locale }) {
  const heading = (
    <p className="works-sum">
      ocra review · <Octagon /> {exampleRun.summaryHeading}
    </p>
  );
  const at = (i: number) => (
    <p className="works-loc">
      {copy.at[0]}
      <span className="works-n">
        {finding.line}
        <Ring i={i} w={0.96} />
      </span>
      {copy.at[1]}
    </p>
  );
  const path = <code>{finding.path}</code>;
  const title = (
    <>
      <p className="works-title">
        <span className="works-dot" aria-hidden="true" />
        {finding.title}
      </p>
      <p className="works-meta">
        {finding.severity} · verified · {finding.reviewer}
      </p>
    </>
  );
  return (
    <div className="works-spread">
      <Column
        c={0}
        name="GitHub"
        href={localePath(locale, "/docs/github")}
        flag="--pr"
        leaves={copy.leaves.github}
        pre={
          <>
            {heading}
            <p className="works-meta">{copy.posted.github}</p>
          </>
        }
        axis={
          <>
            <p className="works-path">{path}</p>
            {at(0)}
          </>
        }
        post={
          <>
            {title}
            <p className="works-body">{finding.body}</p>
            <p className="works-sugg">
              <b>Suggestion:</b> <code>{finding.suggestion}</code>
            </p>
          </>
        }
        source={copy.example}
      />
      <Column
        c={1}
        name="GitLab"
        href={localePath(locale, "/docs/gitlab")}
        flag="--mr"
        leaves={copy.leaves.gitlab}
        pre={
          <>
            {heading}
            <p className="works-meta">{copy.posted.gitlab}</p>
          </>
        }
        axis={
          <>
            <p className="works-path">
              {copy.threadOn} {path}
            </p>
            {at(1)}
          </>
        }
        post={
          <>
            {title}
            <p className="works-acts">
              <span>{copy.resolve}</span>
              <span>{copy.reply}</span>
            </p>
          </>
        }
        source={copy.illustration}
      />
      <Column
        c={2}
        term
        name={copy.local}
        href={localePath(locale, "/docs/cli")}
        flag="--from main"
        leaves={copy.leaves.git}
        pre={<Tl lines={TERM.pre} dim={(l) => l === "⋮"} />}
        axis={
          <>
            <p className="works-path">{path}</p>
            <p className="works-loc works-loc-mono">
              <span className="works-n">
                L{finding.line}
                <Ring i={2} w={1.7} />
              </span>
            </p>
          </>
        }
        post={<Tl lines={TERM.post} dim={(l) => !/critical|treated/.test(l)} />}
        source={copy.recorded}
      />
    </div>
  );
}
