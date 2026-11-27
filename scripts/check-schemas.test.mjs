import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { once } from "node:events";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

for (const matches of [true, false]) {
  test(`schema check releases its listener on ${matches ? "success" : "failure"}`, async (t) => {
    const cwd = mkdtempSync(join(tmpdir(), "check-schemas-"));
    t.after(() => rmSync(cwd, { recursive: true, force: true }));
    const file = (path) => join(cwd, path);
    for (const dir of ["node_modules/next/dist/bin", "node_modules/.bin", "public/schema"]) {
      mkdirSync(file(dir), { recursive: true });
    }
    const fixture = new URL("../tests/fixtures/schema-server.cjs", import.meta.url);
    for (const bin of ["node_modules/next/dist/bin/next", "node_modules/.bin/next"]) {
      copyFileSync(fixture, file(bin));
      chmodSync(file(bin), 0o755);
    }
    const schema = JSON.stringify({ $id: "https://example.org/schema/test.json" });
    writeFileSync(file("public/schema/test.json"), schema);
    writeFileSync(file("served.json"), matches ? schema : "{}");
    copyFileSync(new URL("./check-schemas.mjs", import.meta.url), file("check-schemas.mjs"));

    // An orphan would inherit stderr and keep a pipe to this test open.
    const result = spawnSync(process.execPath, ["check-schemas.mjs"], {
      cwd,
      stdio: "ignore",
      timeout: 10000,
    });
    const { port, pid } = JSON.parse(readFileSync(file("listener.json"), "utf8"));
    const probe = createServer();
    try {
      probe.listen(port, "127.0.0.1");
      await assert.doesNotReject(once(probe, "listening"), `checker left port ${port} in use`);
    } finally {
      if (probe.listening) probe.close();
      else process.kill(pid, "SIGKILL");
    }
    assert.ifError(result.error);
    assert.equal(result.status, matches ? 0 : 1);
  });
}
