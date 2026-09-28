---
version: alpha
name: Open-CR-Agent site
description: Dark, square-cornered, typography-led developer-tool site lit only by the frog's aquamarine. Near-black greens, 1px lines, no radii; a pixel field behind the hero and a giant OCRA wordmark at the foot.
colors:
  brand: "#7FFFD4"
  ink: "#0A0D0C"
  primary: "#0B7A5C"
  on-primary: "#FFFFFF"
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
  warning: "#D97706"
  code-comment: "#737373"
  code-keyword: "#7C3AED"
  code-string: "#0B7A5C"
  primary-dark: "#7FFFD4"
  on-primary-dark: "#04110C"
  accent-soft-dark: "#1A2F28"
  bg-dark: "#0A0D0C"
  bg-subtle-dark: "#0F1412"
  muted-dark: "#151B19"
  fg-dark: "#F1F6F4"
  fg-muted-dark: "#A9B5B0"
  fg-subtle-dark: "#7A8681"
  border-dark: "#1D2522"
  border-strong-dark: "#2A3431"
  panel-dark: "#0F1412"
  critical-dark: "#FF8F8F"
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
    fontSize: 4.25rem
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: -0.035em
  display-md:
    fontFamily: Geist
    fontSize: 3.25rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.035em
  display-sm:
    fontFamily: Geist
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: -0.03em
  display-zh:
    fontFamily: PingFang SC
    fontSize: 4rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  display-zh-sm:
    fontFamily: PingFang SC
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  headline:
    fontFamily: Geist
    fontSize: 3.5rem
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.035em
  headline-sm:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.03em
  headline-zh:
    fontFamily: PingFang SC
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.02em
  headline-zh-sm:
    fontFamily: PingFang SC
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  title:
    fontFamily: Geist
    fontSize: 1.375rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  lead:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
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
    lineHeight: 1.75
  mono-index:
    fontFamily: Geist Mono
    fontSize: 0.9375rem
    fontWeight: 500
    lineHeight: 1.2
  mono-label:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: 0px
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  gutter-sm: 32px
  content-max: 90rem
  text-max: 42rem
  section-y: 96px
  section-y-lg: 160px
  header-height: 64px
  control-height: 40px
  control-height-lg: 56px
  control-height-sm: 28px
  panel-bar-height: 44px
  figure-height: 300px
  marker: 1.25rem
components:
  page:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-dark}"
    typography: "{typography.body}"
  manual-page:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
  manual-secondary-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg-muted}"
  manual-quiet-text:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.fg-subtle}"
  manual-muted-surface:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.fg-muted}"
  manual-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
  manual-border:
    backgroundColor: "{colors.border}"
  manual-border-strong:
    backgroundColor: "{colors.border-strong}"
  manual-tag-verified:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
  manual-critical-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.critical}"
  manual-warning-text:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.warning}"
  manual-code-keyword:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-keyword}"
  manual-code-comment:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-comment}"
  manual-code-string:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.code-string}"
  secondary-text:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-muted-dark}"
    typography: "{typography.lead}"
  quiet-text:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-subtle-dark}"
    typography: "{typography.caption}"
  headline-muted:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-subtle-dark}"
    typography: "{typography.display}"
  link:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.primary-dark}"
  link-light:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.primary}"
  index:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.mono-index}"
  button:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary-dark}"
    rounded: "{rounded.none}"
    height: "{spacing.control-height}"
  button-lg:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-primary-dark}"
    rounded: "{rounded.none}"
    height: "{spacing.control-height-lg}"
  button-light:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-outline:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.fg-dark}"
    rounded: "{rounded.none}"
    height: "{spacing.control-height}"
  button-ghost:
    backgroundColor: "{colors.muted-dark}"
    textColor: "{colors.fg-dark}"
    rounded: "{rounded.none}"
  panel:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.fg-dark}"
    rounded: "{rounded.none}"
  panel-border:
    backgroundColor: "{colors.border-dark}"
  panel-bar:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.fg-subtle-dark}"
    typography: "{typography.mono-label}"
    height: "{spacing.panel-bar-height}"
  stage-figure:
    backgroundColor: "{colors.bg-subtle-dark}"
    textColor: "{colors.fg-dark}"
    typography: "{typography.mono-label}"
    height: "{spacing.figure-height}"
    rounded: "{rounded.none}"
  figure-line:
    backgroundColor: "{colors.border-strong-dark}"
  marker-brand:
    backgroundColor: "{colors.accent-soft-dark}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.mono-label}"
    size: "{spacing.marker}"
    rounded: "{rounded.none}"
  model-mark:
    backgroundColor: "{colors.bg-subtle-dark}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.full}"
  tag-critical:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.critical-dark}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.none}"
  tag-verified:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.primary-dark}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.none}"
  warning-text:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.warning-dark}"
  code-sample:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.code-keyword-dark}"
    typography: "{typography.mono}"
  code-string:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.primary-dark}"
  wordmark-band:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
  terminal:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-fg}"
    typography: "{typography.mono}"
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
  terminal-bar:
    backgroundColor: "{colors.term-bg}"
    textColor: "{colors.term-label}"
  terminal-border:
    backgroundColor: "{colors.term-border}"
  terminal-button-border:
    backgroundColor: "{colors.term-border-strong}"
---

# Open-CR-Agent site

`app/global.css` is the source of truth for values; this file mirrors it and says how to use them. Change a token in both, in the same commit. Content rules (what the site may claim) stay in `AGENTS.md`.

## Overview

The landing page and manual for a code review tool used by engineers. The landing page is **dark in both themes, square-cornered and typography-led**, lit only by the frog's aquamarine. It borrows the structure of trae.ai's landing page (a hero over a pixel field, a sideways row of numbered cards, two-tone headlines, a giant wordmark at the foot) but none of its copy, visuals or branding: the pixel field is a code minimap, the cards are ocra's pipeline, the wordmark and its letterforms are ours. It should still read like careful engineering documentation: concrete, calm, left-aligned, no hype.

The manual (Fumadocs) follows the system theme; in dark mode it uses the same tokens as the landing page.

## Colors

**Colour carries meaning, and the brand.**

- **Aquamarine (`brand`, #7FFFD4)** is the brand. On the dark landing page it is the accent itself: links, focus rings, "verified", numbered indices, primary buttons, and the wordmark band. In the light theme (the manual) it is too pale for text, so the accent there is `primary` (#0B7A5C, about 5:1 on white).
- **`ink` (#0A0D0C)** is the dark theme's page colour and the letters on the wordmark band. The dark neutrals lean slightly green towards it: `bg-subtle-dark` for figures and panels, `border-dark` / `border-strong-dark` for lines, `fg-dark` for text, `fg-muted-dark` for body copy, `fg-subtle-dark` for labels, captions and the muted half of a two-tone headline (5.2:1 on `bg-dark`, 4.9:1 on panels).
- **Review severities** (`critical`, `warning`) and diff lines are the only other colours. In the dark theme `critical` is the frog's cheek colour (#FF8F8F, 8.9:1).
- **Terminals** keep their own tokens (`--term-*`, defined once in `:root`); nothing on the landing page uses them today, the manual's code blocks may.
- The tokens are mapped onto Fumadocs' `--color-fd-*`. The mappings are declared again under `.dark`, because a custom property that points at another resolves where it is declared, and the landing page is a `.dark` subtree inside a page whose root may be light.

## Typography

Geist and Geist Mono (loaded with `next/font`); Chinese in the system faces (PingFang SC, Noto Sans SC) after Geist.

- The scale lives in `@theme` as `--text-*` tokens with their line height and tracking, used as utilities: `text-display` (hero, from the `wide` breakpoint, 85rem), `text-display-md`, `text-display-sm`, `text-headline` / `text-headline-sm` (section headings), `text-title` (card and tab titles), `text-lead` (the paragraph under a heading).
- `lib/cn.ts` registers the scale with `cn`; without that, `text-title` next to `text-fg` looks like two colours and the size is dropped.
- **Two-tone headlines:** the hero and the closing call to action set their first part in `fg-subtle` and the rest in `fg`, as two blocks.
- **Chinese headings get their own sizes** (`text-display-zh*`, `text-headline-zh*`) and explicit line breaks (`\n` in the copy, `whitespace-pre-line`); do not rely on automatic balancing for CJK. Chinese prose gets more leading (`:lang(zh) .prose`, 1.85).
- Mono for code, file names, stage names, bracketed indices (`[00]`) and the text inside figures.

## Layout

- Content sits in a `max-w-[90rem]` column with a 16px gutter (32px from `sm`), shared by header, sections and footer (`column` in `section.tsx`).
- Sections breathe: 96px vertical padding, 160px from `lg`. Rhythm comes from spacing and type, not from boxes around everything.
- The header is sticky, 64px, solid `bg`, with no border.
- The hero fills the first screen on large screens (at least 40rem): headline bottom left, the paragraph and buttons bottom right, the pixel field behind both. Below `lg` the field is a band above the text.
- "How it works" is a heading column and a row of four cards that bleeds to the right edge and scrolls sideways (scroll snap, arrows, and `[00]`–`[03]` buttons that light up for the cards in view).
- Must work at 390px wide without horizontal page scroll; wide code and the card row scroll inside themselves.

## Elevation & Depth

Flat. No shadows anywhere; surfaces are told apart by `bg-subtle` and 1px lines. There are exactly two background effects: the pixel field behind the hero (`public/hero-field.svg`, drawn by `scripts/hero-field.mjs`; regenerate it with `node scripts/hero-field.mjs`, never edit the SVG by hand) and the aquamarine wordmark band at the foot.

## Shapes

Square corners everywhere (`rounded.none`): buttons, panels, figures, tags, markers, the stage-group cards. The only round shapes are the "model" mark (a ring, next to the filled square for "code") and the frog.

## Components

- **Buttons:** `.btn` (the accent: aquamarine with ink text on the dark page), `.btn-outline` (1px foreground border), `.btn-ghost` (a faint foreground tint, for the header's GitHub link), `.btn-lg` (56px, hero and calls to action), `.btn-sm` (copy buttons).
- **`Panel`** (`components/ui/panel.tsx`) and `.panel` / `.panel-bar`: a bordered surface with an optional mono label bar.
- **Stage figures** (`stage-figures.tsx`): 300px-high illustrations of the example run, drawn in HTML with dashed lines, filled squares for work that runs and `skip` for work that does not. Identifiers (file names, tiers, reviewers, tool names, the findings) stay in English in both languages; the words around them come from the copy.
- **`.marker`** numbered squares (`.marker-brand` for callouts), **tags** `.severity-critical` and `.verified` (outlined, mono).
- **`Wordmark`** (`wordmark.tsx`, `lib/wordmark.ts`, `lib/glitch.ts`): see below.
- **Manual (MDX):** `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, registered in `components/mdx.tsx`. Register a component before the manual uses it, or the build fails.
- Copy lives in `lib/copy/` (`types.ts`, then `en.ts` and `zh.ts` with the same shape); components never hard-code strings, except identifiers and the example of ocra's own output.

## Mascot and wordmark

- **The frog** (`components/logo.tsx`, `app/icon.svg`): round head, two raised eyes looking down at the code, dark teal outline, coral cheeks. It may take its spirit from friendly beverage mascots but must never copy one. It is the logo mark, the favicon, the Apple icon, the avatar on the example comment and the mark in the footer.
- **The OCRA wordmark** closes every landing and 404 page: heavy geometric letters drawn for ocra, full width on the aquamarine band, sitting on its bottom edge. The O is the frog's eye, glancing ahead. The paths wind their counters the other way, so the default fill rule cuts them out.
- **The glitch:** moving the pointer over the band shifts horizontal slices of the letters sideways, pixelates some and darkens others; pressing and dragging makes it stronger; it settles within a second. A canvas over the static SVG draws only the disturbed slices, so the page reads the same without JavaScript, nothing runs while nothing moves, and reduced motion leaves the band still. Sizes scale with the band's width.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check 390px, 768px and desktop, reduced motion on and off, and the manual in both themes, before calling a change done.
- Do label examples of ocra output as examples and keep them technically correct.
- Don't use pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy.
- Don't add gradients, shadows, textures, rounded corners or new background effects; the pixel field and the wordmark band are the only two.
- Don't use colour for decoration beyond the brand's own places listed above.
- Don't write `text-[var(--token)]`; use the utility of the same name (`text-fg-muted`). Never hex values or Tailwind palette colours (`text-amber-300`) in components.

## Known issues

- `warning` (#D97706) is 3.2:1 on white, below AA for text. It is not used as text today; if it ever is, use #AA5D05 (4.7:1) in the light theme.

## Migration

1. **Done: tokens as utilities.** `@theme inline` in `app/global.css` registers every colour token as a Tailwind colour under its CSS variable's name.
2. **Done: terminal tokens.** `--term-*` in `:root`; the warn line uses the dark theme's `warning` (#FBBF24).
3. **Done (2026-09-28, the redesign): type scale and radii.** The landing page was rebuilt dark and square: the type scale became `--text-*` tokens, every radius became 0, the dark tokens moved to green-leaning neutrals, the 3D voxel frog and the animated pipeline walk-through were removed (three.js is no longer a dependency), and the pixel field and the wordmark were added. The old steps 3 (type scale) and 4 (radii) are covered by this.

## Verification

- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots** (`tests/visual/`, Playwright): `/` and `/zh`, the manual index (`Cards`), quickstart (`Steps`), installation (`Callout`) and the 404 page in each language; at 390, 768 and 1280px; light and dark. Every page also fails on console errors.
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`; the HTML report and diffs are under `.visual/results`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them, so nothing is committed and fonts render identically. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences; the job then passes and uploads the report.
- The harness takes screenshots with **reduced motion on**: otherwise `Reveal` keeps every section below the fold at opacity 0 until it scrolls into view. Reduced motion also keeps the wordmark still, so the band is the static SVG. `tests/visual/stable.css` pins the docs table of contents, whose active item follows the scroll position.
