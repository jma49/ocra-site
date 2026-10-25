import { expect, test } from "@playwright/test";

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

// The largest text on a phone is the lede. Text at opacity 0 does not count
// as painted, so an entrance that fades it in from 0 holds back the page's
// largest contentful paint until the fade starts.
test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero's copy is painted from the first frame", async ({ page }) => {
    await page.goto("/");
    const opacities = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          ".hero .hero-h .hli, .hero .hero-lede, .hero .hero-cta, .hero .hero-note",
        ),
      ].map((el) => {
        for (const animation of el.getAnimations()) {
          animation.pause();
          animation.currentTime = 0;
        }
        return getComputedStyle(el).opacity;
      }),
    );
    expect(opacities.length).toBeGreaterThan(3);
    expect(opacities.filter((opacity) => Number(opacity) === 0)).toEqual([]);
  });
});

// Preloads compete with the stylesheet and the first text for a slow link.
// Only Archivo, which sets every heading and paragraph, is worth that; the
// code face loads when code is on screen.
for (const path of ["/", "/docs/quickstart"]) {
  test(`${path} preloads one font`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const preloads = html.match(/<link[^>]+as="font"[^>]*>/g) ?? [];
    expect(preloads).toHaveLength(1);
  });
}

// The manual's stylesheet (Fumadocs' preset and its restyling, about 95 KB)
// blocks rendering; the landing page uses none of it.
test("the landing page does not load the manual's styles", async ({ page }) => {
  const sheets: string[] = [];
  page.on("response", async (response) => {
    if (response.request().resourceType() === "stylesheet") sheets.push(await response.text());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(sheets.length).toBeGreaterThan(0);
  expect(sheets.filter((css) => css.includes("#nd-sidebar")).length).toBe(0);
});
