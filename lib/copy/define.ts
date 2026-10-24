import type { Locale } from "@/lib/i18n";
import type { ExampleRun } from "@/lib/landing/example-run";

// Copy that quotes the recorded example run takes the run, so a new
// recording changes lib/landing/example-run.ts only. getCopy resolves these
// on the server: functions cannot be passed to client components.
export type FromRun = (run: ExampleRun) => string;

// A heading's explicit lines, one to three, set in one tone (<Lines>).
export type Lines =
  | readonly [string]
  | readonly [string, string]
  | readonly [string, string, string];

// One section's copy in every language, under one shape declared next to it.
export type Bilingual<T> = Record<Locale, T>;

// The copy as components receive it, with the run filled in.
export type Resolved<T> = T extends FromRun
  ? string
  : T extends readonly unknown[]
    ? { [K in keyof T]: Resolved<T[K]> }
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

// Replaces {name} placeholders: fill("{n} of 4", { n: 2 }) is "2 of 4". A
// placeholder without a value throws, so a renamed key fails the build.
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`fill: no value for {${key}} in "${template}"`);
    return String(value);
  });
}
