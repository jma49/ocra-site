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

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the pipeline advances only while it is on screen", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const pipeline = page.locator(".pipe");
    await expect(pipeline).toHaveAttribute("data-running", "false");
    await pipeline.scrollIntoViewIfNeeded();
    await expect(pipeline).toHaveAttribute("data-running", "true");
  });

  test("the statement follows the scroll only near its paragraph", async ({ page }) => {
    await page.addInitScript(() => {
      const listening = new Set<unknown>();
      (window as unknown as { scrollListeners: Set<unknown> }).scrollListeners = listening;
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      window.addEventListener = ((type: string, listener: unknown, options?: unknown) => {
        if (type === "scroll") listening.add(listener);
        return add(type as "scroll", listener as EventListener, options as AddEventListenerOptions);
      }) as typeof window.addEventListener;
      window.removeEventListener = ((type: string, listener: unknown, options?: unknown) => {
        if (type === "scroll") listening.delete(listener);
        return remove(type as "scroll", listener as EventListener, options as EventListenerOptions);
      }) as typeof window.removeEventListener;
    });
    const listeners = () =>
      page.evaluate(
        () => (window as unknown as { scrollListeners: Set<unknown> }).scrollListeners.size,
      );
    await page.goto("/", { waitUntil: "networkidle" });
    expect(await listeners()).toBe(0);

    const paragraph = page.locator(".statement .scrub");
    await paragraph.scrollIntoViewIfNeeded();
    await expect.poll(listeners).toBe(1);
    const firstWord = paragraph.locator(".w").first();
    await page.mouse.wheel(0, 200);
    await expect.poll(() => firstWord.evaluate((w) => getComputedStyle(w).opacity)).toBe("1");
  });
});
