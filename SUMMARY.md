# Rebuild Lab Website — First Edition Summary

Branch: `first_edition`. Built from the *Rebuild Lab Website Requirements Specification* (Spec) and the *Rebuild Lab Founding Proposal* (Proposal). Where they conflict, the Spec wins. The full step-by-step plan and per-task notes are in [`rebuild-lab-website-plan.md`](rebuild-lab-website-plan.md).

## What this is

A static-first technical-publication site, turned from the create-next-app starter into a boilerplate to build on. No projects have been started yet, so the content is seeded placeholders rather than finished documentation.

- Next.js 16.4.4 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4
- `output: "export"`: static HTML, no database, no server runtime
- Registry in `content/projects.yaml`, validated at build time with Zod 4
- Long-form project records in MDX (`content/projects/<slug>.mdx`)
- Flat visual language per Spec §1: 1px borders, dense type, monospace accents, no shadows or gradients

## Decisions made

| Topic | Decision |
|---|---|
| Routes | Only the Spec's six: `/`, `/explore`, `/labs/[slug]`, `/projects/[slug]`, `/about`, `/contribute` |
| Project page | Only the Spec's 7 blocks (not the Proposal's 13 sections) |
| Seed data | 3 flagships, all `PLANNED`: R001 ResNet from Scratch, S001 URL Shortener, R003 Transformer from Scratch |
| Status values | The Spec's five: `PLANNED`, `RESEARCH`, `IN-PROGRESS`, `EXPERIMENTAL`, `COMPLETED` |
| Fonts | System font stack (no build-time network dependency) |

## What was built

### Sub-Task 1 — Tooling
- Added `zod`, `yaml`, `@next/mdx`, `@mdx-js/*`, `remark-gfm`, `vitest`, `tsx`, later `mermaid`.
- Scripts: `typecheck`, `lint`, `validate:content`, `test`, `build`.
- `next.config.mjs` wrapped for MDX; static export and the Tailwind Turbopack rule kept. MDX plugins are given as string names (Turbopack requirement).
- `mdx-components.tsx` and `vitest.config.mts`.

### Sub-Task 2 — Design tokens and shell
- `app/globals.css`: flat colour tokens with dark variants, 15px base size, tabular numerals.
- `lib/site.ts`: site name, tagline, version, GitHub org handle (`rebuild-lab`).
- `components/`: `SiteHeader`, `SiteFooter`, `StatusBadge`, `ClassificationBadge`, `PageHeading`, `DataTable` / `Th` / `Td`.
- Header nav links only to the six spec routes (Laboratories goes to `/#laboratories`).

### Sub-Task 3 — Content layer
- `lib/taxonomy.ts`: single source for status and classification values.
- `lib/labs.ts`: the 9 laboratories.
- `lib/schema.ts`: strict Zod schema. It enforces unique ids and slugs, and that `repository` starts with `https://github.com/rebuild-lab/`.
- `lib/projects.ts`: loader and accessors (`getProjects`, `getProject`, `getProjectsByLab`, `getFeatured`, `getMdxSlugs`, `getMdxIssues`).
- `scripts/validate-content.ts`: exits non-zero on bad data.

### Sub-Task 4 — Discovery pages
- `/`: hero with tagline, featured project, 9-lab index (`#laboratories`), project table.
- `/explore`: client-side filters for Domain, Status, Classification and Stack, with a "no results" state. This is the only app client JS. The filter logic is a pure function in `lib/filter.ts`.
- `/labs/[slug]`: 9 statically generated lab pages, with an empty state for labs without projects.

### Sub-Task 5 — Project pages
- `/projects/[slug]` renders the Spec's 7 blocks. Block 1 (Header & Status) is generated from YAML. Blocks 2–7 come from MDX with exactly six `##` headings in a fixed order. Projects without MDX show "Not yet documented."
- `content/projects/resnet-from-scratch.mdx` is the authoring template. Its benchmark table has `—` in every value cell; no numbers are invented.
- `components/Mermaid.tsx`: lazy client component. The diagram source is in the static HTML, and the `mermaid` library loads only after mount.
- `lib/content-check.ts`: pure checks for orphan MDX files and heading order, wired into `validate:content`.

### Sub-Task 6 — Charter pages
- `/about`: operating principles, scope boundaries, hardware disclosure (Windows laptop, 12 GB RAM, RTX 3050 laptop GPU with 4 GB VRAM), evidence standard.
- `/contribute`: lifecycle phases 0–10, the three workflows, issue taxonomy (marked DRAFT), reproduction gates, licensing (MIT code, CC BY 4.0 docs), security placeholder.

## Verification status

At the end of Sub-Task 6: typecheck, lint, 40 unit tests, `validate:content` and `build` all pass with no warnings. The build produces 19 static pages. Pages were checked via `curl` against the dev server and by inspecting `out/`; they have not been reviewed in a browser. The Mermaid SVG render in a browser is untested.

## Not done yet

- **Sub-Task 7**: `.github/workflows/website-ci.yml`, README rewrite (still the create-next-app boilerplate), final verification run.
- Placeholders to revisit: the draft issue taxonomy, the security contact (`SECURITY.md` per repo, no address yet), and the provisional `rebuild-lab` GitHub org handle.
- Deferred by design: `/labs` index, `/research`, `/benchmarks`, `/notes`, `/status`, search, Recharts charts, demos, and the remaining 13 catalogue projects.

## Gotchas

- After some `npm install` runs, vitest fails with a missing `@rolldown/binding-darwin-arm64` (npm optional-dependency bug). Fix: `rm -rf node_modules package-lock.json && npm install`.
- `next build` only validates `projects.yaml` through pages that import `lib/projects`; CI should also run `npm run validate:content`.
- `getProjects()` caches in module scope, so editing `projects.yaml` during `next dev` needs a server restart.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck && npm run lint && npm run validate:content && npm test -- --run && npm run build
```

Static output goes to `out/` (deployable to Vercel or Cloudflare Pages).
