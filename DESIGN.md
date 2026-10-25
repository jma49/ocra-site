---
version: alpha
name: Open-CR-Agent site
description: Ink, neutral paper, a stone desk and one pen. A condensed Archivo display over normal-width text, Maple Mono for real data, a jumping spider's eye row for a mark, and a cinnabar pen that marks only where ocra acts on the reviewed change.
colors:
  primary: "#141414"
  signal: "#BD2718"
  paper: "#F7F7F7"
  paper-2: "#F1ECEC"
  stone: "#C3BBBB"
  sheet: "#FFFFFF"
  sheet-2: "#F2F2F2"
  night: "#261415"
  night-2: "#342021"
  ink: "#141414"
  ink-2: "#4A4A4A"
  ink-3: "#666666"
  line: "#E0E0E0"
  line-2: "#C4C4C4"
  on-night: "#F2F2F2"
  on-night-2: "#BABABA"
  on-night-3: "#969696"
  pen: "#BD2718"
  pen-night: "#FD545F"
  pen-wash: "#FBE6E2"
  amber: "#935508"
  white: "#FFFFFF"
  black: "#000000"
  paper-dark: "#121212"
  paper-2-dark: "#1B1717"
  stone-dark: "#211D1D"
  sheet-dark: "#232323"
  sheet-2-dark: "#2A2A2A"
  night-dark: "#352122"
  night-2-dark: "#3E2A2B"
  ink-dark: "#EDEDED"
  ink-2-dark: "#B4B4B4"
  ink-3-dark: "#969696"
  line-dark: "#2E2E2E"
  line-2-dark: "#404040"
  on-night-3-dark: "#A3A3A3"
  pen-dark: "#FD545F"
  pen-wash-dark: "#331B1A"
  amber-dark: "#EFAD48"
typography:
  display:
    fontFamily: Archivo
    fontSize: 9.25rem
    fontWeight: 520
    lineHeight: 0.84
    letterSpacing: -0.012em
  display-zh:
    fontFamily: PingFang SC
    fontSize: 9.25rem
    fontWeight: 600
    lineHeight: 1.04
  statement:
    fontFamily: Archivo
    fontSize: 10.5rem
    fontWeight: 520
    lineHeight: 0.86
    letterSpacing: -0.01em
  band:
    fontFamily: Archivo
    fontSize: 8.5rem
    fontWeight: 520
    lineHeight: 0.88
    letterSpacing: -0.01em
  final:
    fontFamily: Archivo
    fontSize: 7.375rem
    fontWeight: 520
    lineHeight: 0.88
    letterSpacing: -0.012em
  headline:
    fontFamily: Archivo
    fontSize: 4.75rem
    fontWeight: 520
    lineHeight: 0.94
    letterSpacing: -0.01em
  headline-zh:
    fontFamily: PingFang SC
    fontSize: 3.75rem
    fontWeight: 600
    lineHeight: 1.15
  headline-small:
    fontFamily: Archivo
    fontSize: 2.5rem
    fontWeight: 520
    lineHeight: 1.06
    letterSpacing: -0.012em
  title:
    fontFamily: Archivo
    fontSize: 1.75rem
    fontWeight: 520
    lineHeight: 1.12
    letterSpacing: -0.01em
  gauge:
    fontFamily: Archivo
    fontSize: 7.5rem
    fontWeight: 520
    lineHeight: 0.8
    letterSpacing: -0.02em
  figure:
    fontFamily: Archivo
    fontSize: 6.5rem
    fontWeight: 520
    lineHeight: 0.9
    letterSpacing: -0.01em
  verdict:
    fontFamily: Archivo
    fontSize: 2.5rem
    fontWeight: 520
    lineHeight: 1
  lead:
    fontFamily: Archivo
    fontSize: 1.1875rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.005em
  body:
    fontFamily: Archivo
    fontSize: 1.03125rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Archivo
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  note:
    fontFamily: Archivo
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.01em
  code:
    fontFamily: Maple Mono
    fontSize: 0.84375rem
    fontWeight: 400
    lineHeight: 1.75
  mono:
    fontFamily: Maple Mono
    fontSize: 0.78125rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  chip: 6px
  tab: 7px
  control: 10px
  sheet: 14px
  card: 16px
  band: 28px
spacing:
  gutter: 20px
  gutter-md: 32px
  gutter-lg: 40px
  content-max: 1280px
  section-y: 72px
  section-y-md: 104px
  section-y-lg: 120px
  control-height: 48px
  control-height-sm: 38px
components:
  page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-dark}"
  page-2:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
  page-2-dark:
    backgroundColor: "{colors.paper-2-dark}"
    textColor: "{colors.ink-dark}"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  sheet-dark:
    backgroundColor: "{colors.sheet-dark}"
    textColor: "{colors.ink-dark}"
  sheet-inset:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
  sheet-inset-dark:
    backgroundColor: "{colors.sheet-2-dark}"
    textColor: "{colors.ink-dark}"
  desk:
    backgroundColor: "{colors.stone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.band}"
  desk-dark:
    backgroundColor: "{colors.stone-dark}"
    textColor: "{colors.ink-dark}"
  desk-secondary:
    backgroundColor: "{colors.stone}"
    textColor: "{colors.ink-2}"
  desk-secondary-dark:
    backgroundColor: "{colors.stone-dark}"
    textColor: "{colors.ink-2-dark}"
  secondary-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    typography: "{typography.lead}"
  secondary-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-2-dark}"
  quiet-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
  quiet-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-3-dark}"
  quiet-text-band:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-3}"
  quiet-text-band-dark:
    backgroundColor: "{colors.paper-2-dark}"
    textColor: "{colors.ink-3-dark}"
  night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night}"
    typography: "{typography.statement}"
    rounded: "{rounded.band}"
  night-dark:
    backgroundColor: "{colors.night-dark}"
    textColor: "{colors.on-night}"
  night-secondary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night-2}"
  night-secondary-dark:
    backgroundColor: "{colors.night-dark}"
    textColor: "{colors.on-night-2}"
  night-quiet:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night-3}"
  night-quiet-dark:
    backgroundColor: "{colors.night-dark}"
    textColor: "{colors.on-night-3-dark}"
  night-raised:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.on-night}"
  night-raised-dark:
    backgroundColor: "{colors.night-2-dark}"
    textColor: "{colors.on-night}"
  pen-on-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.signal}"
    typography: "{typography.note}"
  pen-on-sheet-dark:
    backgroundColor: "{colors.sheet-dark}"
    textColor: "{colors.pen-dark}"
  pen-on-wash:
    backgroundColor: "{colors.pen-wash}"
    textColor: "{colors.pen}"
    typography: "{typography.code}"
  pen-on-wash-dark:
    backgroundColor: "{colors.pen-wash-dark}"
    textColor: "{colors.pen-dark}"
  pen-mark-night:
    backgroundColor: "{colors.night}"
    textColor: "{colors.pen-night}"
  pen-mark-night-dark:
    backgroundColor: "{colors.night-dark}"
    textColor: "{colors.pen-night}"
  warning-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.amber}"
  warning-text-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.amber-dark}"
  rule:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
  rule-dark:
    backgroundColor: "{colors.line-dark}"
    textColor: "{colors.ink-dark}"
  rule-strong:
    backgroundColor: "{colors.line-2}"
    textColor: "{colors.ink}"
  rule-strong-dark:
    backgroundColor: "{colors.line-2-dark}"
    textColor: "{colors.ink-dark}"
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
  button-dark:
    backgroundColor: "{colors.ink-dark}"
    textColor: "{colors.paper-dark}"
  button-on-night:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
  button-on-night-dark:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.night-dark}"
  shadow:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
---

# Open-CR-Agent site

The landing page, the manual and the 404 page share one look: ink on neutral paper, a stone desk under every product view, a condensed Archivo display over normal-width text, Maple Mono wherever a string is real data, a jumping spider's eye row for a mark, and one cinnabar pen. The idea is a careful reader marking up a change: the eye row reads first, the pen marks only where ocra acts on the reviewed change, the comment lands last. Values live in CSS: `app/tokens.css` (every colour, the shadow, the curves, the radii and the Fumadocs mapping, light and dark: the only file with colour literals, checked by `scripts/check-colors.mjs`), `app/global.css` (buttons, the logo, the living eyes; loaded by `app/site.css` for the landing and 404 pages and by `app/manual.css` for the manual), `app/landing/` (the landing page: shared files 01–05, then one or two files per section) and `app/docs.css` (the manual). This file mirrors them and says how to use them; change both in the same commit. Content rules (what the site may claim) stay in `AGENTS.md`.

## Colors

- **Ink and neutral paper** carry the page: `paper` is the page, `paper-2` the alternate band (how it works, lifecycle, FAQ), `ink` the text, `ink-2` body copy and ledes, `ink-3` captions, line numbers and meta. The page, the sheets, the inks and the lines are neutral (chroma 0): no ivory, no blue. The two mid-tones, `paper-2` and `stone`, carry a trace of the night's hue (OKLCH h 17, chroma under 0.01) at their neutral lightness, so every screen holds a little of ocra's own colour and no contrast changes.
- **Stone** is a concrete mid-tone with that trace of the night's hue: the desk under every product view (hero, story figures) and the security band. On stone, text is `ink` or `ink-2` only (`ink-3` and the pen fall under 4.5 : 1 there).
- **Sheets** (`sheet`, insets `sheet-2`) are the objects on a desk or a band: code, the thread, the gate tile, the Cloud plan row.
- **Night** (`night`, raised surface `night-2`; text `on-night`, `on-night-2`, `on-night-3`) is two inset bands: the statement and the final band with the footer.
- **The pen** (`pen`, cinnabar, OKLCH h 30 light / h 21 dark) is the one signal. It marks only where ocra acts on the reviewed change: a finding, a quote, an anchor, a strike through what was set aside, skipped, disproved, refused or out of scope, a tick for what was read or verified, the bottom line of a bill or verdict, ocra's verdict mark. **Never UI chrome** (navigation, tabs, progress, step numbers, the meter, plan states, selection, focus, links), never our own marketing claims. On night it is `pen-night` and draws marks only, never text. It never writes on stone: there it writes on a sheet laid on the stone. `pen-wash` sits only behind inserted code (`* 1000`): a red row would read as a deleted line.
- **Amber** is warning severity only. There is no second accent, no decorative gradient, no glow.
- **Dark** is designed, not inverted: lighter is higher (page `#121212` < band < desk < sheet < inset), each object carries its edge (the desk an inset 6 % white ring, sheets the `--float` ring), and the night bands are raised slabs (`#262626`) with no ring. Every text pair is at least 4.5 : 1 in both themes (the components above).
- **The manual** maps Fumadocs to the same tokens: primary, ring and links are ink; the sidebar is night glass with its active link `on-night`, a tint and a 2 px bar; `--color-fd-error` is the pen (critical callouts only) and `--color-fd-warning` amber.

## Typography

One family, **Archivo**, in two widths (`next/font`, the only preloaded face, `display: swap`): a **condensed display** (one weight, 520, at 62–82 % width) for headings and figures, and **normal-width text** for everything else. **Maple Mono** (`@fontsource/maple-mono`, cut down to the characters the site uses and renamed as its licence requires: `scripts/subset-mono.py`, `assets/fonts/`; `npm run check:glyphs` fails on a dropped character) sets only real data: code, paths, stage names, tool names, task ids, tokens, dollars, flags. A paraphrase is never set in Maple. Chinese falls through to the system faces at weight 600.

- **Display** `.t-display` (the H1): one line across the container from 1024 px (`min(9.25rem, 11.6cqi)`, 148 px at 1440), two lines below. `.t-statement`, `.t-band`, `.t-final`: the two night bands' and the security band's headings, at 62 %. `.t-h2` (68 %), `.t-h2s` (82 %, works), `.t-h3` (82 %), `.t-h4` (100 %, 560). Figures: `.t-gauge` (the 45), `.t-figure` (`L42`, `$0.5134`, prices), `.t-verdict`, `.t-struck`.
- **Text**: `.t-lede`, `.t-body`, `.t-statement-body`, `.t-small`, `.t-kicker` (how it works and lifecycle only), `.t-note` (the pen's words), `.t-mono`; code rows at 13.5 / 13 / 11.5 / 10.5 px, always line-height 1.75.
- Headings are explicit lines in one tone (`<Lines>`): one block per line, joined with a space in English and nothing in Chinese. No two-tone headings, no italics, no uppercase, no positive tracking above 13 px; sentence case; balanced headings, pretty paragraphs; tabular numerals on figures and ledgers.
- **Fallback**: until Archivo arrives, display lines use "Ocra Narrow", a local narrow face (`size-adjust` tuned to within 6 % of Archivo's width), not the Arial-based fallback; every display line is clipped at its container, never painted over a neighbour.
- **Arrows**: `→` is not in Archivo's latin subset, so Archivo text uses `<ArrowGlyph />`; Maple text keeps the character.
- **Chinese**: its own sizes and explicit breaks (`先读懂，再开口。` one line from 1024 px); engine output (the terminal, the GitHub comment, claim titles, task ids) stays English, with a gloss outside the chrome.

## Layout

- `.wrap`: 1280 px of content with a 40 px gutter (32 px from 600 to 1023, 20 px below). 12 columns, gap 56 px from 1200, 40 px from 1024, 32 tablet, 20 phone; every track `minmax(0, 1fr)`.
- **One desktop breakpoint, 1200 px**, for every split; 1024–1199 has its own one-column layouts, never a squeezed split.
- Section padding 120 px from 1200, 104 from 600, 72 below; the bands 128 / 104 / 72. Anchors land 84 px below the top (`scroll-margin-top`), clear of the sticky nav.
- Order and grounds: announce and nav, hero (paper, stone desk), works (paper), how it works (paper-2), quiet by design (night band), features (paper), lifecycle (paper-2), security (stone band), plans (paper), FAQ (paper-2), final (night band) and the footer that continues it. Every section has its own head and composition (`sections.md`); kickers only where the H2 does not say it.
- Page length: desktop 1440 ≤ 10,500 px, tablet ≤ 12,500, phone ≤ 13,000. Must work at 360 px without horizontal page scroll; wide code scrolls inside its panel.

## Grounds and hairlines

- Every `<section>` carries `data-ground` (`paper`, `paper-2`, `stone`, `night`); the nav reads it and takes that ground's fill and text.
- **Bands** (stone, night) are inset: 12 px from the page's edges (8 px on phones), radius 28 (20), no ring in either theme. The final band rounds only its top corners and the footer only its bottom ones, so they read as one night sheet.
- **Hairlines only inside objects**: rows of a ledger or list, between a sheet bar and its body, around a flat sheet on paper (an inset 1 px `line`, so hover can darken it without moving anything). Never a ring round a whole section; no rails, crosses, dashed or chamfered borders, textures, grain, photos or shaders.

## Elevation

One shadow, `--float`, only for sheets on a desk, the lifecycle thread, the gate tile, the nav drawer and a platform tile under the pointer; in dark it carries its own 6 % white ring. Everything else is flat. The nav is frosted on every ground (90 % of the ground under a 20 px blur). The open phone drawer lies over a frosted scrim (`paper` at 60 %, 6 px blur) that closes it on a tap; the page under it is inert and the bar drops its call to action, which the drawer repeats.

## Shapes

Concentric radii: chips 6 px, tabs 7 px (inside a 3 px padded tablist), controls 10 px (buttons, tablists, the comment), sheets 14 px (the final band's install sheet included, its Copy button 10 px inside 4 px), cards 16 px (gate tiles), desks and bands 28 px (desk = sheet + 14 px padding). Phones: desks and bands 20 px with 8 px padding, sheets 12 px. The nav bar 12 px. No pills; GitHub's own "bot" label is the only rounded-full shape.

## Components

- **Mark** (`components/brand/eyes-mark.tsx`): a jumping spider's front eye row, one even-odd path in `currentColor`. The logo (`components/logo.tsx`) sets it beside the wordmark (Archivo 540 at `--wordmark-stretch`, 78 %). `LookingEyes` is the living version: in the hero's code rail as the reader (ink eyes, the glint as pupil), and at 560 px in the final band, following the pointer.
- **Icons**: white eyes with night pupils on the night tile (`app/icon.svg`, `apple-icon.tsx`, `opengraph-image.tsx`, `favicon.ico`).
- **Primitives** (`components/landing/`): `Section`, `Lines`, `Kicker`, `ArrowGlyph`, `withCode` (`section.tsx`); `CodeRows` and `InkCode` (`code.tsx`: recorded lines read at build time, reader rail, ink overlay, folds, custom rows); `Comment` and `BotAvatar` (`comment.tsx`); `CodeMark` (`pen/code-mark.tsx`); `Marked`, `Band`, `Note`, `Tick`, `Bar`, `Ringed`, `Arrow`, `KeyGlyph` (`pen/marks.tsx`); `tabPattern` and `inactive` (`tabs.ts`).
- **The pen** draws server-rendered SVG strokes from `lib/landing/pen.ts` (pure geometry, one hand): underline, double underline, strike, ring, caret, box, arrow, tick, margin bar, the verdict mark (a pen dot for 🔴, an octagon for 🛑). Underlines and strikes draw by a left-to-right wipe with a non-scaling stroke; rings, carets, boxes, arrows and ticks by dash in uniformly scaled units. Every mark is `aria-hidden` and has a text equivalent.
- **Buttons** (`app/global.css`): `.btn` 48 px (`.btn-sm` 38, 44 on phones), `.btn-primary` (ink; on night, on-night), `.btn-quiet` (a `line-2` ring). Under a pointer a button gives to `scale(.98)` over 200 ms and its arrow leans 3 px; pressed, `scale(.96)` (touch: `.98`). No lift, no shadow, no sheen.
- **Sheets and desks**: a sheet (`.sheet`, radius 14, a 42 px `sheet-2` bar) lies on a stone desk (`.desk`, radius 28, 14 px padding) with `--float`, or flat on paper with an inset `line` ring. Chips: stage chips (mono, a kind shape: filled square = code, ring = model), the **Example run** chip (Archivo, a hollow ring, pointing at the nearest example caption) and the **Illustration** chip (on the lifecycle thread and the bill's fallback line).
- **Stacked variants**: tab panels, lifecycle states, story figures, the terminal's text and the Copy label share one grid cell sized by the tallest; an inactive one is `inert` and hidden, never transparent alone, so switching never moves the page.
- **Islands** (the only client code): `header-controls.tsx` (menu, theme, the nav following the ground, the CTA's promotion), `hero/window-tabs.tsx`, `hero/review-clock.tsx`, `how/story.tsx`, `lifecycle/lifecycle-states.tsx`, `marquee-pause.tsx`, `copy-command.tsx`, `faq-phones.tsx` and `motion.tsx`. Sections render on the server and pass their islands server-rendered children and small copy slices.
- **Copy** lives in `lib/copy/sections/`, one module per section with English and Chinese side by side; `lib/copy/index.ts` resolves the example run into it. Numbers, paths, lines and titles come from `lib/landing/example-run.ts`, which `lib/landing/recorded.ts` checks against the recording at build time.

## Motion

- No animation library. CSS transitions and keyframes, scroll-driven animations behind `@supports`, IntersectionObserver, the Web Animations API, and small islands. No window scroll listener (the phone menu's close-on-scroll exists only while it is open).
- **Gating**: the root layout's inline script adds `html.mo` before the first paint when motion is allowed; every pre-play state is written under `@media (prefers-reduced-motion: no-preference) { html.mo … }`. `components/landing/motion.tsx` adds `html.hy`; without it the script drops `mo` after 4 s. Without JavaScript, under Reduce motion or after that fail-safe, the page shows every finished state.
- **Load**: the H1, lede, CTAs and note rise 10–12 px (560 ms) and the desk settles (640 ms); text is painted from the first frame and nothing blurs or fades in.
- **The hero theatre** (`hero/review-clock.tsx`, `13-hero-run.css`): CSS animations the clock owns through the Web Animations API. It plays once the code is 60 % in view, the entrance has settled, the code face is in and the Pull request tab is selected: the reader's eyes read lines 16, 21 and 40–43 and park on 42, the margin bar grows from them, the pen underlines the two units and carets the fix, then the comment and the summary row land. It pauses when the code is partly out of view, behind the Terminal tab or in a hidden tab, and finishes at once when the reader has scrolled past the code; Replay rewinds it.
- **The story** (`how/story.tsx`): pinned from 1200 × 760 px with motion; an observer on a line at the viewport's middle picks the step, the figure's body swaps (only during a swap: a viewport change never leaves bodies half faded) and its marks draw. Unpinned, each figure plays once when 40 % visible.
- **Draw on entry**, once: the bill's double underline. The quiet band's struck words follow the scroll both ways through a view timeline (drawn at 50 % visibility where scroll timelines are missing). The lifecycle's states autoplay every 5.2 s only while the thread is 40 % visible and not held; a tab click stops it; Fixed strikes line 42.
- **The pen's two modes** (`04-pen.css`): `data-pen="clock"` plays CSS animations a clock island owns (the hero); `data-pen="on"` plays transitions when the root gains `.on` (story figures, the lifecycle's Fixed state, `data-pen-once` roots). Static marks (the gate, the fallback line, legends) carry neither.
- **The final eyes** follow the pointer only while the band is within a viewport of the screen and blink only in view; on touch screens they glance round now and then; the manual's logo keeps its own blink.
- Curves: `--e-enter`, `--e-std`, `--e-pop`, linear for scrubbed animations and the marquee, `steps(n)` for typing only. Nothing reveals on scroll; only recorded events draw on entry.
- **Pointer feedback** (`@media (hover: hover)`, never moving layout): buttons give to `.98` and their arrow leans 3 px; FAQ rows take the `tint` (4 px inside their rules) and their plus or cross turns a quarter, so a hover never shows the other state; platform tiles lift 2 px onto `--float`; flat sheets darken their ring to `line-2`.
- **Reduce motion**: every finished state at first paint; pointer-driven motion (the final eyes) still runs; the marquee runs at half speed with its pause button.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately: explicit lines, phrase-level breaks, no orphaned characters.
- Do check light and dark, 390, 768 and 1440 px, Reduce motion on and off, before calling a change done.
- Do label the example run wherever it appears (the hero desk and caption, every story figure, the bill's note) and keep it the recording's; label what is not recorded as an illustration (the lifecycle thread, the fallback line).
- Do reserve the final box of anything that plays (comment, notes, stacked variants, the verdict row, the Copy button): nothing changes size after the first paint.
- **Don't resemble a competitor's visual signature** (CodeRabbit's taupe mat and orange, Factory's grey and uppercase mono, Greptile's mint and rails): borrow finish, not devices.
- Don't use the pen on UI chrome or on our own claims, add a second accent, gradient text, glows, glass on paper, textures, pills or uppercase labels, or let the pen write on stone.
- Don't write a colour literal outside `app/tokens.css`; name a token and derive translucent variants with `color-mix(in srgb, var(--token) N%, transparent)`. The standalone icons and the share card are the exception: they are images.

## Known issues

- Display lines fall back to "Ocra Narrow" from local system faces; where none is installed they fall to next/font's Arial-based fallback and are clipped at their container until Archivo arrives.
- The hero caption follows the note through CSS anchor positioning (`@position-try`) from 1200 px; browsers without it get the caption at the desk's foot. Lightning CSS does not know the at-rule yet and warns during the build ("Unknown at rule: @position-try"); the rule is kept as written.
- In a full-page screenshot the pinned story shows only the current figure beside the four steps: the figures share one sticky area by design.
- The phone page is close to its 13,000 px limit (about 12,900 in English): a section that grows on phones must give the height back.

## Verification

- `npm run verify`: Biome, the colour check, the AGENTS check, knip, the build (which runs `recorded.ts`'s assertions against the recording), the type check, the schemas and the code face's glyphs.
- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots and behaviour** (`tests/visual/`, Playwright): `/` and `/zh`, the manual's index, quickstart and installation, and the 404 page in each language, at 390, 768 and 1280 px, light and dark, failing on console errors (`pages.spec.ts`); axe on both landing languages with the product window's second tab and the lifecycle's states open, and on both 404s (`a11y.spec.ts`); the first-frame hero paint, the one font preload and the sprite (`load.spec.ts`); the theme toggle, the logo's prefetch and the manual's sidebar (`components.spec.ts`); headers, routing and caching.
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences.
- The harness takes screenshots with Reduce motion on, which settles every animated object on its finished state. `tests/visual/stable.css` pins the docs table of contents and the providers marquee.
