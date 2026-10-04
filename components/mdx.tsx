import { Callout as FdCallout } from "fumadocs-ui/components/callout";
import { Cards, Card as FdCard } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tabs as FdTabs, Tab } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

// Panels in the manual are frosted glass (app/docs.css, `.glass`); cards also
// take the block hover.
function Callout({ className, ...props }: ComponentProps<typeof FdCallout>) {
  return <FdCallout className={`glass ${className ?? ""}`} {...props} />;
}

function Card({ className, ...props }: ComponentProps<typeof FdCard>) {
  return (
    <FdCard className={`glass block-hover ${className ?? ""}`} {...props} />
  );
}

function Tabs({ className, ...props }: ComponentProps<typeof FdTabs>) {
  return <FdTabs className={`glass ${className ?? ""}`} {...props} />;
}

// The manual (written in the main repository) may use these components:
// Callout, Cards/Card, Steps/Step and Tabs/Tab.
export function getMDXComponents(components?: MDXComponents) {
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
