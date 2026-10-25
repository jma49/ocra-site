import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The comparison job runs these tests against the base branch while it
// records its screenshots; only the change under test must pass them.
// biome-ignore lint/correctness/noEmptyPattern: Playwright reads the fixtures a hook needs from this pattern; it needs none
test.beforeEach(({}, testInfo) => {
  test.skip(
    ["all", "changed"].includes(testInfo.config.updateSnapshots),
    "recording the base branch",
  );
});

// axe on the landing page in both languages; the projects run it at every
// width in both colour schemes.
for (const path of ["/", "/zh"]) {
  test(`axe ${path}`, async ({ page }) => {
    // A full axe pass over a long page.
    test.setTimeout(90_000);
    await page.goto(path, { waitUntil: "networkidle" });
    // Measure the settled state, not a hover or a colour transition.
    await page.mouse.move(0, 0);
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => !(a instanceof CSSTransition)),
    );
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    ).toEqual([]);
  });
}

// The 404 page renders outside the site's layouts (app/global-not-found.tsx).
for (const path of ["/this-page-does-not-exist", "/zh/this-page-does-not-exist"]) {
  test(`axe ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map((v) => `${v.id} ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    ).toEqual([]);
  });
}

test("the menu closes on Escape and returns focus", async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 390, "the menu button is phone-only");
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.locator("button[aria-controls=site-menu]");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
});
