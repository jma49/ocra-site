// The copy states the engine's numbers from lib/landing/engine-facts.ts; this
// compares them with the engine's source. It reads the engine checkout next
// to this repository (../ocra, or OCRA_DIR, which must exist) and skips
// without one, as in CI, which checks out this repository alone.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { MAX_AGENT_STEPS, PROVIDERS } from "../lib/landing/engine-facts.ts";

const engine = resolve(import.meta.dirname, "..", process.env.OCRA_DIR ?? "../ocra");
if (process.env.OCRA_DIR && !existsSync(engine))
  throw new Error(`OCRA_DIR ${engine} does not exist`);
const skip = existsSync(join(engine, "packages")) ? false : `no engine checkout at ${engine}`;
const source = (path) =>
  readFileSync(join(engine, "packages", path), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

test("the step cap the copy states is the engine's", { skip }, () => {
  const cap = source("core/src/runtime/attempt.ts").match(/export const MAX_AGENT_STEPS = (\d+);/);
  assert.ok(cap, "MAX_AGENT_STEPS is not a number literal in attempt.ts");
  assert.equal(MAX_AGENT_STEPS, Number(cap[1]));
});

test("the provider count the copy states is the gateway's", { skip }, () => {
  const list = source("cloud-contract/src/providers.ts").match(
    /export const PROVIDER_IDS = \[([^\]]*)\]/,
  );
  assert.ok(list, "PROVIDER_IDS is not an array literal in providers.ts");
  const ids = list[1].match(/"[^"]+"/g) ?? [];
  assert.equal(PROVIDERS, ids.length);
});
