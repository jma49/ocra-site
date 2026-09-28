// Runs `ocra review --from main` in the demo repository and records every
// output line with the time it appeared, for the video renderer.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = process.env.OCRA_CLI;
if (!cli)
  throw new Error(
    "Set OCRA_CLI to packages/cli/dist/main.js of an Open-CR-Agent build",
  );
const repo = join(here, "../../.demo/acme-api");

const start = performance.now();
const lines = [];
const child = spawn("node", [cli, "review", "--from", "main"], { cwd: repo });
for (const [name, stream] of [
  ["err", child.stderr],
  ["out", child.stdout],
]) {
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    buffer += chunk;
    for (let i = buffer.indexOf("\n"); i >= 0; i = buffer.indexOf("\n")) {
      lines.push({
        t: Math.round(performance.now() - start),
        stream: name,
        text: buffer.slice(0, i),
      });
      buffer = buffer.slice(i + 1);
    }
  });
}
child.on("close", (exit) => {
  const transcript = { command: "ocra review --from main", exit, lines };
  writeFileSync(
    join(here, "transcript.js"),
    `window.TRANSCRIPT = ${JSON.stringify(transcript, null, 1)};\n`,
  );
  console.log(
    `exit ${exit}, ${lines.length} lines over ${lines.at(-1)?.t ?? 0} ms`,
  );
});
