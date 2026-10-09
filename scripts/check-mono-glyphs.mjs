// The code face is cut down to the characters code on the site uses
// (scripts/subset-mono.py). A character the cut dropped falls through to
// another monospace face, which a screenshot on a machine with Maple Mono
// installed never shows. This fails on any character the site may set in
// the code face that Maple Mono has but the cut does not: the manual's code
// in both languages (run after sync-manual), and every string in the landing
// page's copy, data, components and the recorded file the hero shows.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";

const ORIGINAL = "node_modules/@fontsource/maple-mono/files/maple-mono-latin-{w}-normal.woff2";
const CUT = "assets/fonts/ocra-mono-{w}.woff2";
const WEIGHTS = ["400", "500"];
const SOURCES = [
  { dir: "content/docs", match: /\.mdx$/, code: true },
  { dir: "lib", match: /\.tsx?$/ },
  { dir: "components", match: /\.tsx?$/ },
  { dir: "scripts/demo-video/repo/head", match: /./ },
];

// WOFF2 (https://www.w3.org/TR/WOFF2/): a table directory, then every table
// in one Brotli stream. Only cmap is read, and cmap is never transformed.
function cmapOf(path) {
  const font = readFileSync(path);
  const numTables = font.readUInt16BE(12);
  const compressedLength = font.readUInt32BE(20);
  let at = 48;
  const base128 = () => {
    let value = 0;
    for (let i = 0; i < 5; i++) {
      const byte = font[at++];
      value = value * 128 + (byte & 0x7f);
      if (!(byte & 0x80)) return value;
    }
    throw new Error(`${path}: bad UIntBase128`);
  };
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = font[at++];
    const known = flags & 0x3f;
    let tag;
    if (known === 63) {
      tag = font.toString("latin1", at, at + 4);
      at += 4;
    } else {
      tag = known === 0 ? "cmap" : `#${known}`;
    }
    const version = flags >> 6;
    const length = base128();
    // glyf (10) and loca (11) are transformed at version 0; others above it.
    const transformed = known === 10 || known === 11 ? version === 0 : version !== 0;
    tables.push({ tag, length: transformed ? base128() : length });
  }
  const data = brotliDecompressSync(font.subarray(at, at + compressedLength));
  let offset = 0;
  for (const table of tables) {
    if (table.tag === "cmap") return parseCmap(data.subarray(offset, offset + table.length));
    offset += table.length;
  }
  throw new Error(`${path}: no cmap`);
}

function parseCmap(cmap) {
  const codepoints = new Set();
  const count = cmap.readUInt16BE(2);
  for (let i = 0; i < count; i++) {
    const sub = cmap.subarray(cmap.readUInt32BE(4 + i * 8 + 4));
    const format = sub.readUInt16BE(0);
    if (format === 4) {
      const segments = sub.readUInt16BE(6) / 2;
      for (let s = 0; s < segments; s++) {
        const end = sub.readUInt16BE(14 + s * 2);
        const start = sub.readUInt16BE(16 + segments * 2 + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) codepoints.add(c);
      }
    } else if (format === 12) {
      const groups = sub.readUInt32BE(12);
      for (let g = 0; g < groups; g++) {
        const start = sub.readUInt32BE(16 + g * 12);
        const end = sub.readUInt32BE(20 + g * 12);
        for (let c = start; c <= end; c++) codepoints.add(c);
      }
    }
  }
  return codepoints;
}

function* files(dir, match) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path, match);
    else if (match.test(entry.name)) yield path;
  }
}

// In the manual only code is set in the code face: fenced blocks and inline
// code spans.
const codeIn = (mdx) => (mdx.match(/```[\s\S]*?```|`[^`\n]+`/g) ?? []).join("\n");

const used = new Map();
for (const { dir, match, code } of SOURCES) {
  let seen = 0;
  for (const path of files(dir, match)) {
    seen++;
    const text = readFileSync(path, "utf8");
    for (const char of code ? codeIn(text) : text) {
      const c = char.codePointAt(0);
      if (c > 0x7e && !used.has(c)) used.set(c, path);
    }
  }
  if (!seen) throw new Error(`no files under ${dir}: run sync-manual first`);
}

const missing = [];
for (const weight of WEIGHTS) {
  const original = cmapOf(ORIGINAL.replace("{w}", weight));
  const cut = cmapOf(CUT.replace("{w}", weight));
  for (const [c, path] of used) {
    if (original.has(c) && !cut.has(c)) {
      const hex = c.toString(16).toUpperCase().padStart(4, "0");
      missing.push(`${weight}: U+${hex} ${String.fromCodePoint(c)} (${path})`);
    }
  }
}

if (missing.length) {
  console.error("Characters Maple Mono has but the cut code face dropped:");
  for (const line of missing) console.error(`  ${line}`);
  console.error("Add them to UNICODES in scripts/subset-mono.py and run it again.");
  process.exit(1);
}
console.log(`mono glyphs: ${used.size} non-ASCII characters checked, none dropped by the cut`);
