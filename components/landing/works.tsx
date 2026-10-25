import type { Copy } from "@/lib/copy";
import { fill } from "@/lib/copy/define";
import { brandIcons } from "@/lib/landing/brand-icons";
import { PROVIDERS } from "@/lib/landing/engine-facts";
import { MarqueePause } from "./marquee-pause";
import { Lines, Section } from "./section";

// Where ocra reviews, and the `ocra review` flag that points it there
// (the CLI's --pr, --mr and --from: docs/manual/en/cli.mdx). What it leaves
// there is copy (copy.leaves).
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

// What ocra leaves on the platform, in the tile's mono. The space before
// the second thing joins the two on a phone's one line; between a desktop
// tile's two block lines it collapses.
function Leaves({ items }: { items: Copy["works"]["leaves"]["git"] }) {
  const [first, second] = items;
  return (
    <span className="works-tile-o">
      <span>{first}</span>
      {second && (
        <>
          {" "}
          <span>+ {second}</span>
        </>
      )}
    </span>
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
// (sections.md §3): the H2 on the page's headline step across the grid,
// then the platforms beside the provider index, headed by its count.
export function Works({ copy }: { copy: Copy["works"] }) {
  return (
    <Section ground="paper" className="works" labelledBy="works-title">
      <div className="wrap works-grid">
        <h2 className="t-h2 works-h" id="works-title">
          <Lines lines={copy.lines} />
        </h2>
        <div className="works-copy">
          <p className="t-body">{copy.body}</p>
          <ul className="works-tiles" aria-label={copy.platforms}>
            {PLATFORMS.map(({ icon, flag }) => (
              <li key={icon} className="works-tile">
                <span className="works-tile-h">
                  <Icon name={icon} />
                  <code>{flag}</code>
                </span>
                <span className="t-h4">
                  {icon === "git" ? copy.local : brandIcons[icon]?.label}
                </span>
                <Leaves items={copy.leaves[icon]} />
              </li>
            ))}
          </ul>
        </div>
        <div className="works-index">
          <h3 className="works-gauge">
            <span className="t-gauge">{PROVIDERS}</span> <span className="t-h4">{copy.gauge}</span>
          </h3>
          <div className="mq">
            <Row row={ROW_A} />
            <Row row={ROW_B} reverse />
          </div>
          <div className="works-foot">
            <p className="t-small works-more">
              {fill(copy.more, { count: PROVIDERS - ROW_A.length - ROW_B.length })}
            </p>
            <MarqueePause pause={copy.marquee.pause} play={copy.marquee.play} />
          </div>
        </div>
      </div>
    </Section>
  );
}
