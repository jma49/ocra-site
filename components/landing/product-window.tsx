import type { Copy } from "@/lib/copy";
import { type CallRole, exampleRun, formatCount, terminalLines } from "@/lib/landing/example-run";
import { PrPane } from "./pr-pane";
import { tabPanel } from "./tabs";
import { WindowTabs } from "./window-tabs";

// The console's Activity page after the run above: every model request it
// made, in pipeline order, each bar sized by its input tokens.
const { calls, usage } = exampleRun;
const STAGE_ORDER: CallRole[] = ["grouping", "review", "verification", "judge"];
const requests = STAGE_ORDER.flatMap((role) => calls.filter((call) => call.role === role));
const maxInput = Math.max(...calls.map((call) => call.input));
// The nav item the page shows: Activity.
const ACTIVE_NAV = 1;
// The ids of the window's tabs and panels.
const TABS_ID = "window";

// The hero's window: the pull request, the terminal and the console of the
// recorded run. The panes render here, on the server; the tabs are a client
// island (window-tabs.tsx), and so is the pull request's replay.
export function ProductWindow({ copy }: { copy: Copy["window"] }) {
  return (
    <WindowTabs
      prefix={TABS_ID}
      labels={copy.tabs}
      urls={copy.urls}
      panes={{
        pr: <PrPane copy={copy.pr} panel={tabPanel(TABS_ID, "pr")} />,
        terminal: <Terminal />,
        cloud: <Console copy={copy.console} />,
      }}
    >
      <p className="example-note">{copy.example}</p>
    </WindowTabs>
  );
}

function Terminal() {
  return (
    <pre className="term" {...tabPanel(TABS_ID, "terminal")}>
      {terminalLines.map(([text, tone]) => (
        <span key={text} className={tone || undefined}>{`${text}\n`}</span>
      ))}
      <span className="caret" />
    </pre>
  );
}

function Console({ copy }: { copy: Copy["window"]["console"] }) {
  return (
    <div className="console" {...tabPanel(TABS_ID, "cloud")}>
      <aside>
        {copy.nav.map((item, i) => (
          <span key={item} className={i === ACTIVE_NAV ? "on" : undefined}>
            {item}
          </span>
        ))}
      </aside>
      <div className="m">
        <div className="stats">
          <div className="stat">
            <small>{copy.stats.requests}</small>
            <b>{calls.length}</b>
          </div>
          <div className="stat">
            <small>{copy.stats.input}</small>
            <b>{formatCount(usage.input)}</b>
          </div>
          <div className="stat">
            <small>{copy.stats.spend}</small>
            <b>${usage.dollars.toFixed(4)}</b>
          </div>
        </div>
        <div className="reqs">
          {requests.map((call, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed list of recorded calls
            <div key={i} data-role={call.role}>
              <span>
                {copy.roles[call.role]}
                {call.model && ` · ${call.model}`}
              </span>
              <span className="bar" aria-hidden="true">
                <i style={{ width: `${(call.input / maxInput) * 100}%` }} />
              </span>
              <span>{formatCount(call.input)} in</span>
              <span>200</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
