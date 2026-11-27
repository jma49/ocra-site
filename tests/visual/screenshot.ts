import { expect, type Page, test } from "@playwright/test";

export async function compareScreenshot(
  page: Page,
  name: string,
  allowPixelChange = process.env.VISUAL_CHANGE === "true",
) {
  const info = test.info();
  const before = info.attachments.length;
  try {
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  } catch (error) {
    // An unstable capture can also produce a diff. Require Playwright's
    // stable-frame confirmation and the diff image; otherwise fail closed.
    if (
      !allowPixelChange ||
      !(error instanceof Error && error.message.includes("captured a stable screenshot")) ||
      !info.attachments
        .slice(before)
        .some((a) => a.contentType === "image/png" && a.name.endsWith("-diff.png"))
    ) {
      throw error;
    }
    info.annotations.push({ type: "visual-change", description: `${name} differs` });
  }
}
