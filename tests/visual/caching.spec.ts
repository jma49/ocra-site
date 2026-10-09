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

const browserMaxAge = (headers: Record<string, string>) =>
  Number(/(?:^|[\s,])max-age=(\d+)/.exec(headers["cache-control"] ?? "")?.[1] ?? 0);

// The search index is fixed at build time: one prerendered file the CDN
// keeps, fetched once by the browser, instead of a function call per
// keystroke that rebuilds the index on a cold start.
test("the search index is served from the build", async ({ request }) => {
  const response = await request.get("/api/search", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["x-nextjs-cache"]).toBe("HIT");
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(browserMaxAge(response.headers())).toBeGreaterThan(0);
});

const searches = [
  { path: "/docs", query: "install", results: /^\/docs\// },
  { path: "/zh/docs", query: "安装", results: /^\/zh\/docs\// },
];

for (const { path, query, results } of searches) {
  test(`the manual's search at ${path} finds pages in its language`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.locator("button[data-search-full]").click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox").fill(query);
    const first = dialog.getByRole("option").first();
    await expect(first).toBeVisible();
    await first.click();
    await expect(page).toHaveURL((url) => results.test(url.pathname));
  });
}
