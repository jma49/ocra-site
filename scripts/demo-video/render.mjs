// Renders index.html frame by frame for each language and encodes the
// site's demo videos (H.264 and VP9) and posters into public/demo/. Needs
// ffmpeg with libx264, libvpx and libwebp.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const FPS = 30;
const POSTER_AT = 21.3;
const H264 =
  "-c:v libx264 -pix_fmt yuv420p -crf 24 -preset slow -tune animation -movflags +faststart -an";
const VP9 =
  "-c:v libvpx-vp9 -pix_fmt yuv420p -crf 34 -b:v 0 -row-mt 1 -threads 2 -deadline good -cpu-used 3 -an";
const POSTER = "-vf scale=1600:-1 -c:v libwebp -quality 80";
const ffmpeg = (...args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);

const browser = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
);
for (const lang of ["en", "zh"]) {
  const frames = join(root, ".demo", `frames-${lang}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1.5,
  });
  const url = pathToFileURL(join(here, "index.html"));
  url.search = `lang=${lang}`;
  await page.goto(url.href);
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.DURATION);
  const count = Math.round(duration * FPS);
  for (let i = 0; i < count; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    await page.screenshot({
      path: join(frames, `f-${String(i).padStart(5, "0")}.png`),
    });
  }
  await page.close();

  const out = join(root, "public/demo", `review-${lang}`);
  const frame = (i) => join(frames, `f-${String(i).padStart(5, "0")}.png`);
  const input = ["-framerate", String(FPS), "-i", join(frames, "f-%05d.png")];
  ffmpeg(...input, ...H264.split(" "), `${out}.mp4`);
  // For browsers without an H.264 decoder, such as some Linux builds.
  ffmpeg(...input, ...VP9.split(" "), `${out}.webm`);
  ffmpeg("-i", frame(Math.round(POSTER_AT * FPS)), ...POSTER.split(" "), `${out}.webp`);
  console.log(`${lang}: ${count} frames`);
}
await browser.close();
