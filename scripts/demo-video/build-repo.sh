#!/bin/bash
# Builds the demo repository the site's example run reviews, in .demo/acme-api:
# `main` holds the login code, ocra's config and one accepted finding in
# memory; `feat/session-expiry` adds session expiry with the seconds and
# milliseconds bug the example finds.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/../.." && pwd)/.demo/acme-api
rm -rf "$repo" && mkdir -p "$repo" && cd "$repo"
git init -q -b main
git config user.name "Demo" && git config user.email "demo@example.com"

lock() {
  cat <<JSON
{
  "name": "acme-api",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": { "name": "acme-api", "dependencies": { "undici": "^7.10.0" } },
    "node_modules/undici": {
      "version": "$1",
      "resolved": "https://registry.npmjs.org/undici/-/undici-$1.tgz",
      "license": "MIT"
    }
  }
}
JSON
}

cp -r "$here/repo/base/." .
mv gitignore .gitignore
printf '{\n  "name": "acme-api",\n  "private": true,\n  "type": "module",\n  "dependencies": { "undici": "^7.10.0" }\n}\n' > package.json
lock 7.10.0 > package-lock.json
mkdir -p .ocra
cp "$here/repo/memory.json" .ocra/memory.json
cat > .ocra/config.json <<JSON
{
  "runtime": "scripted",
  "plugins": ["$here/scripted-runtime.mjs"],
  "models": {
    "top": "google/gemini-3.1-pro-preview",
    "standard": "google/gemini-3.5-flash",
    "light": "google/gemini-flash-lite-latest"
  }
}
JSON
git add -A
GIT_AUTHOR_DATE="2026-09-21T10:00:00Z" GIT_COMMITTER_DATE="2026-09-21T10:00:00Z" git commit -q -m "Add login"

git switch -q -c feat/session-expiry
cp -r "$here/repo/head/." .
lock 7.16.0 > package-lock.json
git add -A
GIT_AUTHOR_DATE="2026-09-28T10:00:00Z" GIT_COMMITTER_DATE="2026-09-28T10:00:00Z" git commit -q -m "Expire sessions after 30 minutes"
echo "$repo"
