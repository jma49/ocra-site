// The copy states the engine's facts from lib/landing/engine-facts.ts and
// its measured quality from lib/landing/measured.ts; this compares them with
// the engine's source and manual. It reads the engine checkout next to this
// repository (../ocra, or OCRA_DIR, which must exist; CI checks the engine
// out and sets it) and skips without one.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import {
  accessDenied,
  BUILTINS_OFF,
  MAX_AGENT_STEPS,
  OPENCODE_BUILTINS,
  PROVIDERS,
  REFUSED,
} from "../lib/landing/engine-facts.ts";
import { measured } from "../lib/landing/measured.ts";

const engine = resolve(import.meta.dirname, "..", process.env.OCRA_DIR ?? "../ocra");
const present = existsSync(join(engine, "packages"));
if (process.env.OCRA_DIR && !present)
  throw new Error(`OCRA_DIR ${engine} is not an engine checkout`);
const skip = present ? false : `no engine checkout at ${engine}`;

// Comments out, string literals kept whole: a glob such as "**/*.pem" holds
// both comment openers, and a URL holds the line comment's.
const source = (path) =>
  readFileSync(join(engine, "packages", path), "utf8").replace(
    /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,
    (_, literal) => literal ?? "",
  );
// The string entries of `export const NAME = [...]` in an engine file.
const entries = (path, name) => {
  const list = source(path).match(new RegExp(`export const ${name} = \\[([^\\]]*)\\]`));
  assert.ok(list, `${name} is not an array literal in ${path}`);
  return (list[1].match(/"[^"]*"/g) ?? []).map((entry) => entry.slice(1, -1));
};

test("the step cap the copy states is the engine's", { skip }, () => {
  const cap = source("core/src/runtime/attempt.ts").match(/export const MAX_AGENT_STEPS = (\d+);/);
  assert.ok(cap, "MAX_AGENT_STEPS is not a number literal in attempt.ts");
  assert.equal(MAX_AGENT_STEPS, Number(cap[1]));
});

test("the provider count the copy states is the gateway's", { skip }, () => {
  assert.equal(PROVIDERS, entries("cloud-contract/src/providers.ts", "PROVIDER_IDS").length);
});

test("the built-ins the copy counts and names are the pinned OpenCode's, all off", { skip }, () => {
  const path = "runtime-opencode/src/opencode-config.ts";
  const tools = entries(path, "OPENCODE_BUILTIN_TOOLS");
  assert.equal(OPENCODE_BUILTINS, tools.length);
  for (const tool of BUILTINS_OFF) assert.ok(tools.includes(tool), `${tool} is not a built-in`);
  assert.match(
    source(path),
    /DISABLED_BUILTINS = Object\.fromEntries\(\s*OPENCODE_BUILTIN_TOOLS\.map\(\((\w+)\) => \[\1, false\]\),?\s*\)/,
    "DISABLED_BUILTINS no longer turns every built-in off",
  );
});

test("the paths the copy says the gate refuses, and its answer, are the engine's", { skip }, () => {
  const secrets = entries("core/src/select/patterns.ts", "SECRET_PATTERNS");
  const gate = source("core/src/pipeline/context.ts");
  for (const path of REFUSED) {
    if (path.endsWith("/")) {
      assert.ok(
        gate.includes(`segments.includes(${JSON.stringify(path.slice(0, -1))})`),
        `reviewContext does not refuse ${path}`,
      );
    } else {
      assert.ok(
        secrets.includes(`**/${path}`) || secrets.includes(`**/${path}*`),
        `${path} is not in SECRET_PATTERNS`,
      );
    }
  }
  const thrown = gate.match(/new AccessDeniedError\(`([^`]*)`\)/);
  assert.ok(thrown, "reviewContext's AccessDeniedError message is not a template literal");
  assert.equal(accessDenied("X"), thrown[1].replace(/\$\{\w+\}/, "X"));
});

test("the measured result the copy states is the manual's", { skip }, () => {
  const page = readFileSync(join(engine, "docs/manual/en/quality.mdx"), "utf8");
  const callout = page.match(/<Callout>([\s\S]*?)<\/Callout>/)?.[1] ?? "";
  const figure = (pattern) => {
    const found = callout.match(pattern);
    assert.ok(found, `quality.mdx's opening callout no longer says ${pattern}; re-read it`);
    return Number(found[1]);
  };
  const all = figure(/\*\*all (\d+) findings it reported were correct\*\*/);
  assert.deepEqual(measured, {
    changes: figure(/On (\d+) changes/),
    known: figure(/with (\d+) known issues/),
    found: figure(/found \*\*(\d+) /),
    reported: all,
    correct: all,
  });
});
