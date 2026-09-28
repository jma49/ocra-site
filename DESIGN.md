---
version: alpha
name: Open-CR-Agent site
description: Monochrome, typography-led developer-tool site. Neutral greys, 1px borders, soft shadows; aquamarine only where colour means something.
colors:
  primary: "#0B7A5C"
  on-primary: "#FFFFFF"
  brand: "#7FFFD4"
  ink: "#0C3B30"
  accent-soft: "#D6FFF1"
  bg: "#FFFFFF"
  bg-subtle: "#FAFAFA"
  muted: "#F4F4F5"
  fg: "#0A0A0A"
  fg-muted: "#525252"
  fg-subtle: "#737373"
  border: "#E5E5E5"
  border-strong: "#D4D4D4"
  panel: "#FFFFFF"
  critical: "#B91C1C"
  critical-soft: "#F8E8E8"
  warning: "#D97706"
  code-comment: "#737373"
  code-keyword: "#7C3AED"
  code-string: "#0B7A5C"
  primary-dark: "#7FFFD4"
  on-primary-dark: "#04110C"
  accent-soft-dark: "#1A2B27"
  bg-dark: "#09090B"
  bg-subtle-dark: "#0F0F11"
  muted-dark: "#18181B"
  fg-dark: "#FAFAFA"
  fg-muted-dark: "#A1A1AA"
  fg-subtle-dark: "#85858E"
  border-dark: "#27272A"
  border-strong-dark: "#3F3F46"
  panel-dark: "#0F0F11"
  critical-dark: "#F87171"
  critical-soft-dark: "#211315"
  warning-dark: "#FBBF24"
  code-keyword-dark: "#C4B5FD"
  term-bg: "#0A0A0A"
  term-fg: "#E2E2E2"
  term-dim: "#919191"
  term-strong: "#FFFFFF"
  term-label: "#85858E"
  term-border: "#27272A"
  term-border-strong: "#3F3F46"
  term-warn: "#FBBF24"
typography:
  display:
    fontFamily: Geist
    fontSize: 4rem
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.045em
  display-sm:
    fontFamily: Geist
    fontSize: 2.6rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.045em
  display-zh:
    fontFamily: PingFang SC
    fontSize: 3.3rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  display-zh-sm:
    fontFamily: PingFang SC
    fontSize: 2.3rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  headline:
    fontFamily: Geist
    fontSize: 2.4rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.03em
  headline-sm:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.03em
  title:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.015em
  lead:
    fontFamily: Geist
    fontSize: 1.05rem
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: Geist Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.65
  mono-label:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  mono-caption:
    fontFamily: Geist Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  gutter-sm: 32px
  content-max: 72rem
  text-max: 42rem
  section-y: 64px
  section-y-md: 96px
  control-height: 40px
  control-height-sm: 28px
  panel-bar-height: 40px
  marker: 1.3rem
components:
  wordmark-band:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
  page:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-dark}"
  secondary-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.lead}"
  secondary-text-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-muted-dark}"
  quiet-text:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.fg-subtle}"
    typography: "{typography.caption}"
  quiet-text-dark:
    backgroundColor: "{colors.bg-subtle-dark}"
    textColor: "{colors.fg-subtle-dark}"
  muted-surface:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.fg-muted}"
  muted-surface-dark:
    backgroundColor: "{colors.muted-dark}"
    textColor: "{colors.fg-muted-dark}"
  link:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.primary}"
  link-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.primary-dark}"
  button:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    height: "{spacing.control-height}"
  button-dark:
    backgroundColor: "{colors.fg-dark}"
    textColor: "{colors.bg-dark}"
  button-outline:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    height: "{spacing.control-height}"
  button-outline-hover:
    backgroundColor: "{colors.bg-subtle}"
  button-outline-border:
    backgroundColor: "{colors.border-strong}"
  button-outline-border-dark:
    backgroundColor: "{colors.border-strong-dark}"
  docs-primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  docs-primary-button-dark:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary-dark}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
  panel-dark:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.fg-dark}"
  panel-border:
    backgroundColor: "{colors.border}"
  panel-border-dark:
    backgroundColor: "{colors.border-dark}"
  panel-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg-subtle}"
    typography: "{typography.mono-label}"
    height: "{spacing.panel-bar-height}"
  terminal:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-fg}"
    typography: "{typography.mono}"
    rounded: "{rounded.lg}"
  terminal-dim:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-dim}"
  terminal-ok:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.brand}"
  terminal-warn:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-warn}"
  terminal-command:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-strong}"
  terminal-button-border:
    backgroundColor: "{colors.term-border-strong}"
  terminal-bar:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-label}"
  terminal-border:
    backgroundColor: "{colors.term-border}"
  marker:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg-muted}"
    typography: "{typography.mono-caption}"
    size: "{spacing.marker}"
    rounded: "{rounded.full}"
  marker-brand:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
  marker-brand-dark:
    backgroundColor: "{colors.accent-soft-dark}"
    textColor: "{colors.primary-dark}"
  tag-verified:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
  tag-verified-dark:
    backgroundColor: "{colors.accent-soft-dark}"
    textColor: "{colors.primary-dark}"
  tag-critical:
    backgroundColor: "{colors.critical-soft}"
    textColor: "{colors.critical}"
    typography: "{typography.caption}"
    rounded: "{rounded.xs}"
  tag-critical-dark:
    backgroundColor: "{colors.critical-soft-dark}"
    textColor: "{colors.critical-dark}"
  warning-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.warning}"
  warning-text-dark:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.warning-dark}"
  code-sample:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-keyword}"
    typography: "{typography.mono}"
  code-sample-dark:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.code-keyword-dark}"
  code-comment:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-comment}"
  code-string:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-string}"
---

# Open-CR-Agent site

`app/global.css` is the source of truth for values; this file mirrors it and says how to use them. Change a token in both, in the same commit. Content rules (what the site may claim) stay in `AGENTS.md`.

## Overview

The landing page and manual for a code review tool used by engineers. **Monochrome and typography-led**, in the manner of modern developer-tool sites but original: neutral greys, generous whitespace, 1px borders, 8–12px radii, very soft shadows. It should read like careful engineering documentation that happens to be well designed: concrete, calm, left-aligned, no hype.

## Colors

**Colour carries meaning only**, with one exception: the aquamarine wordmark band at the foot of the landing page.

- **Aquamarine (`brand`, #7FFFD4)** is the brand. In the light theme it is too pale for text, so links, focus rings and "verified" use `primary` (#0B7A5C, the same hue at about 5:1 on white; `--accent` in CSS). In the dark theme the accent is the brand itself. `ink` (#0C3B30, the frog's outline) is the wordmark's letters on the band, in both themes.
- **Review severities** (`critical`, `warning`) and diff lines are the only other colours.
- **Neutrals** do everything else: `fg` for text, `fg-muted` for body copy and descriptions, `fg-subtle` for labels and captions, `border` / `border-strong` for lines.
- **Terminals stay dark in both themes** and have their own tokens (`--term-*`, defined once in `:root` and not redefined under `.dark`; utilities `text-term-dim`, `text-term-warn`, `border-term-border-strong`, …). Their "ok" line is the brand; their "warn" line is `term-warn`, the dark theme's `warning` (#FBBF24). `term-fg` and `term-dim` are white at 88% and 55% in CSS; the hex values above are what they blend to on `term-bg`.
- The tokens are mapped onto Fumadocs' `--color-fd-*`, so the landing page and the manual share one system. The theme follows the system; light and dark must be equally polished.
- Dark values carry a `-dark` suffix here; in CSS the same variable switches under `.dark`.

## Typography

Geist and Geist Mono (loaded with `next/font`); Chinese in the system faces (PingFang SC, Noto Sans SC) after Geist.

- The scale lives in `@theme` as `--text-*` tokens carrying their line height and tracking, used as utilities: `text-display` / `text-display-sm` for the hero, `text-headline` / `text-headline-sm` for section headings (the `-sm` step below `sm`/`md`), `text-title` for card titles, `text-lead` for the paragraph under a heading. `lib/cn.ts` registers them with `cn`; without that, `text-lead` next to `text-fg-muted` looks like two colours and the size is dropped.
- Headlines are semibold with tight tracking in Latin text.
- **Chinese headings get their own sizes** (`display-zh`, `display-zh-sm`) and explicit line breaks; do not rely on automatic balancing for CJK. Tight tracking crowds CJK glyphs, so `display-zh` uses -0.02em and `:lang(zh)` resets the headline tracking to -0.01em with 1.3 leading, card titles to 0, and `lead` to 1.85 leading, like Chinese prose (`:lang(zh) .prose`).
- `lead` for the paragraph under a heading, `body` for everything else, `caption` for small print.
- Mono for code, commands, file names and numbered markers: `mono-label` in panel bars, `mono-caption` in markers and small annotations.
- Set a headline's line height with the `text-[size]/[leading]` form (or a `--text-*--line-height` token): `cn` (tailwind-merge) drops a separate `leading-*` next to an arbitrary text size.

## Layout

- Content sits in a `max-w-6xl` column with a 16px gutter (32px from `sm`). Section headers are at most `max-w-2xl`.
- Sections breathe: 64px vertical padding, 96px from `md`. Rhythm comes from spacing and type, not from boxes around everything.
- Prefer left-aligned editorial layouts; the hero is a two-column grid on large screens.
- Must work at 390px wide without horizontal page scroll; wide code scrolls inside its panel.

## Elevation & Depth

Flat by default. A `Panel` has a 1px border and a very soft shadow (`--panel-shadow`); nothing else casts a shadow. There are two background effects on the whole site: the soft aquamarine glow behind the 3D mascot at the top of the hero (`.hero-glow`) and the OCRA wordmark band that closes the landing page. The top nav on the home layout is the one translucent surface.

## Shapes

`rounded-md` (8px) for buttons, `rounded-lg` (12px) for panels and terminals, `rounded-full` for markers, 4px for tags and inline chips. No other radii.

## Components

- **`Panel`** (`components/ui/panel.tsx`): a bordered surface with an optional label bar for a file name or command; `dark` for terminals.
- **Buttons:** `.btn` (primary, foreground-coloured, not the accent) and `.btn-outline`; `.btn-sm` for small accessories like copy buttons.
- **`.marker`** numbered dots (`.marker-brand` for the highlighted step).
- **Tags:** `.severity-critical` and `.verified`.
- **Stage groups** (`stages.tsx`, `stage-figures.tsx`): "How it works" as one row that scrolls sideways as a whole: the heading first, lined up with the page column, then the four groups of stages running off the right edge of the page. The arrows and `[00]`–`[03]` buttons below stay put; the buttons light up for the cards in view. Each card has a 300px panel picturing the same example run: dashed lines, filled 2px-radius squares for work that runs, `skip` for work that does not. Identifiers (file names, tiers, reviewers, tool names, the findings) stay in English in both languages.
- **`Wordmark`** (`wordmark.tsx`, `lib/wordmark.ts`, `lib/ripple.ts`): see Mascot.
- **Manual (MDX):** `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, registered in `components/mdx.tsx`. Register a component before the manual uses it, or the build fails.
- Copy lives in `lib/copy/` (`types.ts`, then `en.ts` and `zh.ts` with the same shape); components never hard-code strings.

## Mascot

An original aquamarine frog reading code (`components/logo.tsx`, `app/icon.svg`): round head, two raised eyes looking down at the code, dark teal outline, coral cheeks. It may take its spirit from friendly beverage mascots but must never copy one (no Jinro toad shapes, colours or poses). It appears as the logo mark, the favicon and the Apple icon (on a light tile), and once on the landing page as a 3D voxel frog above the hero.

- The voxel frog (`components/landing/voxel-frog.tsx`, three.js, voxels generated in `lib/voxel-frog.ts`, not loaded from a model) spins in and settles, then turns slowly. Hovering turns it with the pointer, no click needed (crossing the frame is a full turn; height tilts slightly); touch turns it with a horizontal swipe and keeps vertical scrolling. No zoom or pan, so the frog never leaves its frame.
- Rendering pauses off screen; reduced motion skips the spin and the auto-rotation; a browser without WebGL gets the flat mark. three.js loads lazily through `frog-stage.tsx`. The effect follows the voxel mascot on craftz.dog; the model and code are our own.
- Outlines are a thick dark stroke under the fills. Inline SVGs use no `id` references (the layout renders the logo more than once).
- **The OCRA wordmark** closes the landing page: heavy geometric letters drawn for ocra, full width on an aquamarine band, in `ink` (the frog's outline colour), sitting on the band's bottom edge in both themes. The O is the frog's eye, glancing ahead. The paths wind their counters the other way, so the default fill rule cuts them out.
- **Its ripple:** moving the pointer over the band drops rings that spread outward like ripples on water and bend the letters as they pass, with a faint light and shadow on each crest; faster movement makes stronger rings, pressing drops a bigger one, and they fade within two seconds. A WebGL canvas over the static SVG draws the band only while rings are alive, so the page reads the same without JavaScript or WebGL, and nothing runs while nothing moves. The visitor makes every ripple, so it plays with reduced motion too (see Motion below). Sizes scale with the band's width.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check light and dark, 390px and desktop, reduced motion on and off, before calling a change done.
- **Motion:** motion the visitor makes plays whatever their motion setting: the wordmark ripple, the frog turning with the pointer, the stage row's arrows scrolling smoothly, a button pressing in. Motion that plays by itself respects reduced motion: the frog skips its spin and auto-rotation, the terminal caret stops blinking, and sections fade in without rising.
- Do label examples of ocra output as examples and keep them technically correct.
- Don't use pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy.
- Don't add gradients, textures, skeuomorphism or new background effects; the hero glow and the wordmark band are the only two.
- Don't use colour for decoration, or the accent for the primary button.
- Don't write `text-[var(--token)]`; use the utility of the same name (`text-fg-muted`). Never hex values or Tailwind palette colours (`text-amber-300`) in components.

## Known issues

- `warning` (#D97706) is 3.2:1 on white, below AA for text. It is not used as text today; if it ever is, use #AA5D05 (4.7:1) in the light theme.

## Migration

One step per pull request, each checked against baseline screenshots:

1. **Done: tokens as utilities.** `@theme inline` in `app/global.css` registers every colour token as a Tailwind colour under its CSS variable's name (`text-fg-muted`, `border-border`, `bg-bg-subtle`, `text-accent`, …); the 109 `text-[var(--fg-muted)]`-style classes are gone. No visual difference.
2. **Done: terminal tokens.** `--term-*` in `:root`, used by `.terminal`, `.panel-dark`, `terminal.tsx` and `get-started.tsx`; no hex values or palette colours are left in components. Decided 2026-09-27: the warn line uses the dark theme's `warning` (amber-400, `#FBBF24`, 11.9:1 on the terminal) rather than amber-300, so the site has one warning colour. That line is the only visual difference.
3. **Done (2026-09-28): type scale.** The tokens below are in `@theme` and registered with `cn`; the hero, section headings, the 404 heading, decisions and plugins use them, and Chinese headings and leads get their own tracking and leading through `:lang(zh)`. What was planned: add `--text-display`, `--text-display-sm`, `--text-display-zh`, `--text-display-zh-sm`, `--text-headline`, `--text-headline-sm`, `--text-lead` with their `--line-height` and `--letter-spacing` sub-properties, and use them in `hero.tsx`, `section.tsx`, `not-found-page.tsx`, `decisions.tsx`. Merge `1.08rem` into `lead` (1.05rem) and `11.5px` into `mono-caption`; `plugins.tsx`'s `0.95rem` becomes `body` or `lead`. Expected diff: the hero subtitle and those small labels shift slightly.
4. **Radii:** `rounded-[2px]` and `rounded-[4px]` → one 4px token.

## Verification

- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots** (`tests/visual/`, Playwright): `/` and `/zh`, the manual index (`Cards`), quickstart (`Steps`), installation (`Callout`) and the 404 page in each language; at 390, 768 and 1280px; light and dark. Every page also fails on console errors (a hydration error on every English docs page once shipped unnoticed).
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`; the HTML report and diffs are under `.visual/results`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them, so nothing is committed and fonts render identically. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences; the job then passes and uploads the report.
- The harness takes screenshots with **reduced motion on**, which stops the frog and the caret. `Reveal` keeps sections below the fold at opacity 0 until they scroll into view, so `tests/visual/stable.css` shows them for the screenshot; it also hides the voxel frog's contents (WebGL output differs between machines) and pins the docs table of contents, whose active item follows the scroll position.
