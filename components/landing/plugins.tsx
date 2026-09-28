import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import type { Copy } from "@/lib/copy";
import { localePath } from "@/lib/shared";
import { Heading, Section } from "./section";

const code = [
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
  c: "text-code-comment",
  k: "text-code-keyword font-medium",
  s: "text-code-string",
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
    <Section band className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <Heading
          index={4}
          title={copy.title}
          body={copy.body}
          className="mb-8"
        />
        <ul className="space-y-3 text-[0.95rem]">
          {copy.points.map((point) => (
            <li key={point} className="flex gap-3">
              <Check
                strokeWidth={1.5}
                className="mt-1 size-4 shrink-0 text-accent"
              />
              {point}
            </li>
          ))}
        </ul>
        <Link
          href={localePath(locale, "/docs/plugins")}
          className="btn-outline mt-9"
        >
          {copy.cta}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Panel label="tools/ocra-team-rules.mjs">
        <pre className="m-0 overflow-x-auto p-5 font-mono text-[12px] leading-[1.7]">
          {code.map(([t, text], i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static fragments that never reorder
            <span key={i} className={tone[t]}>
              {text}
            </span>
          ))}
        </pre>
      </Panel>
    </Section>
  );
}
