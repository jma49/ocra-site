# Open-CR-Agent site

The landing page and user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent) (`ocra`), in English and Chinese.

## Development

Requires Node.js 22.19+ (`.nvmrc`). The manual is read from the main repository checked out next to this one as `../ocra`, or from `MANUAL_DIR` (its `docs/manual`); without either, the sync fetches it from GitHub.

```bash
npm ci
npm run dev      # syncs the manual, then starts http://localhost:3000
npm run verify   # Biome, colour check, knip, build, type check, schema check (what CI runs)
npm run format   # Biome's fixes, imports sorted

npm run visual:baseline   # screenshots of the current build
npm run visual            # compare a new build with them
```

The first `npm run visual` needs a browser: `npx playwright install chromium`.

The manual's source lives in the main repository; see [AGENTS.md](AGENTS.md).

## License

Apache-2.0
