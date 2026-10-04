# Demo video

The landing page quotes one `ocra review --from main` run (the hero window's
pull request and terminal, the step pictures, the finding). The page no longer
shows the video; rendering it is optional. `public/demo/review-{en,zh}.mp4`
(not committed) would show that run on a
small demo repository, sped up, next to the pipeline stages it passes
through. The terminal lines are a real transcript: the ocra CLI runs its
whole pipeline, and only the model is replaced by `scripted-runtime.mjs`, a
plugin that answers review tasks, file grouping, verification and the judge
with fixed findings and realistic pacing. The site's example (hero terminal,
stage pictures, finding) uses the same run.

Re-record it when ocra's output changes:

1. Build Open-CR-Agent (`npm run build` in the main repository).
2. `scripts/demo-video/build-repo.sh` creates `.demo/acme-api` from `repo/`.
3. `OCRA_CLI=../Open-CR-Agent/packages/cli/dist/main.js node scripts/demo-video/record.mjs`
   runs the review in real time (about 90 seconds) and writes `transcript.js`.
   Copy what changed into `lib/landing/example-run.ts` (counts, usage, the
   finding, the terminal lines): the landing page reads the run from there
   and nowhere else.
   `DEMO_SPEED=40` is quicker for trying changes, but records the wrong pace.
4. Put `Geist-Variable.woff2` and `GeistMono-Variable.woff2` (from
   [vercel/geist-font](https://github.com/vercel/geist-font), OFL) in
   `scripts/demo-video/fonts/`.
5. `node scripts/demo-video/render.mjs` (needs ffmpeg) renders `index.html`
   frame by frame and writes the videos (H.264 and a VP9 fallback) and posters. `index.html?lang=zh&t=20`
   in a browser shows one frame.

If a fingerprint changes, the accepted finding in `repo/memory.json` stops
matching: run the review once, then `ocra memory add <id> --reason ...` in
`.demo/acme-api` and copy its `.ocra/memory.json` over `repo/memory.json`.
