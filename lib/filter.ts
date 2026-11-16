// Pure filter logic for /explore. No I/O and no zod, so it is safe in client code.
import type { Classification, Status } from "./taxonomy";

// Plain, serialisable subset of a registry entry passed to the client.
export type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  classification: Classification[];
  status: Status;
  languages: string[];
  frameworks: string[];
};

// An empty string means "any" for that dimension.
export type Filters = {
  domain: string;
  status: string;
  classification: string;
  stack: string;
};

export const EMPTY_FILTERS: Filters = {
  domain: "",
  status: "",
  classification: "",
  stack: "",
};

export function stackOf(row: Pick<ProjectRow, "languages" | "frameworks">): string[] {
  return [...row.languages, ...row.frameworks];
}

export function filterProjects(rows: readonly ProjectRow[], f: Filters): ProjectRow[] {
  const stack = f.stack.toLowerCase();
  return rows.filter(
    (r) =>
      (!f.domain || r.category === f.domain) &&
      (!f.status || r.status === f.status) &&
      (!f.classification || r.classification.some((c) => c === f.classification)) &&
      (!stack || stackOf(r).some((s) => s.toLowerCase() === stack)),
  );
}

// Distinct, sorted languages and frameworks across all rows.
export function stackOptions(rows: readonly ProjectRow[]): string[] {
  return [...new Set(rows.flatMap(stackOf))].sort((a, b) => a.localeCompare(b));
}
