import type { Classification } from "@/lib/taxonomy";

// Re-exported so existing importers keep working; the source of truth is lib/taxonomy.ts.
export { CLASSIFICATIONS } from "@/lib/taxonomy";
export type { Classification } from "@/lib/taxonomy";

export function ClassificationBadge({
  classification,
}: {
  classification: Classification;
}) {
  return (
    <span className="inline-block border px-1.5 py-px font-mono text-xs leading-tight text-muted">
      {classification}
    </span>
  );
}
