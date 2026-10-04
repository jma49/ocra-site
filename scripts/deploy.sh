#!/usr/bin/env bash
# Deploys the committed HEAD of this repository to production on Vercel.
# Git deployments are off (vercel.json) and deploy hooks do not run while
# they are, so this is the one way to deploy. Needs a logged-in Vercel CLI
# (`npx vercel login`) with access to the project; each run is one build.
set -euo pipefail

project="${VERCEL_PROJECT:-ocra}"
scope="${VERCEL_SCOPE:?set VERCEL_SCOPE to the Vercel team slug}"

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash your changes first: only committed code is deployed." >&2
  exit 1
fi

dir="$(mktemp -d)"
trap 'rm -rf "$dir"' EXIT
# Only committed files: no build output, no dependencies, no local env.
git archive HEAD | tar -x -C "$dir"
cd "$dir"
npx -y vercel link --yes --project "$project" --scope "$scope" >/dev/null
rm -f .env.local
# --force skips Vercel's build cache: a restored cache served the previous
# manual after it changed on main (2026-10-04).
npx -y vercel deploy --prod --yes --force --scope "$scope"
