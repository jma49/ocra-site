---
version: alpha
name: Open-CR-Agent site
description: Monochrome, typography-led developer-tool site. Neutral greys, 1px borders, soft shadows; aquamarine only where colour means something.
colors:
  primary: "#0B7A5C"
  on-primary: "#FFFFFF"
  brand: "#7FFFD4"
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
  term-label: "#85858E"
  term-border: "#27272A"
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
    lineHeight: 1.15
    letterSpacing: -0.045em
  display-zh-sm:
    fontFamily: PingFang SC
    fontSize: 2.3rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.045em
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
    textColor: "{colors.warning-dark}"
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

**Colour carries meaning only.**

- **Aquamarine (`brand`, #7FFFD4)** is the brand. In the light theme it is too pale for text, so links, focus rings and "verified" use `primary` (#0B7A5C, the same hue at about 5:1 on white; `--accent` in CSS). In the dark theme the accent is the brand itself.
- **Review severities** (`critical`, `warning`) and diff lines are the only other colours.
- **Neutrals** do everything else: `fg` for text, `fg-muted` for body copy and descriptions, `fg-subtle` for labels and captions, `border` / `border-strong` for lines.
- **Terminals stay dark in both themes** and have their own tokens (`term-*`). Their "ok" line is the brand, their "warn" line is the dark-theme `warning`.
- The tokens are mapped onto Fumadocs' `--color-fd-*`, so the landing page and the manual share one system. The theme follows the system; light and dark must be equally polished.
- Dark values carry a `-dark` suffix here; in CSS the same variable switches under `.dark`.

## Typography

Geist and Geist Mono (loaded with `next/font`); Chinese in the system faces (PingFang SC, Noto Sans SC) after Geist.

- Headlines are semibold with tight tracking. `display` for the hero, `headline` for section headings; each has a smaller step below the `sm`/`md` breakpoint (`-sm`).
- **Chinese headings get their own sizes** (`display-zh`, `display-zh-sm`) and explicit line breaks; do not rely on automatic balancing for CJK. Chinese prose gets more leading (`:lang(zh) .prose`, 1.85).
- `lead` for the paragraph under a heading, `body` for everything else, `caption` for small print.
- Mono for code, commands, file names and numbered markers: `mono-label` in panel bars, `mono-caption` in markers and small annotations.
- Set a headline's line height with the `text-[size]/[leading]` form (or a `--text-*--line-height` token): `cn` (tailwind-merge) drops a separate `leading-*` next to an arbitrary text size.

## Layout

- Content sits in a `max-w-6xl` column with a 16px gutter (32px from `sm`). Section headers are at most `max-w-2xl`.
- Sections breathe: 64px vertical padding, 96px from `md`. Rhythm comes from spacing and type, not from boxes around everything.
- Prefer left-aligned editorial layouts; the hero is a two-column grid on large screens.
- Must work at 390px wide without horizontal page scroll; wide code scrolls inside its panel.

## Elevation & Depth

Flat by default. A `Panel` has a 1px border and a very soft shadow (`--panel-shadow`); nothing else casts a shadow. The only background effect on the whole site is the soft aquamarine glow behind the 3D mascot at the top of the hero (`.hero-glow`). The top nav on the home layout is the one translucent surface.

## Shapes

`rounded-md` (8px) for buttons, `rounded-lg` (12px) for panels and terminals, `rounded-full` for markers, 4px for tags and inline chips. No other radii.

## Components

- **`Panel`** (`components/ui/panel.tsx`): a bordered surface with an optional label bar for a file name or command; `dark` for terminals.
- **Buttons:** `.btn` (primary, foreground-coloured, not the accent) and `.btn-outline`; `.btn-sm` for small accessories like copy buttons.
- **`.marker`** numbered dots (`.marker-brand` for the highlighted step).
- **Tags:** `.severity-critical` and `.verified`.
- **Manual (MDX):** `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, registered in `components/mdx.tsx`. Register a component before the manual uses it, or the build fails.
- Copy lives in `lib/copy/` (`types.ts`, then `en.ts` and `zh.ts` with the same shape); components never hard-code strings.

## Mascot

An original aquamarine frog reading code (`components/logo.tsx`, `app/icon.svg`): round head, two raised eyes looking down at the code, dark teal outline, coral cheeks. It may take its spirit from friendly beverage mascots but must never copy one (no Jinro toad shapes, colours or poses). It appears as the logo mark, the favicon and the Apple icon (on a light tile), and once on the landing page as a 3D voxel frog above the hero.

- The voxel frog (`components/landing/voxel-frog.tsx`, three.js, voxels generated in `lib/voxel-frog.ts`, not loaded from a model) spins in and settles, then turns slowly. Hovering turns it with the pointer, no click needed (crossing the frame is a full turn; height tilts slightly); touch turns it with a horizontal swipe and keeps vertical scrolling. No zoom or pan, so the frog never leaves its frame.
- Rendering pauses off screen; reduced motion skips the spin and the auto-rotation; a browser without WebGL gets the flat mark. three.js loads lazily through `frog-stage.tsx`. The effect follows the voxel mascot on craftz.dog; the model and code are our own.
- Outlines are a thick dark stroke under the fills. Inline SVGs use no `id` references (the layout renders the logo more than once).

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check light and dark, 390px and desktop, reduced motion on and off, before calling a change done.
- Do label examples of ocra output as examples and keep them technically correct.
- Don't use pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy.
- Don't add gradients, textures, skeuomorphism or new background effects; the hero glow is the only one.
- Don't use colour for decoration, or the accent for the primary button.
- Don't write `text-[var(--token)]` in new code once the tokens are registered as utilities (see Migration); never hex values or Tailwind palette colours (`text-amber-300`) in components.

## Known issues

- `warning` (#D97706) is 3.2:1 on white, below AA for text. It is not used as text today; if it ever is, use #AA5D05 (4.7:1) in the light theme.
- The terminal hard-codes its colours (`terminal.tsx`: `#7fffd4`, `text-amber-300`; `get-started.tsx`: `#3f3f46`, `#7fffd4`), and its warn line uses amber-300 rather than the dark-theme `warning` (amber-400) that terminals are meant to use.

## Migration

One step per pull request, each checked against baseline screenshots:

1. **Register the tokens as utilities** in `@theme inline` (`--color-fg: var(--fg)`, `--color-fg-muted`, `--color-fg-subtle`, `--color-bg`, `--color-bg-subtle`, `--color-border`, `--color-border-strong`, `--color-accent`, `--color-accent-soft`, `--color-brand`, `--color-panel`, `--color-critical`, `--color-warning`), keeping the same names as the CSS variables. Then replace the ~110 `text-[var(--fg-muted)]`-style classes with `text-fg-muted` etc. Expected visual diff: none.
2. **Terminal tokens:** add `--term-bg`, `--term-fg`, `--term-dim`, `--term-label`, `--term-border` to `:root` (same in both themes) and use them in `.terminal`, `.panel-dark`, `terminal.tsx` and `get-started.tsx`. Expected diff: the warn line moves from amber-300 to amber-400 (`#FBBF24`). Decided 2026-09-27: terminals are dark in both themes, so they take the dark theme's `warning`, which leaves one warning colour on the whole site; it is 11.9:1 on the terminal background.
3. **Type scale:** add `--text-display`, `--text-display-sm`, `--text-display-zh`, `--text-display-zh-sm`, `--text-headline`, `--text-headline-sm`, `--text-lead` with their `--line-height` and `--letter-spacing` sub-properties, and use them in `hero.tsx`, `section.tsx`, `not-found-page.tsx`, `decisions.tsx`. Merge `1.08rem` into `lead` (1.05rem) and `11.5px` into `mono-caption`; `plugins.tsx`'s `0.95rem` becomes `body` or `lead`. Expected diff: the hero subtitle and those small labels shift slightly.
4. **Radii:** `rounded-[2px]` and `rounded-[4px]` → one 4px token.

## Verification

- Lint this file: `npx @google/design.md lint DESIGN.md`.
- Baseline screenshots before a change, compared after: `/` and `/zh`, one manual page with `Steps`, `Cards`, `Tabs` and a `Callout` in each language, and the 404 page; at 390, 768 and 1280px; light and dark.
- Take them with **reduced motion on**. Otherwise `Reveal` keeps every section below the fold at opacity 0 until it is scrolled into view, so a full-page screenshot shows blank sections, and the voxel frog is mid-spin. Mask the frog's canvas as well: headless browsers without a GPU may get the flat fallback instead, which differs between machines. `npx playwright screenshot` cannot set reduced motion, so this needs a small Playwright script (`page.emulateMedia({ reducedMotion: "reduce", colorScheme })`).
- Check the browser console on every page as part of the same pass; a hydration error on every English docs page once shipped unnoticed.
