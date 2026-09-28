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
    <Section
      id="plugins"
      labelledBy="plugins-title"
      className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:pt-8"
    >
      <div>
        <Heading
          id="plugins-title"
          title={copy.title}
          body={copy.body}
          locale={locale}
        />
        <ul className="mt-9 flex list-none flex-col gap-3 p-0 text-[0.9375rem]">
          {copy.points.map((point) => (
            <li key={point} className="flex gap-3">
              <Check
                strokeWidth={2}
                className="mt-1 size-4 shrink-0 text-accent"
              />
              {point}
            </li>
          ))}
        </ul>
        <Link
          href={localePath(locale, "/docs/plugins")}
          className="btn-outline btn-lg mt-10"
        >
          {copy.cta}
          <ArrowRight className="size-[18px]" />
        </Link>
      </div>
      <Panel label="tools/ocra-team-rules.mjs">
        <pre className="m-0 overflow-x-auto p-6 font-mono text-[0.8125rem] leading-[1.8]">
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
