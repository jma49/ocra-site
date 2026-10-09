import type { Copy } from "@/lib/copy";
import { brandIcons } from "@/lib/landing/brand-icons";

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

// Each mark is drawn from the sprite (app/icons.svg/route.ts): the marquee
// repeats every row for its loop, and the paths would be most of the page.
function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}

function Track({ names, hidden }: { names: string[]; hidden?: boolean }) {
  return (
    <ul className="mq-track" aria-hidden={hidden || undefined}>
      {names.map((n) => (
        <li key={n} className="pchip">
          <Icon name={n} />
          <span>{brandIcons[n]?.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function Works({ copy }: { copy: Copy["works"] }) {
  return (
    <section className="works">
      <div className="wrap works-grid">
        <div className="works-copy">
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
        <div>
          <div className="tiles-label">{copy.platforms}</div>
          <div className="tiles">
            {PLATFORMS.map((n) => (
              <div key={n} className="logo-tile">
                <Icon name={n} />
                <span>{n === "git" ? copy.local : brandIcons[n]?.label}</span>
              </div>
            ))}
          </div>
          <div className="tiles-label">{copy.providers}</div>
          <section className="mq-wrap" aria-label={copy.providers}>
            {[ROW_A, ROW_B].map((row, i) => (
              <div key={row[0]} className={i ? "mq rev" : "mq"}>
                <Track names={row} />
                <Track names={row} hidden />
              </div>
            ))}
          </section>
          <p className="mq-note">
            {copy.more.replace("{count}", String(PROVIDERS_TOTAL - ROW_A.length - ROW_B.length))}
          </p>
        </div>
      </div>
    </section>
  );
}
