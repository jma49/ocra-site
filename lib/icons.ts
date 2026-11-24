import type { LoaderPlugin } from "fumadocs-core/source";
import * as lucide from "lucide-react";
import { createElement, type ReactNode } from "react";

const exported = lucide as unknown as Record<string, lucide.LucideIcon | undefined>;

// The manual names its icons by their Lucide names. Lucide keeps a renamed
// icon's old name (ShieldAlert, now ShieldExclamationPoint) as an export but
// drops it from its `icons` map, so the exports are the fallback.
export function lucideIcon(name: string): lucide.LucideIcon | undefined {
  return lucide.icons[name as keyof typeof lucide.icons] ?? exported[`${name}Icon`];
}

// The page tree's icons, from the names in the manual's front matter.
export function lucideIconsPlugin(): LoaderPlugin {
  function resolve<T extends { icon?: ReactNode }>(node: T): T {
    if (typeof node.icon !== "string") return node;
    const Icon = lucideIcon(node.icon);
    if (!Icon) throw new Error(`Unknown Lucide icon in the manual: ${node.icon}`);
    return { ...node, icon: createElement(Icon) };
  }
  return {
    name: "lucide-icons",
    transformPageTree: { file: resolve, folder: resolve, separator: resolve },
  };
}
