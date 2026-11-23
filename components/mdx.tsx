import { Cards, Card as FdCard } from "@fumadocs/base-ui/components/card";
import { Step, Steps } from "@fumadocs/base-ui/components/steps";
import { Tabs as FdTabs, Tab } from "@fumadocs/base-ui/components/tabs";
import defaultMdxComponents from "@fumadocs/base-ui/mdx";
import { icons } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { Note } from "@/components/docs/note";
import type { Locale } from "@/lib/i18n";

// The manual's components on the console's design (app/docs-prose.css).
// The manual names a card's icon by its Lucide name (`icon="Rocket"`), as
// its front matter does for the page tree.
function Card({ className, icon, ...props }: ComponentProps<typeof FdCard>) {
  const Icon = typeof icon === "string" ? icons[icon as keyof typeof icons] : undefined;
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

// The manual (written in the main repository) may use these components:
// Callout, Cards/Card, Steps/Step and Tabs/Tab.
export function getMDXComponents(locale: Locale, components?: MDXComponents) {
  function Callout(props: { type?: string; title?: ReactNode; children?: ReactNode }) {
    return <Note locale={locale} {...props} />;
  }
  return {
    ...defaultMdxComponents,
    Callout,
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
