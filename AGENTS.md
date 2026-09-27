# AGENTS.md

Rules for humans and AI agents working on the Open-CR-Agent site: the landing page and the rendered user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent).

## Project

- Next.js (App Router) + [Fumadocs](https://fumadocs.dev) + Tailwind CSS, deployed on Vercel.
- Two languages: English at `/`, Chinese at `/zh`. Every page and every string exists in both.
- `npm run lint` (Biome), `npx tsc --noEmit`, `npm run build`. CI runs all three.
- Only `main` deploys (`vercel.json`): pull requests get no Vercel preview, because the Hobby plan rate-limits builds. Check changes on a local `next build && next start`.

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

- The look follows [JM/OS](https://github.com/jma49/jmos): Mac OS X Aqua, drawn in CSS only. No Apple, ryOS or other third-party assets (icons, fonts, wallpapers); JM/OS's own assets are AGPL and trademarked and must not be copied here.
- The theme follows the system: light is Aqua (pinstripes, blue gel), dark is graphite; both must stay equally polished. Tokens are the `--aqua-*` variables in `app/global.css`.
- Materials: the landing page is the `.desktop` (pinstripes); content sits in `Window` (`components/aqua/window.tsx`: title bar, decorative traffic lights, optional accessory), with `.inset` panes for white content and `.terminal` for terminals, which stay dark in both themes. Buttons are `.gel` (primary) and `.gel-plain`; selections use `.row-selected`; separators use `.groove`; milestones use `.progress` bars.
- Typography: Lucida Grande and Monaco where installed, Inter and JetBrains Mono as loaded fallbacks.
- Brand: the mark in `app/icon.svg` and `components/logo.tsx` (a glossy Aqua-blue gel tile: lines of code, the highlighted one under a magnifier; the favicon uses gradients, the inline mark approximates them with solid layers), wordmark `ocra` in lowercase bold with tight tracking. Inline SVGs must not rely on `id` references: the layout renders the logo more than once.
- Avoid the generic AI landing-page look: no pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy. Prefer left-aligned editorial layouts and concrete statements.
- Chinese headings get their own sizes and explicit line breaks; do not rely on automatic balancing for CJK.

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
