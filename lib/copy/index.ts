import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { en } from "./en";
import type { Copy, CopySource } from "./types";
import { zh } from "./zh";

export type {
  BillRow,
  Copy,
  FooterLinkId,
  PlanId,
  StepId,
} from "./types";

function resolve(value: unknown): unknown {
  if (typeof value === "function") return value(exampleRun);
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(item)]),
    );
  }
  return value;
}

const sources: Record<Locale, CopySource> = { en, zh };
const resolved = Object.fromEntries(
  Object.entries(sources).map(([locale, copy]) => [locale, resolve(copy)]),
) as Record<Locale, Copy>;

export function getCopy(locale: Locale): Copy {
  return resolved[locale];
}
