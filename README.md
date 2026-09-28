# Open-CR-Agent site

The landing page and user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent) (`ocra`), in English and Chinese.

## Development

Requires Node.js 22+ and the main repository checked out next to this one (or `MANUAL_DIR` pointing at its `docs/manual`).

```bash
npm install
npm run dev      # syncs the manual, then starts http://localhost:3000
npm run build

npm run visual:baseline   # screenshots of the current build
npm run visual            # compare a new build with them
```

The first `npm run visual` needs a browser: `npx playwright install chromium`.

The manual's source lives in the main repository; see [AGENTS.md](AGENTS.md).

## License

Apache-2.0
