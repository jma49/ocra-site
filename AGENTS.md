# AGENTS.md

Rules for humans and AI agents working on the Open-CR-Agent site: the landing page and the rendered user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent).

## Project

- Next.js (App Router) + [Fumadocs](https://fumadocs.dev) + Tailwind CSS, deployed on Vercel.
- Two languages: English at `/`, Chinese at `/zh`. Every page and every string exists in both.
- `npm run lint` (Biome), `npx tsc --noEmit`, `npm run build`. CI runs all three.
- **Nothing deploys automatically** (`vercel.json`: `git.deploymentEnabled: false`), neither pull requests nor `main`, because the Hobby plan rate-limits builds. Deploy hooks do not run while Git deployments are off. Check changes on a local `next build && next start`; deploy only when the maintainer asks, with `VERCEL_SCOPE=<team> npm run deploy` (`scripts/deploy.sh`: the committed HEAD, through a logged-in Vercel CLI). Each deploy costs one build.

| Path | Contents |
|---|---|
| `app/[lang]/(home)` | Landing page |
| `app/[lang]/docs` | Rendered user manual |
| `components/landing/` | Landing page sections |
| `lib/copy/` | All landing page copy: `types.ts`, then `en.ts` and `zh.ts` with the same shape |
| `scripts/sync-manual.mjs` | Copies the manual into `content/docs` before `dev` and `build` |
| `scripts/demo-video/` | Records the example run (real ocra CLI, scripted model) and renders the demo video; see its README |

## The manual is not written here

The user manual's source lives in the main repository under `docs/manual/{en,zh}`, next to the code it documents. `content/docs` is generated and git-ignored. Edit the manual in the main repository; this repository only renders it.

- Locally the sync script reads `MANUAL_DIR`, else `../ocra/docs/manual` or `../Open-CR-Agent/docs/manual` (the default clone name), whichever exists.
- On Vercel it fetches `MANUAL_REPO` at `MANUAL_REF` (default: `main` of the public main repository).
- The manual may use the MDX components registered in `components/mdx.tsx` (`Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`). Register a component here before the manual uses it, or the site build fails.

## How the site uses Fumadocs

Read this before touching routing, the docs layout or MDX; it saves reading `fumadocs-ui` and `fumadocs-core` from `node_modules`.

- **Languages** (`lib/i18n.ts`): `en` and `zh`, `parser: "dir"`, `hideLocale: "default-locale"`. English has no prefix (`/docs/x`), Chinese does (`/zh/docs/x`).
- **The prefix is hidden by a rewrite** (`proxy.ts`, Fumadocs' i18n middleware): `/docs/x` is served from the prerendered `/en/docs/x`. So on the server Next sees `/en/...` while the browser sees `/...`. `components/providers.tsx` hands Fumadocs a `FrameworkProvider` whose pathname drops the hidden `/en`, so active links and pagination match on both sides; without it React discards the server HTML (a hydration error on every English docs page, fixed in site #20). Keep any new pathname-dependent component behind that provider.
- **MDX components** the manual may use are registered in `components/mdx.tsx`; register one there before the manual uses it, or the build fails.
- **Links in the manual:** relative links (`./github`) resolve against the page's URL, and the manual's index page is `/docs`, not `/docs/`, so from there `./github` would point to `/github` and 404. The index pages use absolute links per language (`/docs/github`, `/zh/docs/github`); other pages may use relative ones.
- **404s:** unknown paths under a language go through `app/[lang]/[...rest]/page.tsx` to `app/[lang]/not-found.tsx`, which renders `components/not-found-page.tsx` in that language.
- **Routes:** the landing page is `app/[lang]/(home)`, the manual `app/[lang]/docs/[[...slug]]`, with the source loaded in `lib/source.ts` from the generated `content/docs`.

## Content rules

- **Say only what is true today.** The project is early: no invented customers, logos, testimonials, statistics or benchmark results. Planned features are labeled as planned.
- Examples of ocra output are labeled as examples and must be technically correct: a code review product cannot show a wrong bug. The landing page's example (hero terminal, stage pictures, finding, demo video) is one recorded run from `scripts/demo-video/`; when ocra's output changes, record it again rather than editing the lines by hand.
- The design is original. The site may borrow the structure of other product pages but never their copy, visuals or branding.

## Design

`DESIGN.md` holds the design system: tokens, type scale, components, the mascot, and the migration in progress. Read it before any change to `app/`, `components/` or `app/global.css`. The rules that apply to every change:

- **Monochrome and typography-led; colour carries meaning only** (the aquamarine accent for links, focus and "verified"; review severities; diff lines). No gradients, textures or skeuomorphism; the hero glow behind the mascot and the OCRA wordmark band at the foot of the landing page are the only background effects (the band is the one place the brand colour is decoration).
- Avoid the generic AI landing-page look: no pill badges, uppercase eyebrow labels, gradient-text headlines, rows of icon cards, slogans or rule-of-three copy. Prefer left-aligned editorial layouts and concrete statements.
- Style through the tokens in `app/global.css` only: no hex values or Tailwind palette colours in components. A token change edits `app/global.css` and `DESIGN.md` in the same commit; run `npx @google/design.md lint DESIGN.md`.
- Chinese headings get their own sizes and explicit line breaks; do not rely on automatic balancing for CJK.
- Look at the result before calling a UI change done: `npm run build && npm run visual:baseline` before the change, `npm run build && npm run visual` after it (both languages, three widths, both themes, console errors; see Verification in `DESIGN.md`). A pull request that changes the look on purpose gets the `visual-change` label and lists the intended differences.

## Code style

- The code is the documentation: no large comment blocks; comment only a non-obvious "why".
- No source file over 500 lines.
- Changes must work in light and dark mode and at phone width (390 px) without horizontal page scroll.

## Handoff

- The state of the project, the site included, is kept in the main repository's `docs/handoff.md`. Update it at the end of every task or batch of work, before reporting it done, without being asked.

## Git workflow

- `main` is always deployable. Work on `<type>/<short-kebab-description>` branches, merge through pull requests with rebase, and delete the branch afterwards.
- The author may merge after green CI and a self-review of the full diff.
- [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`, imperative, at most 72 characters.
- **Commits must not include `Co-authored-by` trailers or any other co-author metadata.**
- **Pull request titles, descriptions and comments must not include AI attribution.**
