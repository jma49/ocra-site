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

// Chinese prose has no spaces, so the browser may break it between any two
// characters, inside a word (什 / 么) or before a particle (上 / 的). Ties
// with a word joiner (U+2060: invisible, skipped by screen readers and by
// find in page) make it break only between words: the characters of each
// word ICU's dictionary finds, 的, 地, 得, 了, 着 and 们 with the word before
// them, and a clause's last character with the one before it, so no line
// opens on one character and a stop (理。). A tie only removes a break, so a
// word the dictionary misses can still break as before, never worse. Lines
// still fill their measure (01-base.css), unlike keep-all, which breaks only
// at punctuation and spaces.
const TIE = "\u2060";
const HAN = /^\p{Script=Han}{2,}$/u;
const PARTICLE = /(?<=[\p{L}\p{N}])(?=[的地得了着们])/gu;
const CLAUSE_END = /(?<=\p{Script=Han})(?=\p{Script=Han}[。，、；：！？）」』”])/gu;
let words: Intl.Segmenter | undefined;
export function tieWords(text: string): string {
  words ??= new Intl.Segmenter("zh", { granularity: "word" });
  let out = "";
  for (const { segment } of words.segment(text)) {
    out += HAN.test(segment) ? [...segment].join(TIE) : segment;
  }
  return out.replace(PARTICLE, TIE).replace(CLAUSE_END, TIE);
}
