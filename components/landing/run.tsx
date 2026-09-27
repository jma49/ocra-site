import type { Copy } from "@/lib/copy";
import { PipelineFlow } from "./pipeline-flow";
import { Heading, Section } from "./section";

export function Run({ copy }: { copy: Copy["run"] }) {
  return (
    <Section id="how-it-works">
      <Heading index={1} title={copy.title} body={copy.body} />
      <div className="panel overflow-hidden">
        <PipelineFlow copy={copy.flow} stages={copy.stages} />
      </div>
    </Section>
  );
}
