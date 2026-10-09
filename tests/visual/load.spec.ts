import { expect, type Page, test } from "@playwright/test";

// What the landing page costs a visitor before they scroll. The comparison
// job runs these tests against the base branch while it records its
// screenshots; only the change under test must pass them.
// biome-ignore lint/correctness/noEmptyPattern: Playwright reads the fixtures a hook needs from this pattern; it needs none
test.beforeEach(({}, testInfo) => {
  test.skip(
    ["all", "changed"].includes(testInfo.config.updateSnapshots),
    "recording the base branch",
  );
  test.skip(testInfo.project.name !== "desktop-light", "behaviour, not looks: one project");
});

// Stands in for WebGPU. It counts how often the page asks for an adapter and
// answers that there is none, so the shader library itself never loads.
async function fakeWebGpu(page: Page, { saveData }: { saveData: boolean }) {
  await page.addInitScript((saveData) => {
    const counter = window as unknown as { adapterRequests: number };
    counter.adapterRequests = 0;
    Object.defineProperty(Navigator.prototype, "gpu", {
      configurable: true,
      get: () => ({
        requestAdapter: async () => {
          counter.adapterRequests += 1;
          return null;
        },
      }),
    });
    Object.defineProperty(Navigator.prototype, "connection", {
      configurable: true,
      get: () => ({ saveData }),
    });
  }, saveData);
}

const adapterRequests = (page: Page) =>
  page.evaluate(() => (window as unknown as { adapterRequests: number }).adapterRequests);

test("the silk waits until its section nears the viewport", async ({ page }) => {
  await fakeWebGpu(page, { saveData: false });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  expect(await adapterRequests(page)).toBe(0);

  await page.locator(".statement").scrollIntoViewIfNeeded();
  await expect.poll(() => adapterRequests(page)).toBeGreaterThan(0);
});

test("the silk keeps its CSS ground for a visitor saving data", async ({ page }) => {
  await fakeWebGpu(page, { saveData: true });
  await page.goto("/", { waitUntil: "networkidle" });
  for (const section of [".statement", ".final"]) {
    await page.locator(section).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(1500);
  expect(await adapterRequests(page)).toBe(0);
});
