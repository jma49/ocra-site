import { expect, test } from "@playwright/test";

// The comparison job runs these tests against the base branch while it
// records its screenshots; only the change under test must pass them.
// biome-ignore lint/correctness/noEmptyPattern: Playwright reads the fixtures a hook needs from this pattern; it needs none
test.beforeEach(({}, testInfo) => {
  test.skip(
    ["all", "changed"].includes(testInfo.config.updateSnapshots),
    "recording the base branch",
  );
  test.skip(testInfo.project.name !== "desktop-light", "behaviour, not looks: one project");
});

// The dock shows between the hero and the plans, and reads the page right
// after jumps that skip whole sections (a nav link, Home), not only after
// scrolling through them.
test("the dock shows between the hero and the plans", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const dock = page.locator(".dock");
  const jump = (id: string) =>
    page.evaluate((target) => document.getElementById(target)?.scrollIntoView(), id);

  await expect(dock).toHaveAttribute("data-shown", "false");
  await jump("how");
  await expect(dock).toHaveAttribute("data-shown", "true");
  await jump("plans");
  await expect(dock).toHaveAttribute("data-shown", "false");
  await jump("final");
  await expect(dock).toHaveAttribute("data-shown", "false");
  await jump("security");
  await expect(dock).toHaveAttribute("data-shown", "true");
  await jump("hero");
  await expect(dock).toHaveAttribute("data-shown", "false");
});
