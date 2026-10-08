---
version: alpha
name: Open-CR-Agent site
description: Ink, bone paper and one signal colour. Archivo set wide in two tones, a jumping spider's eye row for a mark, silk drawn on the GPU over the night.
colors:
  primary: "#0B7A5C"
  aqua: "#7FFFD4"
  aqua-ink: "#0B7A5C"
  silk: "#1E5C4B"
  night: "#090C0B"
  night-2: "#101513"
  night-3: "#161D1A"
  on-night: "#EDF1EC"
  on-night-2: "#B3C1BB"
  on-night-3: "#7F8D87"
  term-warn: "#FBBF24"
  paper: "#F4F3EE"
  paper-2: "#ECEAE3"
  card: "#FBFAF7"
  text: "#0E1412"
  text-2: "#49534E"
  text-3: "#66706B"
  line: "#E0DED5"
  line-2: "#CBC8BC"
  red: "#B5301B"
  red-soft: "#F6E2DB"
  amber: "#A35A00"
  keyword: "#6B3FA0"
  shadow-ink: "#0C1411"
  paper-dark: "#0B0F0D"
  paper-2-dark: "#111614"
  card-dark: "#131916"
  text-dark: "#EBF0EC"
  text-2-dark: "#A5B0AA"
  text-3-dark: "#7C8781"
  line-dark: "#1F2723"
  line-2-dark: "#2C3631"
  red-dark: "#FF7A5C"
  red-soft-dark: "#2A1713"
  amber-dark: "#F2AD4B"
  keyword-dark: "#C9A7FF"
typography:
  display:
    fontFamily: Archivo
    fontSize: 6.2rem
    fontWeight: 560
    lineHeight: 0.98
    letterSpacing: -0.048em
  display-zh:
    fontFamily: PingFang SC
    fontSize: 5.2rem
    fontWeight: 650
    lineHeight: 1.18
  headline:
    fontFamily: Archivo
    fontSize: 3.25rem
    fontWeight: 560
    lineHeight: 1.04
    letterSpacing: -0.038em
  title:
    fontFamily: Archivo
    fontSize: 1.35rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.022em
  statement:
    fontFamily: Archivo
    fontSize: 2.15rem
    fontWeight: 450
    lineHeight: 1.3
    letterSpacing: -0.022em
  lead:
    fontFamily: Archivo
    fontSize: 1.12rem
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
  chip: 6px
  control: 9px
  button: 10px
  inner: 12px
  window: 14px
  card: 16px
  plan: 18px
spacing:
  gutter: 20px
  gutter-md: 40px
  content-max: 76rem
  chapter-y: 112px
  chapter-y-md: 144px
  control-height: 46px
  control-height-sm: 36px
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
    typography: "{typography.display}"
  night-secondary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night-2}"
  night-quiet:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night-3}"
  night-emphasis:
    backgroundColor: "{colors.night}"
    textColor: "{colors.aqua}"
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
    rounded: "{rounded.button}"
    height: "{spacing.control-height}"
  button-brand:
    backgroundColor: "{colors.aqua}"
    textColor: "{colors.night}"
    rounded: "{rounded.button}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  card-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.text-dark}"
  panel-inner:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.text}"
  panel-inner-dark:
    backgroundColor: "{colors.paper-2-dark}"
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
  nav-drawer:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.on-night}"
  terminal-warning:
    backgroundColor: "{colors.night}"
    textColor: "{colors.term-warn}"
  silk-glow:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.on-night}"
  surface-raised:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night}"
  shadow:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.shadow-ink}"
---

# Open-CR-Agent site

The landing page, the manual and the 404 page share one look: ink and bone paper, one signal colour, Archivo set wide in two tones, a jumping spider's eye row for a mark, and silk drawn on the GPU over the night sections. The rule behind every choice is restraint: one effect per section, hairlines instead of glass on paper, nothing that moves unless it means something or answers the pointer. Values live in CSS: `app/tokens.css` (every colour, the elevation, the stacking scale and the Fumadocs mapping, light and dark: the only file with colour literals, checked by `scripts/check-colors.mjs`), `app/global.css` (shared rules, buttons, the logo), `app/landing/` (the landing page, split by section) and `app/docs.css` (the manual). This file mirrors them and says how to use them; change both in the same commit. Content rules (what the site may claim) stay in `AGENTS.md`.

## Colors

- **Ink and paper** carry the page. `night` is the hero, the statement band, the final call to action, terminals and code blocks in both themes; `paper` is everything else, plain, without texture. Text is `text`, `text-2` for body copy, `text-3` for labels and for the quiet half of a headline.
- **Aquamarine** is the one signal: the eyes of the mark, the emphasised half of a headline on the night, the primary button, links, "verified", the active pipeline stage. On paper, text uses `aqua-ink` (about 5:1); on night and in the dark theme, `aqua` itself.
- **Silk** (`silk`) is aquamarine's shadow side, used only by the shader scenes and their CSS ground.
- **Review severities** (`red` for critical, `amber` for warning) and diff lines are the only other colours. There is no second accent.
- The dark theme swaps paper for `paper-dark`; night sections are the same in both themes.

## Typography

One family, **Archivo**, on its width axis, loaded with `next/font`; **Maple Mono** for every terminal, code sample, file name and stage name (maintainer's rule), from `@fontsource/maple-mono`. Chinese falls through to the system faces.

- **Display** (hero and final call to action): 560 weight, 112% width, tight tracking, sentence case. The emphasised tail is aquamarine on the night. Chinese display lines use the system face, a smaller size so the longer line fits a phone, and break explicitly before the emphasis.
- **Headline** (section headings): 560 weight, 108% width, in two tones: the sentence in `text`, its tail in `text-3` (aquamarine on the night). No italics, no outlines, no offset prints.
- **Title** (cards, steps, plans, questions): 600 weight, 104% width.
- **Statement**: the manifesto paragraph on the night, 450 weight, words brightening as it scrolls.
- Headings balance; paragraphs use `text-wrap: pretty`.

## Layout

- Content sits in a 76rem column with a 20px gutter (40px from 768px). Chapters: 112px vertical padding, 144px from 900px.
- The page alternates night and paper: hero (night, the product window rising out of it onto the paper), platforms, pipeline, statement (night), features, lifecycle, security, plans, questions, final (night), footer.
- Headings that share a row with a paragraph use `split-head`: heading left, paragraph right, aligned to the bottom.
- The pipeline is one thread (`pipeline.tsx`): the four steps down a hairline, each on a node (a square where only code runs, a ring where a model is asked), with the picture of the step in focus in a framed panel beside them. The steps advance on their own (the thread fills in aquamarine over the dwell time) until the reader points at the section or picks a step; every step's text is always shown.
- Must work at 390px wide without horizontal page scroll; wide code scrolls inside its panel.

## Lines

Use lines where they say something, never as decoration (the maintainer: "善用, 不是一味的用"):

- The pipeline's thread: the order of the steps and how far a run has got.
- Grids of cards (features, plans) share their hairlines (`10-lines.css`), because the cards are parts of one whole.
- Rows of tables and lists.

No page rails, crosses, crop marks or rules between sections.

## Elevation and the night

- **Surfaces on paper** are hairlines first: grids share their lines (see Lines); the product window and the lifecycle thread are `card` with a 1px `line` hairline, and only the window keeps a long soft shadow. Panels inside a surface are inset on `paper` with a hairline and no shadow. There is no frosted glass on paper and no glow behind sections.
- **Ink glass** only where something moves behind it: the nav, the phone menu and the dock (`night-2` at about 90%, an 18px blur).
- **Reading light** (`components/landing/reading.tsx`): the hero's picture is the file ocra reviewed in the example run, the recorded demo repository's `src/auth/session.ts`, tilted and dim on the right of the night. A light that follows the pointer brings the code up to full brightness, and the line the finding quotes glows throughout with its severity beside it. The build fails if that file and the recording disagree on the quoted line. Hidden below 900px; the scanning beam stops under Reduce motion.
- **Silk** (`components/landing/silk.tsx`, `silk-scene.tsx`): the statement band and the final call to action carry a WebGPU scene from [Shaders](https://shaders.com) (MIT): a few pinned threads of light (`Strands`) that drift slowly and stretch under the pointer (`Liquify`), with a faint grain and a vignette. The threads lie low, clear of the text. The library loads only after a WebGPU adapter answers; until the scene has drawn, and in browsers without WebGPU, the CSS ground shows: the night with the silk's glow where the threads would be. Every `<Shader>` passes `disableTelemetry`: the library otherwise reports frame timings and the hostname to shaders.com.

## Shapes

10px for buttons; 6px for chips and stage names; 5px for tags; 9px for small controls and segmented tabs; 12px for insets; 14px for windows; 16px for cards; 18px for plans. No pills.

## Components

- **Mark** (`components/brand/eyes-mark.tsx`, `app/icon.svg`): a jumping spider's front eye row: two large eyes between two small ones, the large ones with a glint cut out. One even-odd path in `currentColor`, no ids, so it takes any colour from CSS and renders the same at 12px and 700px. Ink on paper, aquamarine on the night.
- **Logo** (`components/logo.tsx`): the mark beside the wordmark, 620 weight, 110% width.
- **Favicon and Apple icon**: the aquamarine eye row on a night tile. **Share card**: the same tile beside the wordmark.
- **Footer mark**: the eye row at 720px in `line`, cut off by the bottom of the page, peeking.
- **Living eyes** (`LookingEyes`): the eye row with pupils that turn towards the pointer and a blink every few seconds; in the nav logo on the night and, large with a soft aquamarine halo, over the final call to action.
- **Product window** (`product-window.tsx`, `pr-pane.tsx`): the example pull request, terminal and ocra Cloud console behind tabs. The pull request shows what ocra actually posts, as GitHub shows it: the summary comment and the inline comment from the engine's `render.ts`, posted by `github-actions` (the Action's identity), in the engine's English. No invented dashboards, progress tracks or banners. It replays when it scrolls into view: the check runs, then the comments arrive. The finding ends with a plain `Suggestion:` line because this recording's scripted model gives no structured fix; a committable suggestion block would need a new recording.
- **Providers marquee** (`works.tsx`, `lib/landing/brand-icons.ts`): two rows of chips with single-colour 20px marks (LobeHub icons, MIT; Simple Icons, CC0), moving in opposite directions.
- **Buttons** (`app/global.css`): `btn-brand` (aquamarine, the primary action), `btn-dark`, `btn-soft` (hairline on paper), `btn-ghost` (hairline on the night).
- **Manual (MDX)**: `Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`, registered in `components/mdx.tsx`, which gives panels the `glass` class (now a card on paper) and cards the block hover. Register a component before the manual uses it, or the build fails.
- Copy lives in `lib/copy/` (`types.ts`, then `en.ts` and `zh.ts` with the same shape); components never hard-code strings except identifiers.

## Motion

All of it lives in `09-motion.css` and one client island, `components/landing/motion.tsx`.

- **Entrance**: the hero headline rises word by word out of a blur, then the lede, the buttons and the note; the silk canvas settles in from a slight zoom once it has drawn.
- **Scroll**: the product window lies back in perspective and comes upright as it scrolls into view (CSS scroll-driven animation where supported); headings, cards, plans and panels rise in from a blur as they enter, staggered within their grid.
- **Pointer**: the silk stretches under it; a soft aquamarine light follows it across cards, steps, plans and the security panel; the eyes look at it; a sheen crosses the primary button on hover; surfaces rise 2px and their hairline darkens; links draw an underline.
- **Reduce motion**: entrance, scroll animations, reveals, the blink and the silk's drift are off; nothing is ever hidden waiting for a reveal (the page is hidden only after the script has run, and only without Reduce motion). What answers the pointer still runs. The providers marquee drifts at half speed (the maintainer wants it visible) and pauses on hover.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check light and dark, 390px and desktop, Reduce motion on and off, and a browser with and without WebGPU, before calling a change done.
- Do label examples of ocra output as examples and keep them technically correct.
- **Don't resemble a competitor's visual signature** (Greptile's halftone animals, CodeRabbit's orange): borrow finish, not devices. Before showing a design, name the product it could be mistaken for, and change direction rather than recolour.
- Don't add a second accent colour, gradient text, glow blobs behind sections, frosted glass on paper, dot textures, pill badges or uppercase eyebrow labels.
- Don't put a second shader effect in a section, or let the silk run behind body text.
- Don't write a colour literal outside `app/tokens.css`; name a token, and derive translucent variants with `color-mix(in srgb, var(--token) N%, transparent)`. The shader scenes read their colours from the tokens at run time. The standalone icons and the share card (`app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`) are the exception: they are images, rendered without the page's CSS.

## Known issues

- Headless Chromium's software GPU loses the WebGPU device; the silk falls back to its CSS ground there, which is what the screenshots record. To see the scene in an automated browser, launch Chromium with `--enable-unsafe-webgpu --headless=new --enable-gpu --ignore-gpu-blocklist`.

## Verification

- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots** (`tests/visual/`, Playwright): `/` and `/zh`, the manual index (`Cards`), quickstart (`Steps`), installation (`Callout`) and the 404 page in each language; at 390, 768 and 1280px; light and dark. Every page also fails on console errors.
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences.
- The harness takes screenshots with Reduce motion on, which settles the hero window on its finished review and stops the idle loops. `tests/visual/stable.css` pins the docs table of contents and the providers marquee (which drifts even with Reduce motion on), and hides the shader canvas so the CSS ground is recorded.
