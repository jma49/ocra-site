import type { ReactNode } from "react";
import type { Copy, StepId } from "@/lib/copy";
import { exampleRun } from "@/lib/landing/example-run";
import { SessionCode } from "./session-code";

type F = Copy["how"]["figures"];

function Panel({
  head,
  meta,
  children,
}: {
  head: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panel-h">
        <span>{head}</span>
        <span>{meta}</span>
      </div>
      <div className="panel-b">{children}</div>
    </div>
  );
}

const { files, finding, outcome } = exampleRun;
const quoted = finding.code[finding.line - finding.firstLine]?.trim();

// One picture per pipeline step; the same example change throughout.
export function howFigures(f: F): Record<StepId, ReactNode> {
  return {
    select: (
      <Panel head="select · triage" meta={`${files.length} files`}>
        {files.map((file) => (
          <div key={file.id} className={file.selected ? "frow" : "frow out"}>
            <span>{file.path}</span>
            <em>{file.selected ? f.read : f.setAside}</em>
          </div>
        ))}
        <div className="tier">
          <span>{f.tier}</span>
          <strong>{f.tierValue}</strong>
        </div>
      </Panel>
    ),
    bundle: (
      <Panel head="bundle · matrix" meta={`${exampleRun.tasks} tasks`}>
        <div className="mtx">
          <span className="h" />
          <span className="h">correctness</span>
          <span className="h">security</span>
          <span className="h">performance</span>
          <span className="h">auth code</span>
          <span className="y">{f.task}</span>
          <span className="y">{f.task}</span>
          <span className="y">{f.task}</span>
          <span className="h">docs</span>
          <span className="y">{f.task}</span>
          <span className="x">{f.skipDocs}</span>
          <span className="x">{f.skipDocs}</span>
        </div>
        <div className="plan-line">{f.planLine}</div>
      </Panel>
    ),
    review: (
      <Panel head="review · anchor" meta={f.readOnly}>
        <div className="quote">
          <small>{f.quotes}</small>
          {quoted}
        </div>
        <div className="down">&darr; {f.found}</div>
        <SessionCode />
      </Panel>
    ),
    verify: (
      <Panel
        head="filter · verify · judge · verdict"
        meta={`${outcome.verified + outcome.merged + outcome.disproved} in`}
      >
        <div className="ledger">
          <div>
            <span>{f.claims.sessions}</span>
            <span className="tag t-ok">{f.ledger.confirmed}</span>
          </div>
          <div className="gone">
            <span>{f.claims.refresh}</span>
            <span className="tag t-plain">{f.ledger.merged}</span>
          </div>
          <div className="gone">
            <span>{f.claims.token}</span>
            <span className="tag t-plain">{f.ledger.disproved}</span>
          </div>
          <div className="vrow">
            <span>{f.ledger.verdict}</span>
            <span>{f.ledger.critical}</span>
          </div>
        </div>
      </Panel>
    ),
  };
}
