import type { Classification } from "@/lib/taxonomy";

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
