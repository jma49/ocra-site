// Colours come from the tokens in app/tokens.css (DESIGN.md); this fails on a
// colour literal anywhere else. The standalone icons and the share card are
// images, not themed pages, so they keep their own values.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "components", "lib"];
const allowed = new Set([
  "app/tokens.css",
  "app/icon.svg",
  "app/apple-icon.tsx",
  "app/opengraph-image.tsx",
]);
const css =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(|(?<![\w-])(?:white|black)(?![\w-])/gi;
// In code, a colour is a string that is only a hex value or a colour function.
const code = /["'`](?:#[0-9a-f]{3,8}|(?:rgba?|hsla?|oklch)\([^"'`]*\))["'`]/gi;

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(css|tsx?)$/.test(entry.name)) yield path;
  }
}

const found = [];
for (const root of roots) {
  for (const path of files(root)) {
    if (allowed.has(path)) continue;
    const pattern = path.endsWith(".css") ? css : code;
    readFileSync(path, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const text = path.endsWith(".css") ? line.replace(/\/\*.*?\*\//g, "") : line;
        for (const match of text.matchAll(pattern)) {
          found.push(`${path}:${i + 1}: ${match[0]}`);
        }
      });
  }
}

if (found.length > 0) {
  console.error("Colour literals outside app/tokens.css; use a token:");
  for (const line of found) console.error(`  ${line}`);
  process.exit(1);
}
