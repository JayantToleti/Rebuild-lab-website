// Server-only: reads from the filesystem at build time. Do not import from
// client components (the "server-only" package is intentionally not used).
// Uses relative imports and process.cwd() so it works under both `next build`
// and `tsx scripts/validate-content.ts` (both run from the repo root).
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { checkHeadings, extractH2Headings, findOrphanMdx } from "./content-check";
import { formatIssues, projectsFileSchema, type Project } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PROJECTS_YAML = path.join(CONTENT_DIR, "projects.yaml");
const MDX_DIR = path.join(CONTENT_DIR, "projects");

export class ContentError extends Error {
  constructor(
    message: string,
    readonly issues: string[] = [],
  ) {
    super(issues.length ? `${message}\n${issues.map((i) => `  - ${i}`).join("\n")}` : message);
    this.name = "ContentError";
  }
}

let cache: Project[] | undefined;

// Parses and validates the registry. Throws ContentError with a readable message.
export function loadProjects(file: string = PROJECTS_YAML): Project[] {
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (e) {
    throw new ContentError(`Cannot read ${path.relative(process.cwd(), file)}: ${(e as Error).message}`);
  }

  let data: unknown;
  try {
    data = parse(raw);
  } catch (e) {
    throw new ContentError(`Invalid YAML in ${path.relative(process.cwd(), file)}: ${(e as Error).message}`);
  }

  const result = projectsFileSchema.safeParse(data);
  if (!result.success) {
    throw new ContentError(
      `${path.relative(process.cwd(), file)} failed validation:`,
      formatIssues(result.error),
    );
  }
  return result.data;
}

export function getProjects(): Project[] {
  cache ??= loadProjects();
  return cache;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getProjectsByLab(labSlug: string): Project[] {
  return getProjects().filter((p) => p.category === labSlug);
}

export function getFeatured(): Project[] {
  return getProjects().filter((p) => p.featured === true);
}

// Slugs that have a long-form record at content/projects/<slug>.mdx.
export function getMdxSlugs(): string[] {
  if (!fs.existsSync(MDX_DIR)) return [];
  return fs
    .readdirSync(MDX_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -".mdx".length))
    .sort();
}

// Convention problems in content/projects/*.mdx: orphan files (no registry slug)
// and files whose `##` headings are not exactly the six Spec blocks in order.
export function getMdxIssues(): string[] {
  const issues: string[] = [];
  const mdxSlugs = getMdxSlugs();
  const registry = getProjects().map((p) => p.slug);
  for (const slug of findOrphanMdx(mdxSlugs, registry)) {
    issues.push(`content/projects/${slug}.mdx has no matching slug in projects.yaml`);
  }
  for (const slug of mdxSlugs) {
    const src = fs.readFileSync(path.join(MDX_DIR, `${slug}.mdx`), "utf8");
    for (const i of checkHeadings(extractH2Headings(src))) {
      issues.push(`content/projects/${slug}.mdx: ${i}`);
    }
  }
  return issues;
}
