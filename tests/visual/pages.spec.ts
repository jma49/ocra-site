import { expect, type Page, test } from "@playwright/test";

const pages = [
  { name: "home", path: "/" },
  { name: "docs", path: "/docs" },
  { name: "quickstart", path: "/docs/quickstart" },
  { name: "installation", path: "/docs/installation" },
  { name: "not-found", path: "/this-page-does-not-exist", missing: true },
];

const locales = [
  { code: "en", prefix: "" },
  { code: "zh", prefix: "/zh" },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

for (const locale of locales) {
  for (const target of pages) {
    test(`${locale.code} ${target.name}`, async ({ page }, testInfo) => {
      const errors = collectErrors(page);
      // A baseline run records the base branch as it is; only the change
      // under test must pass the checks below.
      const recordingBaseline = ["all", "changed"].includes(
        testInfo.config.updateSnapshots,
      );
      const url = `${locale.prefix}${target.path}`.replace(/\/$/, "") || "/";
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      // stable.css hides the frog by this selector; fail loudly if the 404
      // markup changes and the selector stops matching.
      if (target.missing && !recordingBaseline) {
        await expect(page.locator("[data-frog-stage] > div")).toHaveCount(1);
      }

      await expect(page).toHaveScreenshot(`${locale.code}-${target.name}.png`, {
        fullPage: true,
      });

      const expected = target.missing ? /status of 404/ : null;
      const unexpected = errors.filter((e) => !expected?.test(e));
      if (!recordingBaseline) expect(unexpected).toEqual([]);
    });
  }
}
