import { expect, test } from "@playwright/test";

// How the landing page's islands and the manual's sidebar behave. The
// comparison job runs these tests against the base branch while it records
// its screenshots; only the change under test must pass them.
// biome-ignore lint/correctness/noEmptyPattern: Playwright reads the fixtures a hook needs from this pattern; it needs none
test.beforeEach(({}, testInfo) => {
  test.skip(
    ["all", "changed"].includes(testInfo.config.updateSnapshots),
    "recording the base branch",
  );
  test.skip(testInfo.project.name !== "desktop-light", "behaviour, not looks: one project");
});

test.describe("on a short screen", () => {
  test.use({ viewport: { width: 1280, height: 480 } });

  test("the manual's sidebar shows the page being read", async ({ page }) => {
    await page.goto("/docs/stability", { waitUntil: "networkidle" });
    const active = page.locator('#nd-sidebar a[data-active="true"][href="/docs/stability"]');
    await expect(active).toHaveCount(1);
    await expect(active).toBeInViewport();
  });
});

test("the logo does not prefetch the page it is on", async ({ page }) => {
  const prefetches: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.searchParams.has("_rsc")) prefetches.push(url.pathname);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  expect(prefetches.filter((path) => path === "/")).toEqual([]);
});

test("the theme toggle says whether the dark theme is on", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const toggle = page.locator(".nav [data-theme-toggle]");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
});
