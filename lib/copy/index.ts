import { exampleRun } from "@/lib/landing/example-run";
import { en } from "./en";
import type { Copy, CopySource } from "./types";
import { zh } from "./zh";

export type { BillRow, Copy, PlanId, StageKind, StepId } from "./types";

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

const resolved = {
  en: resolve(en) as Copy,
  zh: resolve(zh) as Copy,
} satisfies Record<string, Copy>;

export function getCopy(locale: string): Copy {
  return locale === "zh" ? resolved.zh : resolved.en;
}

export type { CopySource };
