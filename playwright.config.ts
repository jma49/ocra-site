import { defineConfig, devices } from "@playwright/test";

// Screenshots compare two builds taken on the same machine (before and after
// a change, or the base branch and the pull request in CI), so baselines are
// never committed: fonts and rasterization differ between machines.
const port = Number(process.env.VISUAL_PORT ?? 3100);
const baseURL = process.env.VISUAL_BASE_URL ?? `http://127.0.0.1:${port}`;

const widths = { phone: 390, tablet: 768, desktop: 1280 };
const schemes = ["light", "dark"] as const;

export default defineConfig({
  testDir: "tests/visual",
  snapshotPathTemplate: ".visual/snapshots/{projectName}/{arg}{ext}",
  outputDir: ".visual/results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [
        ["list"],
        ["github"],
        ["html", { open: "never", outputFolder: ".visual/report" }],
      ]
    : [["list"]],
  expect: {
    toHaveScreenshot: {
      // Both sides render on the same machine, so pixels match exactly unless
      // something changed. The default threshold (0.2) let a token change
      // like amber-300 → amber-400 pass as "no difference".
      threshold: 0.02,
      maxDiffPixels: 20,
      animations: "disabled",
      caret: "hide",
      stylePath: "tests/visual/stable.css",
    },
  },
  use: {
    baseURL,
    reducedMotion: "reduce",
  },
  projects: Object.entries(widths).flatMap(([size, width]) =>
    schemes.map((colorScheme) => ({
      name: `${size}-${colorScheme}`,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        colorScheme,
      },
    })),
  ),
  webServer: process.env.VISUAL_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: baseURL,
        reuseExistingServer: true,
      },
});
