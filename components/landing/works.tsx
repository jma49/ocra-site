import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { brandIcons } from "@/lib/landing/brand-icons";
import { MarqueePause } from "./marquee-pause";
import { Section } from "./section";

// Where ocra reviews, and the `ocra review` flag that points it there
// (the CLI's --pr, --mr and --from: docs/manual/en/cli.mdx).
const PLATFORMS = [
  { icon: "github", flag: "--pr" },
  { icon: "gitlab", flag: "--mr" },
  { icon: "git", flag: "--from" },
] as const;
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
// ocra Cloud's gateway forwards to 45 providers: PROVIDER_IDS in ocra's
// packages/cloud-contract/src/providers.ts.
const PROVIDERS_TOTAL = 45;

// Each mark is drawn from the sprite (app/icons.svg/route.ts).
function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}

function Chips({ row, hidden }: { row: readonly string[]; hidden?: boolean }) {
  return (
    <ul className="mq-set" aria-hidden={hidden || undefined}>
      {row.map((n) => (
        <li key={n} className="mq-chip">
          <Icon name={n} />
          <span>{brandIcons[n]?.label}</span>
        </li>
      ))}
    </ul>
  );
}

// One marquee row: the set twice, the copy hidden from assistive tech, so
// the track loops seamlessly by moving one set's width (motion.md §15).
function Row({ row, reverse }: { row: readonly string[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "mq-row mq-rev" : "mq-row"}>
      <div className="mq-track">
        <Chips row={row} />
        <Chips row={row} hidden />
      </div>
    </div>
  );
}

// It runs where you already work, on the model you already pay for
// (sections.md §3): the platforms beside the provider index, headed by 45.
export function Works({ copy }: { copy: Copy["works"] }) {
  return (
    <Section ground="paper" className="works" labelledBy="works-title">
      <div className="wrap works-grid">
        <div className="works-copy">
          <h2 className="t-h2s" id="works-title">
            {copy.title}
          </h2>
          <p className="t-body">{copy.body}</p>
          <ul className="works-tiles" aria-label={copy.platforms}>
            {PLATFORMS.map(({ icon, flag }) => (
              <li key={icon} className="works-tile">
                <Icon name={icon} />
                <span className="works-tile-t">
                  <span className="t-h4">
                    {icon === "git" ? copy.local : brandIcons[icon]?.label}
                  </span>
                  <code>{flag}</code>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="works-index">
          <h3 className="works-gauge">
            <span className="t-gauge">{PROVIDERS_TOTAL}</span>{" "}
            <span className="t-h4">{copy.gauge}</span>
          </h3>
          <div className="mq">
            <Row row={ROW_A} />
            <Row row={ROW_B} reverse />
          </div>
          <div className="works-foot">
            <p className="t-small works-more">
              {fill(copy.more, { count: PROVIDERS_TOTAL - ROW_A.length - ROW_B.length })}
            </p>
            <MarqueePause pause={copy.marquee.pause} play={copy.marquee.play} />
          </div>
        </div>
      </div>
    </Section>
  );
}
