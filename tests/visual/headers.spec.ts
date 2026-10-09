import { expect, type Page, test } from "@playwright/test";

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

const answers = {
  "the landing page": "/",
  "the Chinese landing page": "/zh",
  "a manual page": "/docs/quickstart",
  "the 404 page": "/missing",
  "the search API": "/api/search?query=review",
  "a JSON Schema": "/schema/config.v1.json",
};

for (const [name, path] of Object.entries(answers)) {
  test(`${name} cannot be framed or sniffed`, async ({ request }) => {
    const headers = (await request.get(path, { maxRedirects: 0 })).headers();
    const policy = headers["content-security-policy"] ?? "";
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).not.toContain("unsafe-eval");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
}

// The policy must not block anything the site itself does: every page type
// loads, hydrates and runs under it, and the manual's search fetches its
// results.
async function underPolicy(page: Page, path: string) {
  const violations: string[] = [];
  await page.exposeFunction("reportViolation", (v: string) => violations.push(v));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) =>
      (window as unknown as { reportViolation(v: string): void }).reportViolation(
        `${e.violatedDirective} ${e.blockedURI}`,
      ),
    );
  });
  page.on("console", (message) => {
    if (/Content Security Policy/i.test(message.text())) violations.push(message.text());
  });
  const response = await page.goto(path, { waitUntil: "networkidle" });
  expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
  return violations;
}

for (const path of ["/", "/zh", "/docs", "/zh/docs/quickstart", "/missing", "/zh/missing"]) {
  test(`${path} runs under the content security policy`, async ({ page }) => {
    const violations = await underPolicy(page, path);
    await page.evaluate(() => document.fonts.ready);
    expect(violations).toEqual([]);
  });
}

test("the manual's search runs under the content security policy", async ({ page }) => {
  const violations = await underPolicy(page, "/docs");
  await page.locator("button[data-search-full]").click();
  const results = page.waitForResponse((r) => r.url().includes("/api/search") && r.ok());
  const dialog = page.getByRole("dialog", { name: "Search" });
  await dialog.getByRole("combobox").fill("review");
  await results;
  await expect(dialog.getByRole("option").first()).toBeVisible();
  expect(violations).toEqual([]);
});
