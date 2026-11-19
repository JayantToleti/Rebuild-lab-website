# Rebuild Lab Website — Boilerplate Plan

Sources: `Rebuild Lab Website Requirements Specification.pdf` (SPEC-001, "Spec") and `Rebuild_Lab_Founding_Proposal.pdf` ("Proposal").
Where they conflict, the Spec wins. Decisions confirmed with the user:

- Routes: only the Spec's six — `/`, `/explore`, `/labs/[slug]`, `/projects/[slug]`, `/about`, `/contribute`. Header nav contains only these (no `/labs` index, `/research`, `/benchmarks`, `/notes`).
- Project page: only the Spec's **7 blocks** (not the Proposal's 13 sections).
- No projects have been started. This is a **boilerplate** to build on: working shell + catalogue pipeline + placeholder content, not finished project documentation.

## Top-Level Overview

Turn the current create-next-app starter into a static-first technical-publication site:

- Next.js 16.4.4 App Router, TypeScript strict, Tailwind v4, `output: "export"` (already configured). No database, no server runtime.
- `content/projects.yaml` is the registry, parsed with `yaml` and validated with Zod at build time; invalid data fails `npm run build` and CI.
- Long-form project records are MDX in `content/projects/<slug>.mdx`, compiled at build time (`@next/mdx`).
- Visual language per Spec §1: flat, dense typography, 1px borders, monospace accents. No shadows, gradients, glow, 3D tilt, or buzzword heroes.
- Only client JS: the `/explore` filter component (and an optional lazy Mermaid renderer). Everything else is server-rendered to static HTML.

### Repo facts (verified)

- `package.json`: next 16.4.4, react 19.3.0, tailwindcss ^4, `@tailwindcss/turbopack` ^4, eslint ^9. Scripts: dev/build/start/lint. No zod, yaml, MDX, or test runner.
- `next.config.mjs`: `output: "export"` plus a Turbopack rule that runs `*.css` through `@tailwindcss/turbopack`. There is no `postcss.config.*`. Keep this setup.
- `app/`: only `layout.tsx` (Geist fonts via `next/font/google`), `page.tsx` (starter), `globals.css` (`@import "tailwindcss"`, `@theme inline`), `favicon.ico`. `tsconfig` alias `@/*` → repo root. `.nvmrc` = 24.
- `AGENTS.md`: this Next.js version has breaking changes. Read `node_modules/next/dist/docs/` before writing code.
  - Dynamic-route `params` is a `Promise` and must be awaited.
  - With `output: "export"`, dynamic routes need `generateStaticParams` and `dynamicParams = false`. Without them the build fails.
  - `docs/01-app/02-guides/mdx.md`: Turbopack needs MDX plugins given as **string names** with serialisable options. Function plugins don't work. Dynamic MDX import pattern: `await import(\`@/content/${slug}.mdx\`)` with an explicit `.mdx` extension.
  - Also check `02-guides/static-exports.md` and `generate-static-params.md`.

### Assumptions to flag (derived from the two docs)

- **9 labs** come from Proposal §3.1. Slugs: `ai-ml`, `distributed-systems`, `databases-storage`, `cloud-infrastructure`, `networking`, `system-design`, `programming-languages-cs`, `reverse-engineering`, `observability`.
- Seed data (user decision): only the **3 flagships** from Proposal §11.3 — R001 ResNet from Scratch (`ai-ml`, reproduction, Python/PyTorch, ref arxiv 1512.03385), S001 URL Shortener (`system-design`, recreation, Go/PostgreSQL, no paper reference), R003 Transformer from Scratch (`ai-ml`, reproduction, Python/PyTorch, ref arxiv 1706.03762). All status `PLANNED` (user has started none). The remaining 13 catalogue entries are added later by editing `projects.yaml`.
- Because S001 has no paper reference, `references` must be allowed to be an empty array.
- **Status** enum is the Spec's five values (`PLANNED | RESEARCH | IN-PROGRESS | EXPERIMENTAL | COMPLETED`). The Proposal's MAINTENANCE and ARCHIVED are omitted.
- **Schema** = Spec §4 fields: `id, title, slug, category, classification[], status, languages[], frameworks[], references[], repository`. Optional extras from Proposal §5.4: `difficulty`, `tags`, `featured`, `demo`, `summary`.
- `repository` URLs use the provisional org `rebuild-lab` (the name is provisional per Proposal). Centralise the org handle in one constant/config.
- The Spec's "4GB VRAM" and the Proposal's "RTX 3050 4 GB, 12 GB RAM" agree. Use them on `/about`.
- Date shown in the Proposal is 2 Nov 2026 and the Proposal is "Version 1.0". Footer can show version `1.0`.

---

## Sub-Task 1 — Dependencies, tooling, config

**Intent:** Install what the Spec requires and wire build-time validation and tests, so later sub-tasks only write app code.

**Expected Outcomes:**
- `npm run typecheck`, `lint`, `validate:content`, `test`, `build` all exist and run.
- MDX files compile under Turbopack + static export.

**Todo List:**
1. Add dependencies: `zod`, `yaml`, `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`.
2. Add dev dependencies: `vitest`, `tsx` (runs the validate script).
3. Add scripts: `typecheck` (`tsc --noEmit`), `validate:content` (`tsx scripts/validate-content.ts`), `test` (`vitest`).
4. Update `next.config.mjs`: wrap with `createMDX`, add `pageExtensions` including `md`/`mdx`, keep `output: "export"` and the Turbopack CSS rule. If plugins are used, pass them as string names (e.g. `remark-gfm`).
5. Add root `mdx-components.tsx` (required by `@next/mdx` in App Router) mapping markdown elements to the design-system styles (tables, code, headings, links).
6. Add `vitest.config.ts` (alias `@/`). Confirm exact install/config steps against `node_modules/next/dist/docs/01-app/02-guides/mdx.md` first.

**Relevant Context:** `package.json`, `next.config.mjs`, `tsconfig.json`, `eslint.config.mjs`, `node_modules/next/dist/docs/01-app/02-guides/mdx.md`.

**Status:** [x] done

**Completion notes / context for Sub-Task 2+:**
- Installed: `zod` 4.x, `yaml`, `@next/mdx` 16.4.5, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, `remark-gfm` (extra, needed for benchmark tables in MDX); dev: `vitest` 5.1, `tsx`. `@types/node` was bumped `^20` → `^24` because vitest 5 has a peer conflict with `@types/node@20` (matches `.nvmrc` Node 24).
- `zod` is v4: use the v4 API (`z.enum`, `z.url()`, `.superRefine`/`.check`; error shape is `error.issues`). Check v4 docs before writing `lib/schema.ts`.
- Scripts added: `typecheck`, `validate:content` (points at `scripts/validate-content.ts`, which does **not exist yet**; created in Sub-Task 3), `test` (`vitest`; use `npm test -- --run` for one-shot).
- `next.config.mjs`: wrapped with `createMDX`, `pageExtensions` includes `md`/`mdx`, `output: "export"` and the Turbopack `*.css` rule kept. `remarkPlugins: ["remark-gfm"]` is passed as a **string name** (Turbopack requirement). Verified with a throwaway `app/*/page.mdx` probe: a GFM table compiled, rendered via `mdx-components.tsx`, and exported statically. The probe was deleted. Any new plugins must also be string names.
- `mdx-components.tsx` (repo root) maps h2/h3/p/ul/ol/a/code/pre/table/th/td to flat styles using `border-current/20` as a placeholder border. In Sub-Task 2, switch these to the real design tokens. It exports `useMDXComponents()` with no args, per the Next 16 docs. Sub-Task 5 adds `Mermaid` here.
- `vitest.config.mts` (`.mts` avoids a Vite CJS/ESM config warning): node environment, `@` alias → repo root, `passWithNoTests: true`, includes `**/*.test.{ts,tsx}`. No tests exist yet.
- Gotcha: the first `npm install vitest` left `@rolldown/binding-darwin-arm64` missing (npm optional-deps bug; "Cannot find native binding"). Fixed by deleting `node_modules` and `package-lock.json` and reinstalling. If it recurs, repeat that.
- Verified passing: `npm run typecheck`, `npm run lint`, `npm test -- --run` (no tests, exit 0), `npm run build` (still the starter page). `validate:content` was not run (script not yet created).
- Note: `public/*.svg` starter files and `app/page.tsx` still exist; they are removed in Sub-Task 2.

---

## Sub-Task 2 — Design tokens and site shell

**Intent:** Establish the flat, high-density visual system and the shared page shell (Spec §1).

**Expected Outcomes:**
- Starter page and `public/*.svg` boilerplate gone.
- Every route shares a header, footer, and typographic scale, with no shadows or gradients.

**Todo List:**
1. Rewrite `app/globals.css`: colour tokens in `@theme` (neutral background/foreground, one muted accent, border colour), 1px border utility conventions, dense base type scale, tabular numerals, monospace for IDs, status, and metadata. Light/dark via `prefers-color-scheme` as now (keep unless simpler).
2. Update `app/layout.tsx`: metadata (title template, description), fonts (keep Geist Sans/Mono via `next/font/google` or switch to system stack, which avoids a build-time network dependency), shell structure.
3. Components in `components/`: `SiteHeader` (wordmark, Explore, Laboratories → link to a lab or anchor on `/`, About, Contribute), `SiteFooter` (GitHub org, contribute link, licence note, version), `StatusBadge`, `ClassificationBadge`, `PageHeading`, `DataTable` styles/primitives. The header must link only to the six spec routes. Since `/labs` is not a route, "Laboratories" links to the home page lab index section (`/#laboratories`).
4. Delete `app/page.tsx` starter content (replaced in Sub-Task 4) and unused `public/*.svg`.

**Relevant Context:** `app/layout.tsx`, `app/globals.css`, Spec §1; Proposal §5.2 (header/footer contents), §4.4.

**Status:** [x] done

**Completion notes / context for Sub-Task 3+:**
- `lib/site.ts` exports `GITHUB_ORG` (`"rebuild-lab"`) and `SITE` (`name`, `tagline`, `version` `"1.0"`, `githubOrg`, `githubUrl`). Use `GITHUB_ORG` for `repository` URLs in `projects.yaml`. YAML can't import it, so keep the value in sync by hand or add a validate check.
- Fonts: switched to a **system font stack** (defined in `globals.css` `@theme inline` as `--font-sans`/`--font-mono`). `next/font/google` and Geist are removed, so there is no build-time network dependency. `font-mono` is the Tailwind utility for IDs, status and metadata.
- Tokens in `globals.css` (`:root`, dark variants under `prefers-color-scheme`): `--background, --foreground, --muted, --surface, --border, --accent`, exposed as Tailwind utilities `bg-background, text-foreground, text-muted, bg-surface, border-border, text-accent`. A base layer sets the default border colour of all elements to `--border`, so a bare `border`, `border-b` or `border-t` is already themed. Base font size is 15px and `tabular-nums` applies globally. No shadows or gradients.
- `app/layout.tsx`: `title.template` is `"%s | Rebuild Lab"` with a default title. Child pages only set `title: "Explore"`, etc. Shell is `SiteHeader`, then `<main class="mx-auto max-w-5xl px-4 py-8">`, then `SiteFooter`. Pages must NOT add their own `<main>` or outer container. They render content directly.
- `components/`:
  - `SiteHeader`: wordmark → `/`; nav links Explore `/explore`, Laboratories `/#laboratories`, About `/about`, Contribute `/contribute`.
  - `SiteFooter`: version, "Code: MIT · Docs: CC BY 4.0", the GitHub org link, and a contribute link.
  - `StatusBadge`: exports `STATUSES` (the 5 values), the type `Status`, and the component (prop `status`). `ClassificationBadge`: exports `CLASSIFICATIONS`, the type `Classification`, and the component (prop `classification`).
  - `lib/schema.ts` (Sub-Task 3) could derive its enums from these arrays, or the components could import types from the schema. Pick one source of truth. The components currently own the arrays.
  - `PageHeading` takes `title`, optional `eyebrow`, and optional children (rendered as a muted description paragraph). It renders the page `<h1>`.
  - `DataTable.tsx` exports `DataTable` (wraps `<table>` in an overflow-x div), `Th` and `Td`. `mdx-components.tsx` now uses them, so MDX tables match the registry tables.
- `app/page.tsx` is a minimal placeholder (PageHeading plus an empty `<section id="laboratories">` so the `/#laboratories` anchor resolves). Sub-Task 4 replaces it and should keep `id="laboratories"` on the lab index.
- `public/*.svg` deleted (nothing referenced them). `public/` is now empty.
- `mdx-components.tsx` now uses the tokens (`border`, `bg-surface`, `text-accent`). Sub-Task 5 still adds `Mermaid`.
- Verified passing with no warnings: `npm run typecheck`, `npm run lint`, `npm test -- --run` (still no tests), `npm run build` (routes `/`, `/_not-found`; `out/index.html` links only to the six spec routes plus the GitHub org).

---

## Sub-Task 3 — Content layer: schema, labs, registry, validation

**Intent:** The registry pipeline is the heart of the site. Build it strictly and testably.

**Expected Outcomes:**
- `content/projects.yaml` with 3 PLANNED flagship entries parses and validates.
- Invalid YAML (bad enum, duplicate id/slug, unknown category) fails `validate:content` and `build`.
- Typed accessors power every page.

**Todo List:**
1. `lib/labs.ts`: static list of the 9 labs (slug, name, scope, example work from Proposal §3.1).
2. `lib/schema.ts`: Zod schema per the Assumptions above. `category` is an enum derived from the labs list. `classification` is a non-empty subset of `reproduction | recreation | original-work`. `status` is the 5-value enum. `references` are URLs, and `repository` is a URL. Add a whole-file refinement: unique `id`, unique `slug`, URL-safe slug regex.
3. `lib/projects.ts`: server-only loader (reads YAML with `fs`, parses with `yaml`, validates with Zod, throws with a readable message), and `getProjects()`, `getProject(slug)`, `getProjectsByLab(slug)`, `getFeatured()`, `getMdxSlugs()` (which slugs have `content/projects/<slug>.mdx`).
4. `content/projects.yaml`: 3 entries (R001, S001, R003) per the Assumptions above, with references taken from Proposal §11.2 only (no invented URLs). Mark R001 `featured: true` (first research flagship).
5. `scripts/validate-content.ts`: runs the loader, prints errors, exits non-zero on failure.
6. Unit tests (`lib/schema.test.ts`): accepts a valid entry; rejects invalid status, unknown category, empty classification, duplicate ids/slugs.

**Relevant Context:** Spec §4; Proposal §3.1, §5.4, §10.3, §11, §11.2.

**Status:** [x] done

**Completion notes / context for Sub-Task 4+:**
- `lib/taxonomy.ts` is the single source of truth for `STATUSES`/`Status` and `CLASSIFICATIONS`/`Classification`. It is dependency-free, so client components can import it without pulling in zod. `StatusBadge.tsx` and `ClassificationBadge.tsx` now import and re-export from it, so existing imports from the components still work. `lib/schema.ts` builds its Zod enums from it.
- `lib/labs.ts` exports `LABS` (9 entries: `slug, name, scope, examples[]`), the `Lab` and `LabSlug` types, `LAB_SLUGS` (tuple used for the `category` enum) and `getLab(slug)`. Safe to import from client code. Use `LABS` for `generateStaticParams` in `/labs/[slug]` and for the home-page lab index.
- `lib/schema.ts` exports `projectSchema` (a `z.strictObject`, so unknown keys are rejected), `projectsFileSchema` (an array schema with a `.check` that enforces unique `id`, unique `slug`, and `repository` starting with `https://github.com/<GITHUB_ORG>/` taken from `lib/site.ts`), the `Project` type, `formatIssues(error)`, and the `ID_PATTERN`, `SLUG_PATTERN`, `DIFFICULTIES` and `REPOSITORY_PREFIX` constants.
  - `id` matches `^[A-Z]\d{3}$` and `slug` is kebab-case.
  - `references` may be `[]`. URLs use `z.httpUrl()` (zod v4).
  - Optional fields: `difficulty` (`foundational|intermediate|advanced`), `tags`, `featured`, `demo` (nullable), `summary`.
  - `languages` has at least 1 entry. `frameworks` may be empty.
  - `Project` is the inferred type; `languages` and `frameworks` are free-text strings (e.g. `Python`, `PyTorch`, `PostgreSQL`).
- `lib/projects.ts` (server-only by comment, no `server-only` package) uses `node:fs`, `process.cwd()` and relative imports. It works under `next build` and `tsx`. Exports: `loadProjects(file?)` (uncached; throws `ContentError` with one issue per line), `getProjects()` (cached), `getProject(slug)`, `getProjectsByLab(labSlug)`, `getFeatured()`, `getMdxSlugs()` (sorted slugs of `content/projects/*.mdx`; returns `[]` if the dir is missing), and `ContentError`. Never import it from a client component. Pass data to client components as props, e.g. `ExploreTable` in Sub-Task 4.
- `content/projects.yaml` has the 3 seed entries (R001 featured, S001, R003), all `PLANNED`. S001 has `references: []` and `frameworks: [PostgreSQL]`. Entries use `languages: [Python]`/`[Go]` and `frameworks: [PyTorch]`/`[PostgreSQL]`. There are no `difficulty`, `tags`, `demo` or `summary` values yet; the optional fields are unused, so pages must handle their absence.
- `scripts/validate-content.ts` calls `loadProjects()`, prints `content OK: N projects validated`, and exits 1 with readable errors on failure. The repository-org check lives in the schema, so it applies to the build too. The orphan-MDX check (every `content/projects/*.mdx` maps to a registry slug) is deliberately left for Sub-Task 5 (item 6).
- `lib/schema.test.ts`: 20 tests. They cover a valid entry, empty `references`, invalid status, unknown category, empty and unknown classification, bad slugs, bad id, non-URL repository, unknown keys, duplicate ids, duplicate slugs, wrong-org repository, and 9 unique labs.
- Verified passing with no warnings: `npm run typecheck`, `npm run lint`, `npm test -- --run` (20 tests), `npm run validate:content`, `npm run build`.
- Verified with a throwaway `app/probe/page.tsx` (deleted): the loader and all accessors work in the static export build (`getProjects` returns 3, `getFeatured` returns R001, `getProjectsByLab("ai-ml")` returns R001 and R003). With an invalid status in the YAML, both `validate:content` and `build` exit 1 (the file was then restored). Duplicate slug and wrong-org repository errors were also confirmed on `validate:content`.
- Gotcha for Sub-Task 4: `next build` only fails on bad YAML once some page imports `lib/projects`. The current placeholder `app/page.tsx` does not, so right now the build doesn't read the registry. The home page, `/explore` and the `generateStaticParams` pages in Sub-Task 4 will enforce it. CI should also run `validate:content` (Sub-Task 7).
- Gotcha: `getProjects()` caches in module scope, so editing `projects.yaml` during `next dev` needs a server restart to be picked up.
- Unlike the Proposal §5.4 sample (lowercase `in-progress`, a single `reference` object), the registry uses the Spec's uppercase status values and a `references` URL array.

---

## Sub-Task 4 — Home, `/explore`, `/labs/[slug]`

**Intent:** Discovery pages that read purely from the registry.

**Expected Outcomes:**
- `/` has hero, flagship feature, domain overview, and latest projects table (Spec §3).
- `/explore` is a full registry table with client-side filters: Domain, Status, Classification, Stack.
- `/labs/[slug]` is statically generated for all 9 labs.

**Todo List:**
1. `app/page.tsx`: concise hero (mission/tagline from Proposal §2.1, link to `/explore`), featured project block (status, category, stack, repository link), 9-lab index with `id="laboratories"`, and a compact table of projects (status-labelled). There are no "commits" data source yet, so use the registry as the "latest projects" table.
2. `app/explore/page.tsx` (server): load the projects and render `components/ExploreTable.tsx` (client) with the project data as props. The client component holds filter state, renders the dense table, and has a "no results" state. Keep filtering logic as a small pure function in `lib/filter.ts` for unit testing.
3. `app/labs/[slug]/page.tsx`: `generateStaticParams` from the labs list, `dynamicParams = false`, `await params`, `generateMetadata`. It shows the lab scope, example work, and its projects table.
4. Unit test for `lib/filter.ts`.

**Relevant Context:** Spec §3 table; Proposal §3.1, §5.2; `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`.

**Status:** [x] done

**Completion notes / context for Sub-Task 5+:**
- `lib/filter.ts` is pure and has no zod, so client code can import it. It exports the `ProjectRow` type (plain fields: `id, title, slug, category, classification[], status, languages[], frameworks[]`), `Filters`, `EMPTY_FILTERS`, `filterProjects(rows, filters)`, `stackOf(row)` and `stackOptions(rows)`. An empty string means "any". Filters combine with AND. Stack matching is an exact, case-insensitive match against languages plus frameworks. `lib/filter.test.ts` has 9 tests, so the suite is now 29.
- `lib/rows.ts` exports `toRow(project)`, which turns a registry `Project` into a `ProjectRow`. Use it for any server-to-client or table data.
- `components/ProjectsTable.tsx` is the shared registry table (columns ID, Title, Domain, Classification, Status, Stack). It has no hooks, so it renders on the server for `/` and `/labs/[slug]` and inside the client `ExploreTable`. Title links go to `/projects/<slug>`, and Domain links go to `/labs/<slug>`.
- `components/ExploreTable.tsx` (`'use client'`) is the only client JS added. It holds the filter state in 4 native `<select>`s (Domain from `LABS`, Status from `STATUSES`, Classification from `CLASSIFICATIONS`, Stack from `stackOptions`), a Reset button, an `aria-live` "N of M projects" count, and a dashed "No projects match" state with a Clear filters button.
- `app/page.tsx`: hero (`PageHeading` with `SITE.tagline`, plus an "Explore the registry" link), the featured project block (`getFeatured()[0]`; rendered only if one exists; shows `summary` only if set), the 9-lab index with `id="laboratories"` (each card shows scope and project count) and a Projects table of all registry entries.
- `app/explore/page.tsx` is a server page with static `metadata`. `app/labs/[slug]/page.tsx` has `dynamicParams = false`, `generateStaticParams` from `LABS`, an awaited `params`, `generateMetadata` (lab name and scope), example-work tags, the projects table, and a dashed "No projects yet in this laboratory" state (shown for 7 of 9 labs now). `notFound()` is a safety net only.
- Verified with no warnings: `npm run typecheck`, `npm run lint`, `npm test -- --run` (29 tests), `npm run validate:content`, `npm run build`. `out/` has `index.html`, `explore.html`, and 9 `labs/<slug>.html` files. `out/index.html` links only to `/`, `/explore`, `/about`, `/contribute`, `/labs/*` and the 3 `/projects/*` slugs (those pages do not exist until Sub-Task 5; the build does not fail on them). `/about` and `/contribute` are also unbuilt until Sub-Task 6.
- Pages now import `lib/projects`, so `next build` enforces registry validation.
- For Sub-Task 5: reuse `getProject(slug)`, `getProjects()` and `getMdxSlugs()` from `lib/projects`. Use `getLab(project.category)` for the lab name and link, and the same `generateStaticParams` / `dynamicParams = false` / awaited `params` pattern as `app/labs/[slug]/page.tsx`. The badge, table and heading primitives exist in `components/`. Any new `mdx-components.tsx` entries must keep using the string-name plugin constraint.

---

## Sub-Task 5 — `/projects/[slug]` with the 7-block structure and MDX

**Intent:** The canonical project engineering record (Spec §5), working for stubs and for real MDX content.

**Expected Outcomes:**
- Every registry project has a statically generated page.
- Each page renders the 7 blocks in order: Header & Status, Problem & Objectives, Scope & Exclusions, Architecture & Data Flow, Benchmark & Evidence, Deviations & Failure Log, Reproducibility Commands.
- A sample MDX file demonstrates authoring; projects without MDX show "Not yet documented" per block.

**Todo List:**
1. `app/projects/[slug]/page.tsx`: `generateStaticParams`, `dynamicParams = false`, `await params`, `generateMetadata`.
2. Block 1 is generated from YAML: classification badge, stable ID, status, source (repository) link, reference links, languages, frameworks.
3. Blocks 2–7: MDX-driven. Define a convention (the plan's recommendation: one MDX file per project, with the six `##` headings fixed to the Spec names, in a fixed order, plus a lint-style check in `validate:content` that any existing MDX contains exactly these headings in order). Stub projects with no MDX render the six block headings with a muted "Not yet documented" line.
4. Add `content/projects/resnet-from-scratch.mdx` (R001) as the authoring template: placeholder text for each block, a sample benchmark table (p50/p95/p99, VRAM, throughput columns with empty or `—` values — no invented numbers), a Mermaid fenced block placeholder, and a reproducibility command block.
5. Mermaid: minimal `components/Mermaid.tsx` client component that dynamically imports `mermaid` only when rendered, so pages without diagrams ship no extra JS. Register in `mdx-components.tsx`. If this proves awkward with Turbopack + MDX, fall back to rendering the diagram source as a code block and note it in the plan.
6. Add a test or validate-script check that every `content/projects/*.mdx` maps to a registry slug.

**Relevant Context:** Spec §5; Proposal §5.3, §10.2 (evidence standard: state methodology, units, percentile definitions); mdx guide "Using dynamic imports"; `lib/projects.ts` `getMdxSlugs()`.

**Status:** [x] done

**Completion notes / context for Sub-Task 6+:**
- `app/projects/[slug]/page.tsx`: `dynamicParams = false`, `generateStaticParams` from `getProjects()`, awaited `params`, `generateMetadata` (title `"<ID> <Title>"` under the layout template; description is `summary` or a generated line from classification, lab and status). No own `<main>`.
- Block 1 "Header & Status" is a `<dl>` generated from the YAML: ID, classification badges, status badge, laboratory link, source (repository) link, reference links (or "None"), languages, frameworks (or "None"). The page renders it, not the MDX.
- Blocks 2-7: the page does `getMdxSlugs().includes(slug) ? (await import(\`@/content/projects/${slug}.mdx\`)).default : null`. The explicit `.mdx` extension and the `@/content` alias work under Turbopack and the static export. Without an MDX file, the page renders the six `##` headings from `MDX_BLOCKS` with a muted "Not yet documented." line each.
- MDX convention: `content/projects/<slug>.mdx` contains exactly six `##` headings, in this order: Problem & Objectives, Scope & Exclusions, Architecture & Data Flow, Benchmark & Evidence, Deviations & Failure Log, Reproducibility Commands. Use `###` for sub-headings. No `#` title and no block 1 in the MDX, since the page supplies those.
- `lib/content-check.ts` is pure (no fs, no zod): `MDX_BLOCKS`, `extractH2Headings(mdx)` (ignores fenced code), `checkHeadings(headings)` (missing, unexpected, duplicate, wrong order), `findOrphanMdx(mdxSlugs, registrySlugs)`. `lib/content-check.test.ts` has 11 tests, so the suite is now 40. `lib/projects.ts` adds `getMdxIssues()`, which `scripts/validate-content.ts` calls. It fails on an orphan MDX file or bad headings, and prints `content OK: 3 projects validated, 1 MDX records checked`.
- `content/projects/resnet-from-scratch.mdx` is the authoring template: a leading `{/* */}` comment with the rules, placeholder text per block, a `mermaid` fence, a benchmark table (p50/p95/p99 and unit columns; rows Latency, VRAM draw, Throughput; every value `—`, no invented numbers), a "### Methodology" sub-section listing what Proposal §10.2 requires per result (environment, workload, tool/version, number of runs, aggregation, units, which percentile), and a bash reproducibility block. S001 and R003 have no MDX, so they use the fallback.
- Mermaid: `components/Mermaid.tsx` (`'use client'`, prop `chart`). It always server-renders the diagram source in a `<pre data-mermaid-source>`. After mount it does `await import("mermaid")`, calls `mermaid.render` with `securityLevel: "strict"` (theme follows `prefers-color-scheme`), and swaps in the SVG. Any failure (no JS, load error, bad syntax) leaves the source visible, so the static HTML is unaffected. Chosen approach: a plain ` ```mermaid ` fence in MDX. The `pre` override in `mdx-components.tsx` detects `<code className="language-mermaid">` and renders `<Mermaid chart=...>`, so no remark/rehype plugin is needed. `<Mermaid chart={\`...\`} />` is also registered as an MDX component. The fence path needs the `code` child to be a plain string.
- Bundle check: the mermaid library (~1.5 MB chunks) is async. Those chunks are not in any page's `<script>` list; only a 1.2 KB wrapper chunk is referenced, and it holds the `Mermaid` component. The library is fetched only after `<Mermaid>` mounts on a page that has a diagram. The browser SVG render itself was not exercised in this sub-task (static output only). Check it in a browser once (`npm run dev`, open `/projects/resnet-from-scratch`).
- `mermaid` ^12.3.0 added to dependencies. The rolldown native-binding gotcha from Sub-Task 1 recurred after `npm install mermaid` (vitest could not start); fixed again with `rm -rf node_modules package-lock.json && npm install`.
- Verified with no warnings: `npm run typecheck`, `npm run lint`, `npm test -- --run` (40 tests), `npm run validate:content`, `npm run build`. Routes now include `/projects/resnet-from-scratch`, `/projects/url-shortener`, `/projects/transformer-from-scratch`. In `out/projects/`, each page has 7 `<h2>`s (Header & Status plus the six blocks in order). The R001 page has no "Not yet documented" text, shows the methodology note and the `—` table cells, and carries the diagram source fallback. S001 and R003 show the "Not yet documented." fallback in all 6 blocks (the string appears twice per block in the HTML because of the RSC payload).
- For Sub-Task 6: `/about` and `/contribute` are still not built, and the header, footer and `out/index.html` link to them. Use `PageHeading` and plain TSX with section headings styled like here (`border-b`, `text-lg font-semibold`). Do not add own `<main>`.

---

## Sub-Task 6 — `/about` and `/contribute`

**Intent:** Static charter pages with the content the Spec requires.

**Expected Outcomes:**
- `/about`: operating principles, local hardware constraint disclosure (4 GB VRAM GPU), evidence standards.
- `/contribute`: contribution lifecycle, issue taxonomy, reproduction gates, licensing expectations.

**Todo List:**
1. `app/about/page.tsx`: operating principles (Proposal §2.4), scope boundaries (§3.2), hardware disclosure (§7.4: Windows laptop, 12 GB RAM, RTX 3050 laptop GPU with 4 GB VRAM, and the recording requirements), evidence standard (§10.2).
2. `app/contribute/page.tsx`: lifecycle phases 0–10 (§9), classification-specific workflows (§9.1–9.3), issue taxonomy (derive from classification and status; mark clearly as a draft where the Proposal gives none), reproduction gates (§9.1 bullets), licensing (§14.2: MIT code, CC BY 4.0 docs), security contact placeholder.
3. Author as `.mdx` pages or plain TSX. Prefer TSX with shared primitives to keep it simple.

**Relevant Context:** Proposal §2.4, §3.2, §7.4, §9, §10.2, §14.

**Status:** [x] done

**Completion notes / context for Sub-Task 7+:**
- `app/about/page.tsx` (static `metadata`: title `About`, description; heading "Charter & Baseline"). Sections with ids: `#principles` (Proposal §2.4, all 9 principles in a `DataTable`), `#scope` (§3.2 scope boundaries and the do-not-publish list), `#hardware` (§7.4: Windows laptop with VS Code, 12 GB RAM, RTX 3050 laptop GPU, 4 GB VRAM; the experiment sizing list, the practice bullets, and the seven recorded-per-run fields as tags: Hardware, Driver, CUDA / PyTorch versions, Batch size, Precision, Seed, Runtime), `#evidence` (§10.2: the 8 required statements and 5 rules). Text is taken from the Proposal and not extended.
- `app/contribute/page.tsx` (static `metadata`: title `Contribute`; heading "Standards & Protocols"). Sections with ids: `#lifecycle` (§9, phases 0-10 table with activity and required output/gate), `#workflows` (§9.1 reproduction and §9.2 recreation as numbered lists, §9.3 original work as a paragraph, each with a `ClassificationBadge`), `#taxonomy` (clearly marked DRAFT, with a dashed note that the Proposal gives none; label groups `classification:*`, `status:*`, `lab:*` are built from `CLASSIFICATIONS`, `STATUSES` and `LABS`, so they stay in sync with the registry), `#gates` (§9.1 bullets restated as gates, plus links to `/about#evidence` and `/about#hardware`; the "gates" framing is a light restatement, not a separate list in the Proposal), `#licensing` (§14.2: MIT code, CC BY 4.0 docs, licence file in every repo, third-party licences retained, and the 5 rules), `#security` (placeholder naming `SECURITY.md` per repository and the org link from `SITE.githubUrl`; no email address invented; §14.1 handling bullets).
- Both pages are plain server TSX using `PageHeading`, `DataTable`/`Th`/`Td`, `StatusBadge` and `ClassificationBadge`. No own `<main>` and no client JS. The header nav is unchanged.
- Verified with no warnings: `npm run typecheck`, `npm run lint`, `npm test -- --run` (40 tests, unchanged), `npm run validate:content`, `npm run build` (19 static pages; `/about` and `/contribute` are `○ Static`). `out/about.html` and `out/contribute.html` exist, each with one `<main>` (from the layout) and one `<h1>`. The dev server returns 200 for `/about` and `/contribute`.
- For Sub-Task 7: the README should mention the two charter pages. All internal links from the header, footer and home page now resolve, so an internal-link check over `out/` can be added to the verification step if wanted. Placeholders to revisit later: the issue taxonomy (draft) and the security contact (`SECURITY.md` per repo, no address yet).

---

## Sub-Task 7 — CI, README, final verification

**Intent:** Make the quality gates automatic and the repo self-explanatory.

**Expected Outcomes:**
- `.github/workflows/website-ci.yml` follows the Proposal §13.5 example: checkout, setup-node (use `.nvmrc`, i.e. Node 24 — the Proposal's example says 22 but the repo pins 24), `npm ci`, typecheck, lint, validate:content, test, build.
- README replaces the create-next-app boilerplate with: purpose, scripts, how to add a project (YAML entry + optional MDX), the 7-block convention, deployment target (Vercel or Cloudflare Pages, static export in `out/`).
- All checks pass locally with no warnings.

**Todo List:**
1. Add the workflow file.
2. Rewrite `README.md`.
3. Run `npm run typecheck && npm run lint && npm run validate:content && npm test -- --run && npm run build`, and fix any issues.
4. Confirm `out/` contains HTML for `/`, `/explore`, `/about`, `/contribute`, 9 lab pages, and 3 project pages.
5. Sanity check: break `projects.yaml` (bad status) to confirm the build fails, then revert.

**Relevant Context:** Proposal §13.2, §13.5; `.nvmrc`; existing `out/` and `.next/` (git-ignored build output).

**Status:** [x] done

**Completion notes:**
- `.github/workflows/website-ci.yml`: triggers `pull_request` and `push` to `main`; one `verify` job on `ubuntu-latest` with `actions/checkout@v4`, `actions/setup-node@v4` (`node-version-file: .nvmrc`, `cache: npm`), then `npm ci`, `typecheck`, `lint`, `validate:content`, `npm test -- --run`, `npm run build`. The workflow has not run on GitHub yet (nothing committed or pushed).
- `README.md` rewritten: purpose and stack, the six routes, scripts, adding a project (field table from `lib/schema.ts`, `GITHUB_ORG` repository rule, optional MDX), the 7-block convention, Mermaid fences, deployment (static `out/`, Vercel or Cloudflare Pages), gotchas (rolldown binding fix, dev-server registry cache, build validating YAML only via pages so CI also runs `validate:content`, string-name MDX plugins). It states that the `rebuild-lab` org handle is provisional.
- Full chain passed with no warnings: typecheck, lint, `validate:content` (3 projects, 1 MDX record), 40 tests, build (19 static pages).
- `out/` has HTML for `/`, `/explore`, `/about`, `/contribute`, 9 `labs/<slug>.html` and 3 `projects/<slug>.html` (plus `404.html` and `_not-found.html`). A throwaway internal-link check over all 18 `out/*.html` files (143 internal `href`s, including `#anchor` targets) found 0 broken links. No script was added to the repo.
- Negative check: with `status: BOGUS` on R001, `validate:content` exited 1 and `next build` failed ("Failed to collect page data for /projects/[slug]", with the invalid-status issue). `content/projects.yaml` was restored and `git diff` shows it unchanged. A final rebuild passed.
- Nothing was committed or pushed. Changes are left uncommitted for review.
- Still open: browser check of the Mermaid SVG render and general visual review; the draft issue taxonomy; the security contact; the provisional org handle.

---

## Non-goals (deferred)

`/labs` index, `/research`, `/benchmarks`, `/notes`, `/status`, Pagefind search, Recharts benchmark charts, the Proposal's 13-section template, interactive simulators/demos, `gray-matter` (frontmatter is unnecessary because metadata lives in YAML), project repositories, and the GitHub org itself.
