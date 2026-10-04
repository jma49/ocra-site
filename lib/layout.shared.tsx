import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { i18n } from "./i18n";
import { localePath, repoUrl } from "./shared";
import { zhUi } from "./ui-zh";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({ en: { displayName: "English" }, zh: zhUi });

const docsLabel: Record<string, string> = { en: "Docs", zh: "文档" };

// The manual's sidebar is dark glass, so its logo takes the light-on-dark spider.
export function baseOptions(
  locale: string,
  { dark = false }: { dark?: boolean } = {},
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
        text: docsLabel[locale] ?? "Docs",
        url: localePath(locale, "/docs"),
        active: "nested-url",
      },
    ],
  };
}
