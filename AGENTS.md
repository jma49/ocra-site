# AGENTS.md

Rules for humans and AI agents working on the Open-CR-Agent site: the landing page and the rendered user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent).

## Project

- Next.js (App Router) + [Fumadocs](https://fumadocs.dev) + Tailwind CSS, deployed on Vercel.
- Two languages: English at `/`, Chinese at `/zh`. Every page and every string exists in both.
- `npm run lint` (Biome), `npx tsc --noEmit`, `npm run build`. CI runs all three.
- **Nothing deploys automatically** (`vercel.json`: `git.deploymentEnabled: false`), neither pull requests nor `main`, because the Hobby plan rate-limits builds. Check changes on a local `next build && next start`; the maintainer deploys by hand with `gh workflow run site-deploy.yml` in the main repository (the Vercel deploy hook), or from the Vercel dashboard.

| Path | Contents |
|---|---|
| `app/[lang]/(home)` | Landing page |
| `app/[lang]/docs` | Rendered user manual |
| `components/landing/` | Landing page sections |
| `lib/copy.ts` | All landing page copy, English and Chinese side by side |
| `scripts/sync-manual.mjs` | Copies the manual into `content/docs` before `dev` and `build` |

## The manual is not written here

The user manual's source lives in the main repository under `docs/manual/{en,zh}`, next to the code it documents. `content/docs` is generated and git-ignored. Edit the manual in the main repository; this repository only renders it.

- Locally the sync script reads `../Open-CR-Agent/docs/manual`, or `MANUAL_DIR`.
- On Vercel it fetches `MANUAL_REPO` at `MANUAL_REF` (default: `main` of the public main repository).

## Content rules

- **Say only what is true today.** The project is early: no invented customers, logos, testimonials, statistics or benchmark results. Planned features are labeled as planned.
- Examples of ocra output are labeled as examples and must be technically correct: a code review product cannot show a wrong bug.
- The design is original. The site may borrow the structure of other product pages but never their copy, visuals or branding.

## Design

- **Monochrome and typography-led**, in the manner of modern developer-tool sites, but original: neutral greys, generous whitespace, 1px borders, 8–12px radii, very soft shadows. No gradients, textures or skeuomorphism. The only background effect is a soft aquamarine glow behind the 3D mascot at the top of the hero.
- **Colour carries meaning only.** The brand is Aquamarine `#7fffd4` (`--brand`). In the light theme it is too pale for text, so links, focus rings and "verified" use `--accent` (the same hue, about 5:1 on white); in the dark theme `--accent` is the brand itself. Review severities (`--critical`, `--warning`) and diff lines are the only other colours.
- **Tokens** live in `app/global.css` (`--bg`, `--fg`, `--fg-muted`, `--border`, `--accent`, …) and are mapped onto Fumadocs' `--color-fd-*`, so the landing page and the manual share one system. The theme follows the system; light and dark must be equally polished.
- **Components:** `Panel` (`components/ui/panel.tsx`, an optional label bar for a file name or command; `dark` for terminals, which stay dark in both themes), `.btn` (primary, foreground-coloured) and `.btn-outline`, `.marker` numbered dots, `.severity-critical` and `.verified` tags.
- **Typography:** Geist and Geist Mono (loaded with `next/font`), Chinese in the system faces (PingFang SC, Noto Sans SC). Headlines are semibold with tight tracking. Set a headline's line height with the `text-[size]/[leading]` form: `cn` (tailwind-merge) drops a separate `leading-*` next to an arbitrary text size.
- **Mascot:** an original aquamarine frog reading code (`components/logo.tsx`, `app/icon.svg`): round head, two raised eyes looking down at the code, dark teal outline, coral cheeks. It may take its spirit from friendly beverage mascots but must never copy one (no Jinro toad shapes, colours or poses). It appears as the logo mark, the favicon and the Apple icon (on a light tile), and once on the landing page as a 3D voxel frog above the hero (`components/landing/voxel-frog.tsx`, three.js, the voxels generated in `lib/voxel-frog.ts` rather than loaded from a model): the camera spins in and settles, then the frog turns slowly (the spin-in follows craftz.dog's voxel dog). Hovering turns it with the pointer, no click needed: crossing the frame is a full 360° turn and height tilts the view slightly; touch turns it with a horizontal swipe and keeps vertical scrolling. There is no zoom or pan, so the frog never leaves its frame. Rendering pauses off screen, reduced motion skips the spin and the auto-rotation, and a browser without WebGL gets the flat mark. three.js loads lazily through `components/landing/frog-stage.tsx`. The effect follows the voxel mascot on craftz.dog; the model and code are our own. Outlines are a thick dark stroke under the fills, and inline SVGs use no `id` references (the layout renders the logo more than once).
- Avoid the generic AI landing-page look: no pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy. Prefer left-aligned editorial layouts and concrete statements.
- Chinese headings get their own sizes and explicit line breaks; do not rely on automatic balancing for CJK. Chinese prose gets more leading (`:lang(zh) .prose`).

## Code style

- The code is the documentation: no large comment blocks; comment only a non-obvious "why".
- No source file over 500 lines.
- Changes must work in light and dark mode and at phone width (390 px) without horizontal page scroll.

## Git workflow

- `main` is always deployable. Work on `<type>/<short-kebab-description>` branches, merge through pull requests with rebase, and delete the branch afterwards.
- The author may merge after green CI and a self-review of the full diff.
- [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`, imperative, at most 72 characters.
- **Commits must not include `Co-authored-by` trailers or any other co-author metadata.**
- **Pull request titles, descriptions and comments must not include AI attribution.**
