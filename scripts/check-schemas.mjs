// After a build: serves the site and checks that every synced JSON Schema
// answers at the path of its $id, byte for byte, as JSON.
import { spawn } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";

const dir = "public/schema";
const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
if (files.length === 0) throw new Error(`no schemas in ${dir}; run the build`);

const port = await new Promise((done) => {
  const probe = createServer().listen(0, "127.0.0.1", () => {
    const { port } = probe.address();
    probe.close(() => done(port));
  });
});
const server = spawn("npx", ["next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  stdio: ["ignore", "ignore", "inherit"],
});
const base = `http://127.0.0.1:${port}`;

// Polls a schema rather than /: without the locale cookie a browser keeps,
// next start answers / with a redirect loop.
async function ready() {
  for (let i = 0; i < 120; i++) {
    try {
      await fetch(`${base}/schema/${files[0]}`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error("next start did not answer within 60 s");
}

const failures = [];
try {
  await ready();
  for (const name of files) {
    const text = readFileSync(join(dir, name), "utf8");
    const path = new URL(JSON.parse(text).$id).pathname;
    const response = await fetch(base + path);
    const body = await response.text();
    const type = response.headers.get("content-type") ?? "";
    if (response.status !== 200) failures.push(`${path}: ${response.status}`);
    else if (!type.includes("application/json")) failures.push(`${path}: content-type ${type}`);
    else if (body !== text) failures.push(`${path}: body differs from ${name}`);
    else console.log(`${path}: 200 ${type}`);
  }
} finally {
  server.kill();
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
