# AGENTS.md

Rules for humans and AI agents working on the Open-CR-Agent site: the landing page and the rendered user manual for [Open-CR-Agent](https://github.com/jma49/Open-CR-Agent).

## Project

- Next.js (App Router) + [Fumadocs](https://fumadocs.dev) + Tailwind CSS, deployed on Vercel.
- Two languages: English at `/`, Chinese at `/zh`. Every page and every string exists in both.
- `npm run verify`: `check` (Biome with warnings as errors, the colour check, knip), the build, `typecheck` and the schema check. CI runs it; run it before every push.
- **Nothing deploys automatically** (`vercel.json`: `git.deploymentEnabled: false`), neither pull requests nor `main`, because the Hobby plan rate-limits builds. Deploy hooks do not run while Git deployments are off. Check changes on a local `next build && next start`; deploy only when the maintainer asks, with `VERCEL_SCOPE=<team> npm run deploy` (`scripts/deploy.sh`: the committed HEAD, which must be on `origin/main`, through a logged-in, pinned Vercel CLI). Each deploy costs one build.

| Path | Contents |
|---|---|
| `app/[lang]/(home)` | Landing page |
| `app/[lang]/docs` | Rendered user manual |
| `components/landing/` | Landing page sections |
| `components/brand/` | The spider mark |
| `app/landing/` | The landing page's styles, split by section (`index.css` imports them in order) |
| `app/docs.css` | The manual's restyling of Fumadocs |
| `lib/copy/` | All landing page copy: `types.ts`, then `en.ts` and `zh.ts` with the same shape |
| `scripts/sync-manual.mjs` | Copies the manual into `content/docs`, and the JSON Schemas into `public/schema`, before `dev` and `build` |
| `scripts/demo-video/` | Records the example run (real ocra CLI, scripted model) that the landing page quotes; see its README |
| `lib/landing/example-run.ts` | That run's numbers, files, finding and terminal lines: the only place the page takes them from |

## The manual is not written here

The user manual's source lives in the main repository under `docs/manual/{en,zh}`, next to the code it documents. `content/docs` is generated and git-ignored. Edit the manual in the main repository; this repository only renders it.

- Locally the sync script reads `MANUAL_DIR` (it must exist), else `../ocra/docs/manual`, else fetches as below. `MANUAL_SOURCE=remote` always fetches (CI).
- On Vercel, and without a local checkout, it fetches `MANUAL_REPO` at `MANUAL_REF` (default: `main` of the public main repository). It fails if the copy lacks `en/` or `zh/`.
- The engine's JSON Schemas (`docs/schema/*.json`) are served at `/schema/<file>`, where their `$id` points. The sync refuses a schema whose `$id` is not this site's `/schema/<its file name>`, and CI's `npm run check:schemas` checks each one answers there after the build. Their v1 `$id`s use the old host `ocra.majincheng.com`, so its redirect to this site (path kept) must stay.
- The manual may use the MDX components registered in `components/mdx.tsx` (`Callout`, `Cards`/`Card`, `Steps`/`Step`, `Tabs`/`Tab`). Register a component here before the manual uses it, or the site build fails.

## How the site uses Fumadocs

Read this before touching routing, the docs layout or MDX; it saves reading `fumadocs-ui` and `fumadocs-core` from `node_modules`.

- **Languages** (`lib/i18n.ts`): `en` and `zh`, `parser: "dir"`, `hideLocale: "default-locale"`. English has no prefix (`/docs/x`), Chinese does (`/zh/docs/x`).
- **The prefix is hidden by a rewrite** (`proxy.ts`, Fumadocs' i18n middleware): `/docs/x` is served from the prerendered `/en/docs/x`. So on the server Next sees `/en/...` while the browser sees `/...`. `components/providers.tsx` hands Fumadocs a `FrameworkProvider` whose pathname drops the hidden `/en`, so active links and pagination match on both sides; without it React discards the server HTML (a hydration error on every English docs page, fixed in site #20). Keep any new pathname-dependent component behind that provider.
- **Providers by section:** Fumadocs' `RootProvider` (search, i18n UI, scroll lock) wraps only the manual (`app/[lang]/docs/layout.tsx`) and the 404 page; the landing page gets `next-themes` alone (`components/landing-theme.tsx`), with the same options (`lib/theme.ts`) so the theme carries across. The 404 page is loaded with `next/dynamic` (`components/not-found-lazy.tsx`) because every page under `[lang]` carries its boundary; importing it directly put Fumadocs into the landing page's bundle.
- **Landing sections render on the server.** Client code is limited to small islands that hold state (`header-controls.tsx`, `lifecycle-states.tsx`, `step-sync.tsx`, the product window, the dock, the spiders); pass server-rendered markup to them as children rather than making a section a client component, and never pass the whole copy to one.
- **MDX components** the manual may use are registered in `components/mdx.tsx`; register one there before the manual uses it, or the build fails.
- **Links in the manual:** relative links (`./github`) resolve against the page's URL, and the manual's index page is `/docs`, not `/docs/`, so from there `./github` would point to `/github` and 404. The index pages use absolute links per language (`/docs/github`, `/zh/docs/github`); other pages may use relative ones.
- **404s:** unknown paths under a language go through `app/[lang]/[...rest]/page.tsx` to `app/[lang]/not-found.tsx`, which renders `components/not-found-page.tsx` in that language.
- **Routes:** the landing page is `app/[lang]/(home)`, the manual `app/[lang]/docs/[[...slug]]`, with the source loaded in `lib/source.ts` from the generated `content/docs`.
- **Metadata:** each page sets its own canonical and language alternates (`alternates()` in `lib/seo.ts`; x-default is English) and its Open Graph and Twitter tags (`social()`: Next replaces a parent's `openGraph` instead of merging it). `app/sitemap.ts` lists both languages of every page, `app/robots.ts` points to it, and `app/opengraph-image.tsx` is the one share card (excluded from the i18n middleware in `proxy.ts`, like the icons).

## Content rules

- **Say only what is true today.** The project is early: no invented customers, logos, testimonials, statistics or benchmark results. Planned features are labeled as planned.
- Examples of ocra output are labeled as examples and must be technically correct: a code review product cannot show a wrong bug. The landing page's example (the pull request and terminal in the hero window, the step pictures, the finding) is one recorded run from `scripts/demo-video/`, and every number, file and line of it lives in `lib/landing/example-run.ts` (copy that quotes it is a function of the run). When ocra's output changes, record it again and update that one file rather than editing components or copy.
- The design is original. The site may borrow the structure of other product pages but never their copy, visuals or branding.

## Design

`DESIGN.md` holds the design system: tokens, type scale, components, the mascot, Read it before any change to `app/` or `components/`. The rules that apply to every change:

- **Ink, paper, aquamarine and pink.** Aquamarine carries the brand and meaning (links, focus, "verified", emphasis); pink is only the second print plate (off-register edges, hover shadows, the spider's ghost) and never carries meaning or body text. Frosted glass for windows and panels; the halftone night, the corner webs and the soft light behind panels are the background effects.
- **One hover language** (DESIGN.md, Motion): blocks lift up-left with a pink plate behind and an aquamarine one ahead; lines get a highlighter sweep. Pointer-driven motion always runs; idle loops stop under Reduce motion, except the providers marquee.
- **Never resemble a competitor's visual signature**; borrow finish, not devices.
- Style through the tokens in `app/tokens.css` only: no colour literal anywhere else (`npm run check` fails on one) and no Tailwind palette colours. A token change edits `app/tokens.css` and `DESIGN.md` in the same commit; run `npx @google/design.md lint DESIGN.md`.
- Chinese headings get their own sizes and explicit line breaks; do not rely on automatic balancing for CJK.
- Look at the result before calling a UI change done: `npm run build && npm run visual:baseline` before the change, `npm run build && npm run visual` after it (both languages, three widths, both themes, console errors; see Verification in `DESIGN.md`). A pull request that changes the look on purpose gets the `visual-change` label and lists the intended differences.

## Code style

- The code is the documentation: no large comment blocks; comment only a non-obvious "why".
- No source file over 500 lines.
- Changes must work in light and dark mode and at phone width (390 px) without horizontal page scroll.

## Handoff

- The state of the project, the site included, is kept in `handoff.md` in the maintainers' private repository `jma49/ocra-internal` (cloned as `../ocra-internal`). Update it at the end of every task or batch of work, before reporting it done, without being asked. Never put such notes in this public repository.

## Working with agents

Mirrored word for word in the AGENTS.md of ocra, ocra-cloud and ocra-site: change all three together.

- **One owner per issue queue, one worktree per session.** Never edit a checkout another session is using.
- **The maintainer runs production:** deploys, production database writes and secret-store changes. Prepare the exact command and a dry-run result, then hand off.
- **A critical Dependabot alert is a P0:** fix or pin it the same day.
- **Validate what you act on, after normalising it** (`new URL()`, path resolution), never only the raw input.
- **Uniqueness and currency live in the database** (`UNIQUE`, `ON CONFLICT`, compare-and-set), never in check-then-write code.
- **A fix's test fails on the old code on an assertion,** not on a module the fix adds (`scripts/fails-without.sh` refuses that).
- **Shapes the CLI and ocra Cloud share live in `@open-cr-agent/cloud-contract`;** never retype them.
- **Show only what exists:** mocks, demos and the landing use shipped behaviour and recorded or synthetic data, never the maintainer's accounts, numbers, keys or budget.
- **Keep AGENTS.md under 150 lines:** a rule names the check that enforces it; stories go to `../ocra-internal/pitfalls.md`.

## Git workflow

- `main` is always deployable. Work on `<type>/<short-kebab-description>` branches, merge through pull requests with rebase, and delete the branch afterwards.
- The author may merge after green CI and a self-review of the full diff.
- [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <subject>`, imperative, at most 72 characters.
- **Commits must not include `Co-authored-by` trailers or any other co-author metadata.**
- **Pull request titles, descriptions and comments must not include AI attribution.**
