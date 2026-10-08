import { uiTranslations } from "@fumadocs/base-ui/i18n";
import type { BaseLayoutProps } from "@fumadocs/base-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { i18n, type Locale } from "./i18n";
import { localePath, repoUrl } from "./shared";
import { zhUi } from "./ui-zh";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({ en: { displayName: "English" }, zh: zhUi });

// The manual's sidebar is dark glass, so its logo takes the light-on-dark
// spider. `docs` is the nav label from the copy.
export function baseOptions(
  locale: Locale,
  { docs, dark = false }: { docs: string; dark?: boolean },
): BaseLayoutProps {
  return {
    nav: {
      title: <Logo dark={dark} />,
      url: localePath(locale, "/"),
      transparentMode: "top",
    },
    githubUrl: repoUrl,
    links: [
      {
        text: docs,
        url: localePath(locale, "/docs"),
        active: "nested-url",
      },
    ],
  };
}
