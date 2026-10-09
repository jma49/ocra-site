// AGENTS.md stays under 150 lines, and its "Working with agents" section is
// word for word the one in ocra, ocra-cloud and ocra-site: the same SHA-256
// constant sits in each repository's check (ocra: scripts/agents-md.test.mjs).
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const MAX_LINES = 150;
const SHARED_SECTION_SHA256 = "ee6d49ce0c2492effb1328fbea319f8ed19cc2a12c7fa798f20201c491535485";

const agents = readFileSync(new URL("../AGENTS.md", import.meta.url), "utf8");
/** @type {string[]} */
const problems = [];
const lines = agents.trimEnd().split("\n").length;
if (lines >= MAX_LINES) problems.push(`AGENTS.md has ${lines} lines; keep it under ${MAX_LINES}`);
const section = agents.match(/^## Working with agents\n[\s\S]*?(?=^## |^<!-- |(?![\s\S]))/m)?.[0];
const hash = createHash("sha256")
  .update(section?.trim() ?? "")
  .digest("hex");
if (hash !== SHARED_SECTION_SHA256)
  problems.push(
    "AGENTS.md's Working with agents section differs from the one shared with ocra and ocra-site/ocra-cloud",
  );
for (const p of problems) console.error(p);
process.exit(problems.length ? 1 : 0);
