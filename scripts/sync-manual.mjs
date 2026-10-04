// Copies the user manual from the main repository into content/docs, and
// its published JSON Schemas into public/schema. The manual lives next to
// the code it documents, so every behavior change updates it in the same
// pull request; this site only renders it. The schemas' $id URLs point here
// (the old host redirects with the path kept), so editors resolve them.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const target = resolve("content/docs");
const schemaTarget = resolve("public/schema");
const SCHEMA_HOSTS = ["ocracloud.com", "ocra.majincheng.com"];
// MANUAL_SOURCE=remote always fetches (CI, so both builds read main). Else
// MANUAL_DIR, which must exist, or the engine checkout next to this one
// (../ocra, the documented workspace layout), or a fetch when there is none.
const remote = process.env.MANUAL_SOURCE === "remote";
const localDir = remote
  ? undefined
  : process.env.MANUAL_DIR
    ? resolve(process.env.MANUAL_DIR)
    : [resolve("../ocra/docs/manual")].find((dir) => existsSync(dir));
if (localDir && !existsSync(localDir)) {
  throw new Error(`MANUAL_DIR ${localDir} does not exist`);
}
const repo = process.env.MANUAL_REPO ?? "https://github.com/jma49/Open-CR-Agent.git";
const ref = process.env.MANUAL_REF ?? "main";

// docs/schema sits next to docs/manual in the main repository.
function copyFrom(dir, label) {
  rmSync(target, { recursive: true, force: true });
  cpSync(dir, target, { recursive: true });
  for (const language of ["en", "zh"]) {
    if (!existsSync(join(target, language))) {
      throw new Error(`the manual from ${label} has no ${language}/ directory`);
    }
  }
  console.log(`[sync-manual] copied manual from ${label}`);
  copySchemas(join(dirname(dir), "schema"), label);
}

// Every schema must say it lives at /schema/<its file name> on this site,
// or an editor following its $id gets a 404.
function copySchemas(dir, label) {
  const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
  if (files.length === 0) throw new Error(`no JSON Schemas in ${dir}`);
  rmSync(schemaTarget, { recursive: true, force: true });
  mkdirSync(schemaTarget, { recursive: true });
  for (const name of files) {
    const id = new URL(JSON.parse(readFileSync(join(dir, name), "utf8")).$id);
    if (!SCHEMA_HOSTS.includes(id.host) || id.pathname !== `/schema/${name}`) {
      throw new Error(`${name}: $id ${id} is not served by this site`);
    }
    cpSync(join(dir, name), join(schemaTarget, name));
  }
  console.log(`[sync-manual] copied ${files.join(", ")} from ${label}`);
}

if (localDir) {
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
  try {
    git("init", "--quiet");
    git("remote", "add", "origin", repo);
    git("sparse-checkout", "set", "docs/manual", "docs/schema");
    git("fetch", "--quiet", "--depth=1", "--filter=blob:none", "origin", ref);
    git("checkout", "--quiet", "FETCH_HEAD");
    copyFrom(join(checkout, "docs/manual"), `${repo}@${ref}`);
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
}
