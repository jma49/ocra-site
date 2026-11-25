import type { Copy } from "@/lib/copy";
import { Lines, Themed } from "./parts";

// Every review in one history: an accordion of what the console does with
// it (one open at a time, native <details name>, no script) beside the
// Reviews page.
export function Record({ copy }: { copy: Copy["record"] }) {
  return (
    <section className="sec" aria-labelledby="record-h">
      <div className="wrap">
        <div className="split-head">
          <h2 className="h2" id="record-h">
            <Lines lines={copy.lines} />
          </h2>
          <p className="lead">{copy.body}</p>
        </div>
        <div className="where">
          <div className="acc">
            {copy.items.map((item, i) => (
              <details key={item.title} name="record" open={i === 0} className="acc-item">
                <summary>
                  <span>{item.title}</span>
                  <span className="acc-sign" aria-hidden="true" />
                </summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
          <figure className="where-art">
            <div className="where-stage">
              <div className="where-view where-v1">
                <div className="shot shot-side">
                  <Themed name="reviews" ext="webp" width={980} height={700} alt={copy.alt} />
                </div>
                <div className="where-float" aria-hidden="true">
                  <span className="where-badge">
                    <span className="dot dot-ok" />
                    {copy.views.learning.tag}
                  </span>
                  <code className="mono where-path">{copy.views.learning.path}</code>
                  <p className="where-desc">{copy.views.learning.summary}</p>
                  <span className="where-meta">{copy.views.learning.action}</span>
                </div>
              </div>

              <div className="where-view where-v2" aria-hidden="true">
                <div className="where-card">
                  <div className="wc-bar mono">{copy.views.ask.header}</div>
                  <div className="wc-body">
                    <div className="wc-msg wc-user">{copy.views.ask.question}</div>
                    <div className="wc-msg wc-ocra">
                      <span className="dot dot-ok" />
                      <div>
                        <p>{copy.views.ask.answer}</p>
                        <span className="wc-foot mono">{copy.views.ask.meta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="where-view where-v3" aria-hidden="true">
                <div className="where-card">
                  <div className="wc-bar mono">{copy.views.thread.header}</div>
                  <div className="wc-body">
                    <div className="wc-thread">
                      <div className="wc-head">
                        <b>{copy.views.thread.author}</b>
                      </div>
                      <p>{copy.views.thread.mention}</p>
                    </div>
                    <div className="wc-thread wc-reply">
                      <div className="wc-head">
                        <b>{copy.views.thread.bot}</b>
                        <span className="tag">bot</span>
                      </div>
                      <p>{copy.views.thread.reply}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="where-view where-v4" aria-hidden="true">
                <div className="where-card">
                  <div className="wc-bar mono">{copy.views.alerts.channel}</div>
                  <div className="wc-body">
                    <div className="wc-alert">
                      <span className="tag tag-crit">Critical</span>
                      <b>{copy.views.alerts.alertTitle}</b>
                      <span className="mono wc-foot">{copy.views.alerts.alertMeta}</span>
                    </div>
                    <div className="wc-digest">
                      <b>{copy.views.alerts.digestTitle}</b>
                      <span className="mono wc-foot">{copy.views.alerts.digestStats}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="sr-only">{copy.note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
