// Copies the user manual from the main repository into content/docs.
// The manual lives next to the code it documents, so every behavior change
// updates it in the same pull request; this site only renders it.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const target = resolve("content/docs");
// The maintainer's checkout is named ocra; a fresh clone is Open-CR-Agent.
const localDir =
  process.env.MANUAL_DIR ??
  ["../ocra", "../Open-CR-Agent"]
    .map((dir) => resolve(dir, "docs/manual"))
    .find((dir) => existsSync(dir));
const repo =
  process.env.MANUAL_REPO ?? "https://github.com/jma49/Open-CR-Agent.git";
const ref = process.env.MANUAL_REF ?? "main";

function copyFrom(dir, label) {
  rmSync(target, { recursive: true, force: true });
  cpSync(dir, target, { recursive: true });
  console.log(`[sync-manual] copied manual from ${label}`);
}

if (localDir && existsSync(localDir) && !process.env.VERCEL) {
  copyFrom(localDir, localDir);
} else {
  const checkout = mkdtempSync(join(tmpdir(), "ocra-manual-"));
  const token = process.env.GITHUB_TOKEN;
  // The token goes in a header rather than the URL so it never appears in logs.
  const auth = token
    ? [
        "-c",
        `http.extraHeader=Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`,
      ]
    : [];
  const git = (...args) =>
    execFileSync("git", [...auth, ...args], {
      cwd: checkout,
      stdio: "inherit",
    });
  git("init", "--quiet");
  git("remote", "add", "origin", repo);
  git("sparse-checkout", "set", "docs/manual");
  git("fetch", "--quiet", "--depth=1", "--filter=blob:none", "origin", ref);
  git("checkout", "--quiet", "FETCH_HEAD");
  copyFrom(join(checkout, "docs/manual"), `${repo}@${ref}`);
  rmSync(checkout, { recursive: true, force: true });
}
