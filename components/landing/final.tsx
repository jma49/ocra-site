import type { Copy } from "@/lib/copy";
import { cloudUrl } from "@/lib/shared";
import { CopyCommand } from "./copy-command";
import { Lines, Themed } from "./parts";

// The closing call, standing on a last row of shapes that runs into the
// footer.
export function Final({ copy }: { copy: Copy["final"] }) {
  return (
    <section className="final" aria-labelledby="final-h">
      <div className="wrap center-head">
        <h2 className="h2 h2-xl" id="final-h">
          <Lines lines={copy.lines} />
        </h2>
        <div className="hero-cta">
          <a className="btn btn-ink" href={cloudUrl}>
            {copy.start}
          </a>
          <div className="cmd">
            <span className="t3" aria-hidden="true">
              $
            </span>
            <code>{copy.command}</code>
            <CopyCommand text={copy.command} label={copy.copy} done={copy.copied} />
          </div>
        </div>
      </div>
      <div className="final-art" aria-hidden="true">
        <Themed name="final" ext="svg" width={1440} height={520} />
      </div>
    </section>
  );
}
