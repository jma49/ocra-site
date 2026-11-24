import { Cards, Card as FdCard } from "@fumadocs/base-ui/components/card";
import { Step, Steps } from "@fumadocs/base-ui/components/steps";
import { Tabs as FdTabs, Tab } from "@fumadocs/base-ui/components/tabs";
import defaultMdxComponents from "@fumadocs/base-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { Note } from "@/components/docs/note";
import type { Locale } from "@/lib/i18n";
import { lucideIcon } from "@/lib/icons";

// The manual's components on the console's design (app/docs-prose.css).
// The manual names a card's icon by its Lucide name (`icon="Rocket"`), as
// its front matter does for the page tree.
function Card({ className, icon, ...props }: ComponentProps<typeof FdCard>) {
  const Icon = typeof icon === "string" ? lucideIcon(icon) : undefined;
  return (
    <FdCard
      className={`docs-link-card ${className ?? ""}`}
      icon={Icon ? <Icon strokeWidth={1.75} aria-hidden="true" /> : icon}
      {...props}
    />
  );
}

function Tabs({ className, ...props }: ComponentProps<typeof FdTabs>) {
  return <FdTabs className={`docs-tabs ${className ?? ""}`} {...props} />;
}

type CalloutProps = { type?: string; title?: ReactNode; children?: ReactNode };

const CALLOUTS: Record<Locale, (props: CalloutProps) => ReactNode> = {
  en: (props) => <Note locale="en" {...props} />,
  zh: (props) => <Note locale="zh" {...props} />,
};

// The manual (written in the main repository) may use these components:
// Callout, Cards/Card, Steps/Step and Tabs/Tab.
export function getMDXComponents(locale: Locale, components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout: CALLOUTS[locale],
    Card,
    Cards,
    Step,
    Steps,
    Tab,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
