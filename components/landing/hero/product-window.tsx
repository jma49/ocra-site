import type { Copy } from "@/lib/copy";
import { KeyGlyph } from "../pen/marks";
import { ExampleChip, Review } from "./review";
import { Terminal } from "./terminal";
import { WindowTabs } from "./window-tabs";

// The key to the pen's three marks: along the desk's foot, and from 1200 px
// in the hero's left column (10-hero.css).
export function PenKey({
  keys,
  className,
}: {
  keys: Copy["window"]["pr"]["key"];
  className: string;
}) {
  return (
    <span className={className}>
      <span>
        <KeyGlyph kind="under" />
        {keys.units}
      </span>
      <span>
        <KeyGlyph kind="caret" />
        {keys.fix}
      </span>
      <span>
        <KeyGlyph kind="bar" />
        {keys.anchor}
      </span>
    </span>
  );
}

// The desk under the hero: two tabs and the Example run chip over two
// papers laid one on the other (the pull request as ocra posts on it, the
// terminal as the CLI printed it), and along the desk's foot the caption
// that says what the example is, with the key to the pen's three marks. In
// Chinese the caption adds a gloss of the comment, which stays English
// inside the window. From 1200 px the hero's left column shows what the
// example is and the key, and the caption keeps them for screen readers
// (10-hero.css).
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
            <span className="product-example">{copy.example}</span>
            {copy.pr.gloss && <span className="product-gloss">{copy.pr.gloss}</span>}
          </span>
          <PenKey keys={copy.pr.key} className="product-key" />
        </figcaption>
      }
    />
  );
}
