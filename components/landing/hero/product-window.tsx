import type { Copy } from "@/lib/copy";
import { KeyGlyph } from "../pen/marks";
import { ExampleChip, Review } from "./review";
import { Terminal } from "./terminal";
import { WindowTabs } from "./window-tabs";

// The desk under the hero: two tabs and the Example run chip over two
// papers laid one on the other (the pull request as ocra posts on it, the
// terminal as the CLI printed it), and along the desk's foot the caption
// that says what the example is, with the key to the pen's three marks. In
// Chinese the caption adds a gloss of the comment, which stays English
// inside the window.
export function ProductWindow({ copy }: { copy: Copy["window"] }) {
  return (
    <WindowTabs
      labels={copy.tabs}
      tablist={copy.tablist}
      chip={<ExampleChip label={copy.exampleChip} where="desk" />}
      panes={{ pr: <Review copy={copy} />, terminal: <Terminal copy={copy} /> }}
      caption={
        <figcaption id="product-cap" className="product-cap t-small">
          <span className="product-what">
            <span>{copy.example}</span>
            {copy.pr.gloss && <span className="product-gloss">{copy.pr.gloss}</span>}
          </span>
          <span className="product-key">
            <span>
              <KeyGlyph kind="under" />
              {copy.pr.key.units}
            </span>
            <span>
              <KeyGlyph kind="caret" />
              {copy.pr.key.fix}
            </span>
            <span>
              <KeyGlyph kind="bar" />
              {copy.pr.key.anchor}
            </span>
          </span>
        </figcaption>
      }
    />
  );
}
