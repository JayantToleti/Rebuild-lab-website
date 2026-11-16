import type { ProjectRow } from "@/lib/filter";
import type { Project } from "@/lib/schema";

// Strip a registry entry to the plain fields the tables render.
export function toRow(p: Project): ProjectRow {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    classification: [...p.classification],
    status: p.status,
    languages: [...p.languages],
    frameworks: [...p.frameworks],
  };
}
