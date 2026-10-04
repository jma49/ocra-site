---
version: alpha
name: Open-CR-Agent site
description: Ink, paper, aquamarine and pink. Poster type on Archivo's width axis, an original jumping spider printed off register, frosted glass panels.
colors:
  primary: "#0B7A5C"
  aqua: "#7FFFD4"
  aqua-ink: "#0B7A5C"
  pink: "#FF3D7F"
  night: "#0B0F0E"
  on-night: "#F4F2EA"
  paper: "#F7F6F1"
  paper-2: "#EFEDE6"
  card: "#FFFFFF"
  text: "#111A17"
  text-2: "#4A5550"
  text-3: "#626B66"
  line: "#E3E0D6"
  line-2: "#D2CEC2"
  red: "#B5301B"
  red-soft: "#F8E4DD"
  amber: "#A35A00"
  keyword: "#6B3FA0"
  paper-dark: "#0C100E"
  paper-2-dark: "#121815"
  card-dark: "#141A17"
  text-dark: "#ECF1EE"
  text-2-dark: "#A6B1AB"
  text-3-dark: "#7D8781"
  line-dark: "#222A26"
  line-2-dark: "#2E3833"
  red-dark: "#FF7A5C"
  red-soft-dark: "#2A1713"
  amber-dark: "#F2AD4B"
  keyword-dark: "#C9A7FF"
typography:
  poster:
    fontFamily: Archivo
    fontSize: 8.4rem
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: -0.012em
  poster-zh:
    fontFamily: PingFang SC
    fontSize: 6rem
    fontWeight: 900
    lineHeight: 1.1
  headline:
    fontFamily: Archivo
    fontSize: 3.6rem
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.028em
  title:
    fontFamily: Archivo
    fontSize: 1.45rem
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.018em
  statement:
    fontFamily: Archivo
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: -0.02em
  lead:
    fontFamily: Archivo
    fontSize: 1.15rem
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Archivo
    fontSize: 1.03rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Archivo
    fontSize: 0.81rem
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: Maple Mono
    fontSize: 0.78rem
    fontWeight: 400
    lineHeight: 1.9
rounded:
  tag: 5px
  control: 8px
  inner: 10px
  panel: 16px
  card: 18px
  plan: 20px
  pill: 9999px
spacing:
  gutter: 20px
  gutter-md: 40px
  content-max: 78rem
  chapter-y: 128px
  chapter-y-md: 176px
  control-height: 48px
  control-height-sm: 38px
components:
  page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.text-dark}"
  night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night}"
    typography: "{typography.poster}"
  secondary-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text-2}"
    typography: "{typography.lead}"
  secondary-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.text-2-dark}"
  quiet-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text-3}"
    typography: "{typography.caption}"
  quiet-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.text-3-dark}"
  link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.aqua-ink}"
  link-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.aqua}"
  button:
    backgroundColor: "{colors.text}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-height}"
  button-on-night:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
  button-brand:
    backgroundColor: "{colors.aqua}"
    textColor: "{colors.night}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  card-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.text-dark}"
  tag-critical:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red}"
    typography: "{typography.mono}"
    rounded: "{rounded.tag}"
  tag-critical-dark:
    backgroundColor: "{colors.red-soft-dark}"
    textColor: "{colors.red-dark}"
  code-on-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night}"
    typography: "{typography.mono}"
    rounded: "{rounded.inner}"
  code-keyword:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.keyword}"
  code-keyword-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.keyword-dark}"
  hover-plate:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.night}"
  panel-inner:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text}"
  panel-inner-dark:
    backgroundColor: "{colors.paper-2-dark}"
    textColor: "{colors.text-dark}"
  rule:
    backgroundColor: "{colors.line}"
    textColor: "{colors.text}"
  rule-strong:
    backgroundColor: "{colors.line-2}"
    textColor: "{colors.text-2}"
  rule-dark:
    backgroundColor: "{colors.line-dark}"
    textColor: "{colors.text-dark}"
  rule-strong-dark:
    backgroundColor: "{colors.line-2-dark}"
    textColor: "{colors.text-2-dark}"
  warning-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.amber}"
  warning-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.amber-dark}"
  verified:
    backgroundColor: "{colors.night}"
    textColor: "{colors.aqua}"
---

# Open-CR-Agent site

The landing page, the manual and the 404 page share one look: ink and paper, aquamarine and pink, poster type, an original jumping spider printed off register, frosted glass panels. It borrows the finish of modern developer-tool sites and the print style of a comic, never another product's devices (see Do's and Don'ts). Values live in CSS: `app/global.css` (shared tokens and the Fumadocs mapping), `app/landing/` (the landing page, split by section) and `app/docs.css` (the manual). This file mirrors them and says how to use them; change both in the same commit. Content rules (what the site may claim) stay in `AGENTS.md`.

## Colors

- **Ink and paper** carry the page. `night` is the hero, the final call to action, terminals and code blocks in both themes; `paper` (with a faint dot texture) is everything else. Text is `text`, `text-2` for body copy, `text-3` for labels.
- **Aquamarine** is the brand: the emphasised half of every headline, the spider's eyes, highlighter marks, links and "verified". On paper, text uses `aqua-ink` (about 5:1); on night and in the dark theme, `aqua` itself.
- **Pink** is the second plate of the print: off-register edges, the hover shadow, the spider's ghost, the flash. It never carries meaning on its own and is never body text.
- **Review severities** (`red` for critical, `amber` for warning) and diff lines are the only other colours.
- The dark theme swaps paper for `paper-dark`; night sections are the same in both themes.

## Typography

One family, **Archivo**, on its width axis, loaded with `next/font`; **Maple Mono** for every terminal, code sample, file name and label (maintainer's rule), from `@fontsource/maple-mono`. Chinese falls through to the system faces.

- **Poster** (hero and final call to action): black weight, 70% width, uppercase, 0.9 leading; the emphasised tail is aquamarine italic. Chinese posters use the system face at full width, 1.1 leading, no italic, and break explicitly before the emphasis.
- **Headline** (section headings): 800 weight, 86% width; the emphasised tail is italic with a thin aquamarine and pink offset. Headings that share a row with a paragraph (`split-head`) use the smaller step.
- **Title** (cards, steps, plans, questions): 700 weight, 92% width.
- **Statement**: the manifesto paragraph, 600 weight, 88% width.
- Headings balance; paragraphs use `text-wrap: pretty`.

## Layout

- Content sits in a 78rem column with a 20px gutter (40px from 768px). Chapters breathe: 128px vertical padding, 176px from 900px.
- Sections alternate centred posters (hero, final) with left-aligned editorial splits (heading left, paragraph right).
- Must work at 390px wide without horizontal page scroll; wide code scrolls inside its panel.

## Elevation, glass and texture

- **Frosted glass** for every window and panel: translucent white (dark glass in the dark theme), a 22px backdrop blur, a white hairline, an inner highlight and a soft long shadow. Surfaces inside a pane are translucent without a second blur.
- Glass needs something to blur: paper carries a faint dot texture, and the sections with panels have soft aquamarine and pink light behind them. In the dark theme the light is dimmer.
- **Night sections** carry two halftone screens off register (quiet in the middle where the text sits) and an orb web in two corners (`lib/landing/webs.ts`: a real orb, hub off the corner, radials ending on the walls, a sagging capture spiral, dew, one broken strand). The four webs differ in size, hub and radial count; no two corners mirror each other.
- The nav floats as dark glass in both themes; the manual's sidebar is the same dark glass.

## Shapes

Pills for buttons, tabs and segmented controls; 5px for tags; 8px for small controls; 10px for rows inside panels; 16px for windows and panels; 18px for cards; 20px for plans.

## Components

- **Mark** (`components/brand/spider-mark.tsx`, `app/icon.svg`): an original jumping spider, front view, chunky, front legs raised, two large aquamarine eyes, a halftone abdomen. Printed with an aquamarine and a pink plate off register and one displaced glitch slice. At 24px the slice drops; at 16px the plates drop and it prints in one ink. `SmallSpider` picks the step by size. On dark grounds the body lifts to `#1D2A26`.
- **Favicon and Apple icon**: the silhouette in paper with aquamarine eyes on a night tile.
- **Plated headline** (`plated-heading.tsx`): the poster headline on three plates; the text is never split, so it reads and wraps as one line.
- **Hanging spider** (`hanging-spider.tsx`): hangs on its thread over the hero window; click or Enter sends it up the thread, again brings it down, the thread follows. The big spider over the final call to action bursts on hover.
- **Product window** (`product-window.tsx`, `pr-pane.tsx`): the example pull request, terminal and ocra Cloud console behind tabs. The pull request replays the review when it scrolls into view; each finding ends with its suggestion as a plain `Suggestion:` line, the way ocra posts it (no committable suggestion: ocra does not post GitHub suggestion blocks).
- **Providers marquee** (`works.tsx`, `lib/landing/brand-icons.ts`): two rows of glass chips with single-colour 24px marks (LobeHub icons, MIT; Simple Icons, CC0), moving in opposite directions.
- **Manual (MDX)**: `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, registered in `components/mdx.tsx`, which gives the panels the `glass` class and cards the block hover. Register a component before the manual uses it, or the build fails.
- Copy lives in `lib/copy/` (`types.ts`, then `en.ts` and `zh.ts` with the same shape); components never hard-code strings except identifiers.

## Motion

- **One hover language**, everywhere: blocks (buttons, cards, plans, tiles, chips, tabs, small controls) lift 2px up-left and print a pink plate behind and an aquamarine one ahead; lines (links, table rows, code lines, file rows, questions, list items) get an aquamarine highlighter sweep from the left. Nothing else moves on hover.
- **What answers the pointer always runs**, smaller under Reduce motion: the plated headlines, the spider's burst and climb, the hover language, the replay and the fix in the hero window.
- **Idle loops stop under Reduce motion**: the spider's glitch and flash, the webs swaying, the spinner. The providers marquee is the exception: it drifts at half speed (the maintainer wants it visible) and pauses on hover.
- The headline plates settle into register on load; with Reduce motion they start in register.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check light and dark, 390px and desktop, Reduce motion on and off, before calling a change done.
- Do label examples of ocra output as examples and keep them technically correct.
- **Don't resemble a competitor's visual signature** (Greptile's halftone animals, for one): borrow finish, not devices. Before showing a design, name the product it could be mistaken for, and change direction rather than recolour.
- Don't use the pink as a text colour or to carry meaning.
- Don't use pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy.
- Don't put hex values in components; use the tokens in `app/landing/01-base.css` and `app/global.css`.

## Known issues

- Backdrop blur renders slightly differently in Safari; check the glass there when changing it.

## Verification

- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots** (`tests/visual/`, Playwright): `/` and `/zh`, the manual index (`Cards`), quickstart (`Steps`), installation (`Callout`) and the 404 page in each language; at 390, 768 and 1280px; light and dark. Every page also fails on console errors.
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences.
- The harness takes screenshots with Reduce motion on, which keeps the headlines in register, settles the hero window on its finished review and stops the idle loops. `tests/visual/stable.css` pins the docs table of contents and the providers marquee (which drifts even with Reduce motion on), and hides the hanging spider.
