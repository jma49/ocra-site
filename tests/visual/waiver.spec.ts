import { expect, test } from "@playwright/test";
import { compareScreenshot } from "./screenshot";

test("only a stable pixel difference can be waived", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop-light", "one project exercises the matcher");
  const name = "waiver-contract";
  await page.setContent("<main>before</main>");
  if (["all", "changed"].includes(info.config.updateSnapshots)) {
    await compareScreenshot(page, name, false);
    return;
  }

  await page.locator("main").evaluate((node) => {
    node.textContent = "after";
  });
  await expect(compareScreenshot(page, name, false)).rejects.toThrow();
  await compareScreenshot(page, name, true);
  expect(info.annotations).toContainEqual({
    type: "visual-change",
    description: `${name} differs`,
  });

  await page.close();
  await expect(compareScreenshot(page, name, true)).rejects.toThrow();
});
