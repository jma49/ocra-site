import type { ReactNode } from "react";
import type { Copy } from "@/lib/copy";
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

// One picture per pipeline step; the same example change throughout.
export function howFigures(f: F) {
  return [
    <Panel key="select" head="select · triage" meta="5 files">
      {[
        "src/auth/session.ts",
        "src/auth/login.ts",
        "src/api/routes.ts",
        "docs/sessions.md",
      ].map((p) => (
        <div key={p} className="frow">
          <span>{p}</span>
          <em>{f.read}</em>
        </div>
      ))}
      <div className="frow out">
        <span>package-lock.json</span>
        <em>{f.setAside}</em>
      </div>
      <div className="tier">
        <span>{f.tier}</span>
        <strong>{f.tierValue}</strong>
      </div>
    </Panel>,
    <Panel key="bundle" head="bundle · matrix" meta="4 tasks">
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
    </Panel>,
    <Panel key="review" head="review · anchor" meta={f.readOnly}>
      <div className="quote">
        <small>{f.quotes}</small>
        return session.expiresAt &lt; Date.now();
      </div>
      <div className="down">&darr; {f.found}</div>
      <SessionCode />
    </Panel>,
    <Panel key="verify" head="filter · verify · judge · verdict" meta="3 in">
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
    </Panel>,
  ];
}
