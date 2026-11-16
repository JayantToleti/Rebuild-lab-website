import { z } from "zod";
import { LAB_SLUGS } from "./labs";
import { GITHUB_ORG } from "./site";
import { CLASSIFICATIONS, STATUSES } from "./taxonomy";

export const ID_PATTERN = /^[A-Z]\d{3}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DIFFICULTIES = ["foundational", "intermediate", "advanced"] as const;

export const REPOSITORY_PREFIX = `https://github.com/${GITHUB_ORG}/`;

export const projectSchema = z.strictObject({
  id: z.string().regex(ID_PATTERN, "id must be one letter + 3 digits, e.g. R001"),
  title: z.string().trim().min(1),
  slug: z
    .string()
    .regex(SLUG_PATTERN, "slug must be lowercase kebab-case (a-z, 0-9, hyphens)"),
  category: z.enum(LAB_SLUGS),
  classification: z
    .array(z.enum(CLASSIFICATIONS))
    .min(1, "classification must contain at least one value")
    .refine((v) => new Set(v).size === v.length, "classification values must be unique"),
  status: z.enum(STATUSES),
  languages: z.array(z.string().trim().min(1)).min(1),
  frameworks: z.array(z.string().trim().min(1)),
  // May be empty: e.g. a software recreation with no paper reference.
  references: z.array(z.httpUrl()),
  repository: z.httpUrl(),
  // Optional extras (Proposal §5.4).
  difficulty: z.enum(DIFFICULTIES).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  featured: z.boolean().optional(),
  demo: z.httpUrl().nullable().optional(),
  summary: z.string().trim().min(1).optional(),
});

export type Project = z.infer<typeof projectSchema>;

// Whole-file schema: per-entry validation plus cross-entry rules.
export const projectsFileSchema = z.array(projectSchema).check((ctx) => {
  const ids = new Map<string, number>();
  const slugs = new Map<string, number>();
  ctx.value.forEach((p, i) => {
    const firstId = ids.get(p.id);
    if (firstId !== undefined) {
      ctx.issues.push({
        code: "custom",
        message: `duplicate id "${p.id}" (first used at index ${firstId})`,
        input: p.id,
        path: [i, "id"],
      });
    } else {
      ids.set(p.id, i);
    }
    const firstSlug = slugs.get(p.slug);
    if (firstSlug !== undefined) {
      ctx.issues.push({
        code: "custom",
        message: `duplicate slug "${p.slug}" (first used at index ${firstSlug})`,
        input: p.slug,
        path: [i, "slug"],
      });
    } else {
      slugs.set(p.slug, i);
    }
    if (!p.repository.startsWith(REPOSITORY_PREFIX)) {
      ctx.issues.push({
        code: "custom",
        message: `repository must start with ${REPOSITORY_PREFIX} (GITHUB_ORG in lib/site.ts)`,
        input: p.repository,
        path: [i, "repository"],
      });
    }
  });
});

// Human-readable, one issue per line: "[2].status: Invalid option ...".
export function formatIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path
      .map((seg, i) => (typeof seg === "number" ? `[${seg}]` : i === 0 ? String(seg) : `.${String(seg)}`))
      .join("");
    return `${path || "(root)"}: ${issue.message}`;
  });
}
