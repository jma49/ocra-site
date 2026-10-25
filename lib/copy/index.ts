import type { Locale } from "@/lib/i18n";
import { exampleRun } from "@/lib/landing/example-run";
import { type Bilingual, type Resolved, tieWords } from "./define";
import { announce, meta, nav, notFound } from "./sections/chrome";
import { faq } from "./sections/faq";
import { features } from "./sections/features";
import { final } from "./sections/final";
import { footer } from "./sections/footer";
import { hero, productWindow } from "./sections/hero";
import { how } from "./sections/how";
import { lifecycle } from "./sections/lifecycle";
import { plans } from "./sections/plans";
import { security } from "./sections/security";
import { statement } from "./sections/statement";
import { works } from "./sections/works";

// Every landing page string, one module per section with both languages side
// by side (lib/copy/sections). Code, file names, reviewer names and tool
// names are identifiers, not copy: they come from the recorded run.
const sources = {
  meta,
  announce,
  nav,
  notFound,
  hero,
  window: productWindow,
  works,
  how,
  statement,
  features,
  lifecycle,
  security,
  plans,
  faq,
  final,
  footer,
};

type Sources = typeof sources;
type CopySource = { [K in keyof Sources]: Sources[K] extends Bilingual<infer T> ? T : never };

// The copy as components receive it, with the run filled in. Components take
// Copy["<section>"]; islands take the smallest slice they need.
export type Copy = Resolved<CopySource>;

function resolve(value: unknown): unknown {
  if (typeof value === "function") return value(exampleRun);
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item)]));
  }
  return value;
}

// Every Chinese string on the page, once resolved, breaks only between
// words (tieWords). The <head> metadata is left as written.
function tie(value: unknown): unknown {
  if (typeof value === "string") return tieWords(value);
  if (Array.isArray(value)) return value.map(tie);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, tie(item)]));
  }
  return value;
}

function forLocale(locale: Locale): Copy {
  const copy = Object.fromEntries(
    Object.entries(sources).map(([key, source]) => {
      const value = resolve(source[locale]);
      return [key, locale === "zh" && key !== "meta" ? tie(value) : value];
    }),
  );
  return copy as Copy;
}

// Resolved once per language, at module load.
const resolved: Record<Locale, Copy> = { en: forLocale("en"), zh: forLocale("zh") };

export function getCopy(locale: Locale): Copy {
  return resolved[locale];
}
