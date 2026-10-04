import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/shared";
import { SplitHead } from "./heading";

const REFUSED = [".env", "*.pem", "id_rsa", ".git/"];
const TOOLS: [string, boolean][] = [
  ["read", true],
  ["diff", true],
  ["search", true],
  ["edit", false],
  ["shell", false],
  ["web", false],
];

export function Security({
  copy,
  locale,
}: {
  copy: Copy["security"];
  locale: Locale;
}) {
  const f = copy.flow;
  return (
    <section className="chapter tight-top" id="security">
      <div className="wrap">
        <SplitHead
          title={copy.title}
          emphasis={copy.emphasis}
          body={copy.body}
        />
        <div className="secure">
          <div className="sec-grid">
            <div className="flow">
              <div className="fbox">
                {f.repo}
                <small>{f.repoNote}</small>
              </div>
              <div className="arrow" aria-hidden="true">
                &darr;
              </div>
              <div className="fbox gate">
                <b>ReviewContext</b> · {f.gate}
                <div className="no">
                  {[...REFUSED, f.outside].map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              </div>
              <div className="arrow" aria-hidden="true">
                &darr;
              </div>
              <div className="fbox">
                {f.agents}
                <div className="tools">
                  {TOOLS.map(([t, on]) => (
                    <span key={t} className={on ? undefined : "off"}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="arrow" aria-hidden="true">
                &darr;
              </div>
              <div className="fbox">
                {f.provider}
                <small>{f.providerNote}</small>
              </div>
            </div>
            <div>
              <ul className="props">
                {copy.props.map((p) => (
                  <li key={p.title}>
                    <strong>{p.title}</strong>
                    <span>{p.body}</span>
                  </li>
                ))}
              </ul>
              <a
                className="tlink"
                href={localePath(locale, "/docs/threat-model")}
              >
                {copy.link} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
