import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { brandIcons } from "@/lib/landing/brand-icons";
import { Section } from "./section";

const PLATFORMS = ["github", "gitlab", "git"];
const ROW_A = [
  "openai",
  "anthropic",
  "gemini",
  "openrouter",
  "deepseek",
  "qwen",
  "moonshot",
  "zhipu",
  "minimax",
  "mistral",
  "xai",
  "groq",
  "cohere",
];
const ROW_B = [
  "perplexity",
  "together",
  "fireworks",
  "cerebras",
  "huggingface",
  "baidu",
  "hunyuan",
  "stepfun",
  "siliconcloud",
  "volcengine",
  "deepinfra",
  "novita",
  "vercel",
];
// ocra Cloud's gateway lists 45 providers.
const PROVIDERS_TOTAL = 45;

// Each mark is drawn from the sprite (app/icons.svg/route.ts).
function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}

// Where it runs, on whose model (sections.md §3). Stub from package F: the
// provider rows are static; P builds the marquee and its pause button.
export function Works({ copy }: { copy: Copy["works"] }) {
  return (
    <Section ground="paper" className="works">
      <div className="wrap works-grid">
        <div className="works-copy">
          <h2 className="t-h2s">{copy.title}</h2>
          <p className="t-body">{copy.body}</p>
          <ul className="works-tiles" aria-label={copy.platforms}>
            {PLATFORMS.map((n) => (
              <li key={n} className="sheet works-tile t-h4">
                <Icon name={n} />
                <span>{n === "git" ? copy.local : brandIcons[n]?.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="works-index">
          <p className="works-gauge">
            <span className="t-gauge">{PROVIDERS_TOTAL}</span>
            <span className="t-h4">{copy.gauge}</span>
          </p>
          {[ROW_A, ROW_B].map((row) => (
            <ul key={row[0]} className="works-row">
              {row.map((n) => (
                <li key={n} className="sheet works-chip">
                  <Icon name={n} />
                  <span>{brandIcons[n]?.label}</span>
                </li>
              ))}
            </ul>
          ))}
          <p className="t-small works-more">
            {fill(copy.more, { count: PROVIDERS_TOTAL - ROW_A.length - ROW_B.length })}
          </p>
        </div>
      </div>
    </Section>
  );
}
