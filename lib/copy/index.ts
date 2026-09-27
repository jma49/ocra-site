import { en } from "./en";
import type { Copy } from "./types";
import { zh } from "./zh";

export type { Copy, StageKind } from "./types";

export function getCopy(locale: string): Copy {
  return locale === "zh" ? zh : en;
}
