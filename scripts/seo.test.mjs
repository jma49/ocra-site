import assert from "node:assert/strict";
import { test } from "node:test";
import { loader } from "fumadocs-core/source";
import { docsPath, indexDocLanguages } from "../lib/doc-paths.ts";
import { i18n, languageAlternates } from "../lib/i18n.ts";

test("the manual advertises translations, not fallback pages", () => {
  const files = ["en/index.mdx", "zh/index.mdx", "zh/guide/setup.mdx", "en/cli.mdx"].map(
    (path) => ({
      type: "page",
      path,
      data: { title: path },
    }),
  );
  const manual = loader({ i18n, baseUrl: docsPath(), source: { files } });
  assert.equal(manual.getPage(["cli"], "zh").path, "en/cli.mdx");
  assert.deepEqual(Object.fromEntries(indexDocLanguages(i18n.languages, manual.getPages)), {
    "/docs": ["en", "zh"],
    "/docs/guide/setup": ["zh"],
    "/docs/cli": ["en"],
  });
});

test("hreflang uses public language tags; x-default needs an English version", () => {
  const url = (locale) => (locale === "en" ? "/" : "/zh");
  assert.deepEqual(languageAlternates(["en", "zh"], url), {
    en: "/",
    "zh-CN": "/zh",
    "x-default": "/",
  });
  assert.deepEqual(languageAlternates(["zh"], url), { "zh-CN": "/zh" });
  assert.deepEqual(languageAlternates(["en"], url), { en: "/", "x-default": "/" });
});
