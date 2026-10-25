import { uiTranslations } from "@fumadocs/base-ui/i18n";
import type { BaseLayoutProps } from "@fumadocs/base-ui/layouts/shared";
import { Logo } from "@/components/logo";
import type { Copy } from "./copy";
import { i18n, type Locale } from "./i18n";
import { cloudUrl, localePath, repoUrl } from "./shared";
import { zhUi } from "./ui-zh";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({ en: { displayName: "English" }, zh: zhUi });

// The manual's chrome lies on the desk, like the landing page's nav over the
// hero, so it carries the same links (the landing page's sections, then the
// manual) and the light-on-dark spider.
export function baseOptions(locale: Locale, nav: Copy["nav"]): BaseLayoutProps {
  const home = localePath(locale, "/");
  const section = (id: string) => `${home}#${id}`;
  return {
    nav: {
      title: <Logo dark />,
      url: home,
    },
    links: [
      { text: nav.links.how, url: section("how") },
      { text: nav.links.product, url: section("product") },
      { text: nav.links.security, url: section("security") },
      { text: nav.links.pricing, url: section("plans") },
      { text: nav.links.docs, url: localePath(locale, "/docs"), active: "nested-url", on: "nav" },
      { text: nav.github, url: repoUrl, external: true },
      {
        type: "custom",
        on: "nav",
        children: (
          <a className="docs-cta" href={cloudUrl}>
            {nav.start}
          </a>
        ),
      },
    ],
  };
}
