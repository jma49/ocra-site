---
version: alpha
name: Open-CR-Agent site
description: A calm warm-neutral page grounded in the Ocra Cloud console. Google Sans Flex display over Geist text, JetBrains Mono for code, the console's own screenshots as the pictures, stippled 3D shapes for art, isometric cards on a grid, tinted rounded panels and one dark block.
colors:
  primary: "#1F1D1B"
  signal: "#C8402A"
  ground: "#F6F5F3"
  panel: "#FFFFFF"
  raised: "#EFEDEA"
  well: "#F1EFEC"
  t1: "#1F1D1B"
  t2: "#5E5A55"
  t3: "#6A655F"
  on-ink: "#FFFFFF"
  red: "#B23720"
  red-soft: "#F7E9E5"
  amber: "#925600"
  amber-soft: "#F6ECDC"
  green: "#17723D"
  blue: "#3A5FB0"
  tint-blue: "#EEF1F6"
  tint-stone: "#F3F1EE"
  tint-sand: "#F1EFEB"
  tint-red: "#F7EEEB"
  tile: "#FBFAF9"
  tile-edge: "#DEDAD5"
  block: "#1F1D1B"
  block-2: "#2A2725"
  on-block: "#F3F1EE"
  word: "#ECEBE8"
  ground-dark: "#161514"
  panel-dark: "#1F1D1B"
  raised-dark: "#2A2826"
  t1-dark: "#EFECE8"
  t2-dark: "#B8B2AB"
  t3-dark: "#98918A"
  red-dark: "#EE7A63"
  green-dark: "#5CC486"
  blue-dark: "#8EA8E6"
  block-dark: "#0E0D0C"
typography:
  display:
    fontFamily: Google Sans Flex
    fontSize: 4.75rem
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: -0.035em
  headline:
    fontFamily: Google Sans Flex
    fontSize: 3rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  panel-title:
    fontFamily: Google Sans Flex
    fontSize: 2.5rem
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: -0.03em
  title:
    fontFamily: Google Sans Flex
    fontSize: 1.125rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.02em
  lede:
    fontFamily: Geist
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.55
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  tag: 6px
  control: 999px
  card: 16px
  shot: 18px
  tile: 28px
  panel: 32px
spacing:
  gutter: 16px
  gutter-lg: 32px
  content-max: 1248px
  section-y: 64px
  section-y-lg: 96px
  control-height: 44px
components:
  page:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.t1}"
    typography: "{typography.body}"
  page-dark:
    backgroundColor: "{colors.ground-dark}"
    textColor: "{colors.t1-dark}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.t1}"
    rounded: "{rounded.panel}"
  panel-dark:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.t1-dark}"
  tinted-panel:
    backgroundColor: "{colors.tint-blue}"
    textColor: "{colors.t1}"
    rounded: "{rounded.panel}"
  block:
    backgroundColor: "{colors.block}"
    textColor: "{colors.on-block}"
    rounded: "{rounded.panel}"
  block-dark:
    backgroundColor: "{colors.block-dark}"
    textColor: "{colors.on-block}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
  button-line:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.t1}"
    rounded: "{rounded.control}"
    height: "{spacing.control-height}"
  tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.t1}"
    rounded: "{rounded.tile}"
  tag-critical:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red}"
    rounded: "{rounded.tag}"
  tag-warning:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber}"
    rounded: "{rounded.tag}"
  code:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.t1}"
    typography: "{typography.mono}"
---

# Open-CR-Agent site

The landing page is calm and product-first: a warm neutral ground, the Ocra Cloud console's real screens as the pictures, and a small set of crafted devices around them. It is grounded in the console's own design (ocra-cloud `web/DESIGN.md`: Geist, JetBrains Mono, neutral ground, ink actions, status tones), so a screenshot of the console sits on the page as on its own ground. The 404 page shares the buttons and the neutral `:root` tokens.

## Colors

- **Ground and panels**: `ground` is the page, `panel` the white objects on it (the quiet panel, cards, plans, the bill, the footer), `raised` insets and code, `well` the deeper panels (providers, limits). Text is `t1`, `t2` for ledes and bodies, `t3` for captions and meta. Hairlines are `t1` at 8 % (`hair`) and 13 % (`hair2`).
- **Tints**: each tinted panel carries one hue at a trace of chroma: `tint-stone`, `tint-blue`, `tint-sand`, `tint-red` (the four how-it-works panels, the console stage, the record's picture).
- **Status tones** are the console's and mean what they mean there: `red` critical (and the strike through what was set aside), `amber` warning, `green` confirmed or committed, `blue` running. No other accent, no gradients on text, no glows.
- **The block**: `block` is the page's one dark band (security) and the hosted plan's card; text `on-block` at 100, 64 and 60 %. It stays dark in both themes.
- **Stipple colours** live in the SVG art itself (`public/landing/*.svg`, one file per theme): ink, cinnabar, mist blue and stone.
- **Dark** keeps the ramp's hues with lightness inverted (`html.dark .home`). Every picture has a dark twin (`Themed` in `components/landing/parts.tsx`), the console screenshots rendered from the console's own dark theme.

## Typography

- **Google Sans Flex** (`next/font`, weight 500 only, the only preloaded face) for display: the H1, every H2 and H3, figures, the wordmark. Tight tracking (-0.035em on the H1, -0.03em on H2s), never bold.
- **Geist** for text and **JetBrains Mono** for code and engine identifiers (task ids, tool names, file paths), both from `@fontsource` in `site.css`, not preloaded.
- Chinese falls through to the system faces, with its own line heights and no negative tracking; headings are explicit lines in both languages (`Lines`).

## Layout

- `.wrap`: 1248 px of content, 32 px gutter (16 px below 600). Sections 96 px apart (64 below 768).
- Order: nav, hero (claim, two CTAs, stage with the recorded finding), proof strip, quiet panel, how it works (four stacking panels), console (inbox), record (accordion and the Reviews page), providers wall, limits (the bill), security block, plans, questions, the close (CTA on shapes), footer with the full-width wordmark.
- Splits collapse to one column below 1024 px; at 390 px nothing scrolls sideways (wide pictures are cropped inside their panel).

## Elevation and shapes

- Shadows: `--sh` (panels), `--sh-lg` (floating windows, chips, the bill); isometric cards carry a hard offset `--solid` instead of a blur, as if standing on the grid.
- Radii: tags 6, isometric cards 16, screenshots 18, tiles and accordion items 20–28, panels and the block 32 (24 on phones). Buttons are full pills.

## Components

- **Mark** (`components/brand/eyes-mark.tsx`): a jumping spider's front eye row, one even-odd path in `currentColor`, beside the lowercase wordmark (`components/logo.tsx`). In prose the product is "Ocra" and "Ocra Cloud" (`lib/copy/brand.ts`).
- **Screenshots** of the console are rendered from the console's build with its API mocked by sample data (never an account's), cropped and saved as WebP in both themes. Captions say "sample data" or "recorded example run".
- **Stippled shapes**: extruded columns of the eye mark drawn as SVG with a noise filter; the hero's two rows bob slowly and the ink columns' glints look around and blink (inside the SVG, stopped under Reduce motion).
- **Isometric cards** (`how.tsx`, `providers.tsx`): a plane turned `rotateX(55deg) rotateZ(-38..-40deg)` over a 48–75 px grid; every card on it is the recorded run's data.
- **Islands** (the only client code): `header-controls.tsx` (menu, theme, the bar's hairline), `hero-stage.tsx` (pointer parallax) and `copy-command.tsx`. Disclosures are native `<details name>`.
- **Copy** lives in `lib/copy/sections/`, one module per section with English and Chinese side by side; numbers, paths, lines and titles come from `lib/landing/example-run.ts`, checked against the recording by `lib/landing/recorded.ts` at build time.

## Motion

- No animation library: CSS keyframes, scroll-driven animations behind `@supports (animation-timeline: view())`, and one pointer listener. No window scroll listener.
- **Hero**: the headline, lede and CTAs rise 14 px on load and are painted from the first frame (no fade). The finding window plays a 12 s loop: a scan line reviews, the finding reveals, the cursor presses Commit fix, the toast confirms, the state reads Reviewed. The chips drift; the shapes bob; the stage leans with the pointer.
- **How it works**: the four panels are sticky, each 16 px lower than the last, so they stack as the page scrolls; as each arrives its cards slide along the plane into place, driven by the scroll itself. This is the one reveal on scroll, and it only moves cards that are already in the layout.
- **Reduce motion**: every loop and drift stops on its final state (Reviewed, the fix committed), the slide-in is off and the panels are in place; pointer parallax still runs where there is a fine pointer.
- Curves: `--e-enter` and `--e-std`; linear for scroll-driven ranges.

## Manual

The manual (`/docs`) is the product's reference, read next to the ocra Cloud console, so it follows the console's design spec (`web/DESIGN.md` in ocra-cloud) rather than the landing page's desk. Its values are the console's, under the console's names, scoped to the manual (`html:has(.docs-frame)` in `app/tokens.css`); `app/docs.css` maps Fumadocs to them.

- **Frame:** the bar and the page tree on `--ground`, the page on one `--panel` (radius `--r-sheet` 10, `--shadow`), the table of contents on the ground beside it. No textures, gradients, glass or paper; the bar has no line, the panel separates it. On a phone (below 768 px, where Fumadocs moves the tree into its drawer) the panel runs edge to edge.
- **Type:** Geist, JetBrains Mono for code (the console's code face), Noto Sans SC for Chinese (Fontsource, loaded per range of characters used). Sizes only from the console's scale (`--fs-2xs` 10 … `--fs-4xl` 30): body prose 14/24, page title 30/600, section 20/600 under a hairline, side lists and notes 13, group labels, table heads and the table of contents' title 12/500 in `--t3`, in sentence case without tracking (unlike the console's uppercase labels: the manual is read, not scanned). Tracking is tightened only on the 30 px title. Page descriptions are subheads and drop their closing full stop.
- **Text tones:** `--t1` headings and links, `--t2` prose, `--t3` labels and the table of contents, `--t4` only for markers and the link underline at rest.
- **One ink:** links are `--t1` with a `--t4` underline that darkens under the pointer; the selected page in the tree and the selected tab are `--fill2`. No accent colour; focus is the console's `--focus` ring.
- **Status:** callouts (`components/docs/note.tsx`) name their kind in words beside a Lucide icon; warnings take `--warning`, critical ones `--critical`, both as soft fills, never large backgrounds.
- **Page tree:** groups follow the reader's path (get started, review pull requests, configure, CLI and integrations, concepts, help); each page carries a Lucide icon from its front matter (`icon:`), 16 px at stroke 1.75 in `--t3`, `--t1` on the page being read.
- **Cards:** the manual names a card's icon by its Lucide name (`<Card icon="Play">`); the icon sits on a 28 px `--fill2` tile above the title (14/500), beside it on a phone. The overview opens on four cards for the ways in, and the quickstart ends on next steps.
- **Page foot:** edit on GitHub, then the previous and next pages as two raised links, each named by its direction (12 px `--t3`) and its title (14/500).
- **Code:** a raised block (`--raised`, `--shadow`, radius 8), 12/20 JetBrains Mono; syntax in ink, `--teal` for strings and values, `--violet` for names, `--t3` for comments.
- **Motion:** colour and fill fade in 120 ms on `--e-std`; nothing lands, slides or loops; under Reduce motion nothing moves.

## Do's and Don'ts

- Do keep every page and string in English and Chinese, and check the Chinese layout separately.
- Do check light and dark, 390, 768 and 1440 px, Reduce motion on and off, before calling a change done.
- Do use the console's real screens and the recorded run; label sample data and the example run wherever they appear.
- Don't invent numbers, logos or customers; the providers wall shows providers Ocra Cloud forwards to, by their own marks.
- Don't add a second accent, gradient text, glows or glass on panels; status colours mean status.
- Don't write a colour literal outside `app/tokens.css` (and the SVG art in `public/landing/`); name a token and derive translucent variants with `color-mix()`.
- Don't borrow another product's copy, visuals or branding; borrow structure and finish only.

## Known issues

- The 404 page still uses the neutral `:root` set, not the landing ramp.
- `next/font` has no fallback metrics for Google Sans Flex (`adjustFontFallback: false`): headings reflow slightly when the face arrives.

## Verification

- `npm run verify`: Biome, the colour check, the AGENTS check, knip, the build (which runs `recorded.ts`'s assertions against the recording), the type check and the schemas.
- Lint this file: `npx @google/design.md lint DESIGN.md`.
- **Screenshots and behaviour** (`tests/visual/`, Playwright): `/` and `/zh`, the manual's index, quickstart and installation, and the 404 page in each language, at 390, 768 and 1280 px, light and dark, failing on console errors; axe on both landing languages and both 404s; the first-frame hero paint and the one font preload; the theme toggle, the logo's prefetch and the manual's sidebar; headers, routing and caching.
- Locally: `npm run build && npm run visual:baseline` before the change, then `npm run build && npm run visual` after it. Screenshots stay in the git-ignored `.visual/`.
- In CI, the Visual workflow builds the base branch and the pull request in one job and compares them. A pull request that changes the look on purpose gets the `visual-change` label and lists the expected differences.
