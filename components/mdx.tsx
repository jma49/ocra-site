import { Cards, Card as FdCard } from "@fumadocs/base-ui/components/card";
import { Step, Steps } from "@fumadocs/base-ui/components/steps";
import { Tabs as FdTabs, Tab } from "@fumadocs/base-ui/components/tabs";
import defaultMdxComponents from "@fumadocs/base-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import { IndexCard } from "@/components/docs/index-card";
import type { Locale } from "@/lib/i18n";

// The manual is a printed sheet on the desk (app/docs.css): callouts and link
// cards are index cards lying on it, tabs a cooler printed panel.
function Card({ className, ...props }: ComponentProps<typeof FdCard>) {
  return <FdCard className={`docs-card docs-card-link ${className ?? ""}`} {...props} />;
}

function Tabs({ className, ...props }: ComponentProps<typeof FdTabs>) {
  return <FdTabs className={`docs-panel ${className ?? ""}`} {...props} />;
}

// The manual (written in the main repository) may use these components:
// Callout, Cards/Card, Steps/Step and Tabs/Tab.
export function getMDXComponents(locale: Locale, components?: MDXComponents) {
  function Callout(props: { type?: string; title?: ReactNode; children?: ReactNode }) {
    return <IndexCard locale={locale} {...props} />;
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
