import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Window } from "@/components/aqua/window";
import type { Copy } from "@/lib/copy";
import { localePath } from "@/lib/shared";
import { Heading, Section } from "./section";

const code = [
  ["c", "// tools/ocra-team-rules.mjs\n"],
  ["k", "export default"],
  ["", " {\n  name: "],
  ["s", '"team-rules"'],
  ["", ",\n  configure(ctx) {\n    ctx.registerRules([{\n      path: "],
  ["s", '"services/**"'],
  ["", ",\n      rule: "],
  // biome-ignore lint/suspicious/noTemplateCurlyInString: the sample shows a template literal
  ["s", "`${ctx.settings.team}: require idempotency keys`"],
  ["", ",\n    }]);\n  },\n};"],
] as const;

const tone: Record<string, string> = {
  c: "text-[var(--aqua-code-comment)]",
  k: "text-[var(--aqua-code-keyword)] font-bold",
  s: "text-[var(--aqua-code-string)]",
  "": "",
};

export function Plugins({
  copy,
  locale,
}: {
  copy: Copy["plugins"];
  locale: string;
}) {
  return (
    <Section className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <Heading title={copy.title} body={copy.body} className="mb-8" />
        <ul className="space-y-3 text-[0.95rem]">
          {copy.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="gel-dot mt-1 size-2.5" />
              {point}
            </li>
          ))}
        </ul>
        <Link
          href={localePath(locale, "/docs/plugins")}
          className="gel-plain mt-8"
        >
          {copy.cta}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Window title="ocra-team-rules.mjs" bodyClassName="p-2">
        <pre className="inset m-0 overflow-x-auto p-5 font-mono text-[12px] leading-[1.7]">
          {code.map(([t, text], i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static fragments that never reorder
            <span key={i} className={tone[t]}>
              {text}
            </span>
          ))}
        </pre>
      </Window>
    </Section>
  );
}
