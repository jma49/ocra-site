import { uiTranslations } from "@fumadocs/base-ui/i18n";
import type { BaseLayoutProps } from "@fumadocs/base-ui/layouts/shared";
import { ThemeToggle } from "@/components/landing/header-controls";
import { Logo } from "@/components/logo";
import type { Copy } from "./copy";
import { i18n, type Locale } from "./i18n";
import { cloudUrl, localePath, repoUrl } from "./shared";
import { zhUi } from "./ui-zh";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({ en: { displayName: "English" }, zh: zhUi });

// The manual's bar (components/docs/docs-header.tsx): the logo and the
// manual's name on the left; GitHub, sign in, the theme and the call to
// action on the right. The landing page's sections, and on a phone GitHub
// and sign in, sit in the page tree's drawer, with the call to action at
// its foot.
export function baseOptions(locale: Locale, nav: Copy["nav"]): BaseLayoutProps {
  const home = localePath(locale, "/");
  const section = (id: string) => `${home}#${id}`;
  const sections = [
    { text: nav.links.how, url: section("how") },
    { text: nav.links.product, url: section("product") },
    { text: nav.links.security, url: section("security") },
    { text: nav.links.pricing, url: section("plans") },
  ];
  return {
    nav: {
      title: <Logo />,
      url: home,
      children: (
        <a className="docs-crumb" href={localePath(locale, "/docs")} aria-current="page">
          {nav.links.docs}
        </a>
      ),
    },
    links: [
      ...sections.map((l) => ({ ...l, on: "menu" as const })),
      { text: nav.github, url: repoUrl, external: true },
      { text: nav.signIn, url: cloudUrl },
      {
        type: "custom",
        on: "nav",
        children: (
          <a className="btn btn-sm docs-cta" href={cloudUrl}>
            {nav.start}
          </a>
        ),
      },
    ],
    themeSwitch: { component: <ThemeToggle label={nav.theme} className="docs-ib" /> },
  };
}
