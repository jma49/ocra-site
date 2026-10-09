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

// next start says where an answer came from: `x-nextjs-cache: HIT` is the
// build's prerendered output, MISS a page rendered and cached on demand, and
// no header a page rendered on every request.
const fromBuild = (headers: Record<string, string>) => headers["x-nextjs-cache"] === "HIT";

for (const path of ["/", "/zh", "/docs", "/docs/quickstart", "/zh/docs/quickstart"]) {
  test(`${path} is served from the build`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(fromBuild(response.headers())).toBe(true);
  });
}

// Anyone can ask for any path, so a missing one must cost nothing: the 404
// page prerendered at build time, already a HIT on the first request. Each
// run asks for paths no earlier run has.
const missing: Record<string, (id: string) => string> = {
  "an unknown page": (id) => `/missing-${id}`,
  "an unknown page in Chinese": (id) => `/zh/missing-${id}`,
  "an unknown manual page": (id) => `/docs/missing-${id}`,
  "an unknown manual page in Chinese": (id) => `/zh/docs/missing-${id}`,
  "an unknown language": (id) => `/x${id}/docs`,
  "a path with a file extension": (id) => `/missing-${id}.php`,
  "a hidden file": (id) => `/.missing-${id}`,
};

for (const [name, path] of Object.entries(missing)) {
  test(`${name} gets the prerendered 404`, async ({ request }) => {
    const response = await request.get(path(crypto.randomUUID()), { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    expect(fromBuild(response.headers())).toBe(true);
  });
}

test("/favicon.ico is an icon", async ({ request }) => {
  const response = await request.get("/favicon.ico", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/x-icon");
});

// One static page answers for both languages; it reads the language from
// the path.
for (const [path, lang] of Object.entries({
  "/missing": "en",
  "/zh/missing": "zh-CN",
  "/missing.php": "en",
})) {
  test(`the 404 page at ${path} is in ${lang}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    const heading = page.locator("h1:visible");
    await expect(heading).toHaveCount(1);
    expect(await heading.evaluate((h) => h.closest("[lang]")?.getAttribute("lang"))).toBe(lang);
  });
}
