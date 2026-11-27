# Open-CR-Agent site

The [Ocra landing page](https://ocracloud.com/) and [user manual](https://ocracloud.com/docs) for [Open-CR-Agent](https://github.com/ocrahq/Open-CR-Agent) (`ocra`), in English and Chinese.

## Development

Requires Node.js 22.19+ (`.nvmrc`). Before dev and build, `scripts/sync-manual.mjs` copies the bilingual manual and its sibling `docs/schema` directory from the engine. Set `MANUAL_DIR` to an engine checkout's `docs/manual`, or check out the engine at `../ocra`. Without either, the script fetches Open-CR-Agent's `main` from GitHub. CI sets `MANUAL_SOURCE=remote` to fetch even when a local checkout exists; `MANUAL_REPO` and `MANUAL_REF` override the remote defaults.

```bash
npm ci
npm run dev      # syncs the manual, then starts http://localhost:3000
npm run verify   # Biome, colour and AGENTS checks, knip, tests, build, types, schemas
npm run format   # Biome's fixes, imports sorted

npm run visual:baseline   # screenshots of the current build
npm run visual            # compare a new build with them
```

The first `npm run visual` needs a browser: `npx playwright install chromium`.

Edit the manual in the engine repository, not the generated `content/docs` here. Landing copy lives in `lib/copy/sections/`; update both locales together. Merging a pull request does not deploy the site. See [AGENTS.md](AGENTS.md) for the verification and deploy workflow.

## Before a release

Run the manual [Release check](https://github.com/ocrahq/ocra-site/actions/workflows/release-check.yml) for the site revision you intend to publish (`gh workflow run release-check.yml --ref main` for site `main`). It checks out engine `main` once: the landing-page fact tests read that checkout, and the build copies both languages of the manual and the schemas from it. The run summary records both commit SHAs; check that the fact tests pass with zero skips.

This check does not deploy or pin production to the tested engine commit. If engine `main` moves before release, run it again. Ordinary pull requests still skip the engine fact tests.

## License

Apache-2.0
