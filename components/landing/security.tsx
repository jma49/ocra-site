import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";
import { accessDenied } from "@/lib/landing/engine-facts";
import { localePath } from "@/lib/shared";
import { Arrow, Lines } from "./parts";

// Reads an agent might try, one per kind of refused path: a secret by name
// (**/.env), a secret by extension (**/*.pem) and git's internals (.git).
const ATTEMPTS = [".env", "deploy/key.pem", ".git/config"];

// The page's one dark block: the threat the product is built for, the gate
// every agent's read passes, and four properties.
export function Security({ copy, locale }: { copy: Copy["security"]; locale: Locale }) {
  return (
    <section id="security" className="sec" aria-labelledby="security-h">
      <div className="wrap">
        <div className="block">
          <div className="block-top">
            <div>
              <h2 className="h2" id="security-h">
                <Lines lines={copy.lines} />
              </h2>
              <p className="lead">{copy.body}</p>
              <a className="block-link" href={localePath(locale, "/docs/threat-model")}>
                {copy.link}
                <Arrow />
              </a>
            </div>
            <figure className="gate mono">
              <figcaption>{copy.gate}</figcaption>
              {ATTEMPTS.map((path) => (
                <p key={path}>
                  <span>
                    <i>agent</i> read_file("{path}")
                  </span>
                  <span>
                    <i>gate</i> <em>{accessDenied(path)}</em>
                  </span>
                </p>
              ))}
            </figure>
          </div>
          <ul className="block-four">
            {copy.props.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
