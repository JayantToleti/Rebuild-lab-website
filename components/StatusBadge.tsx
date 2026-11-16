import type { Status } from "@/lib/taxonomy";

// Re-exported so existing importers keep working; the source of truth is lib/taxonomy.ts.
export { STATUSES } from "@/lib/taxonomy";
export type { Status } from "@/lib/taxonomy";

// Differentiation is by label text and border style, not colour alone.
const STYLE: Record<Status, string> = {
  PLANNED: "border-dashed text-muted",
  RESEARCH: "text-muted",
  "IN-PROGRESS": "text-accent border-accent",
  EXPERIMENTAL: "border-dashed text-accent border-accent",
  COMPLETED: "text-foreground border-foreground",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-block border px-1.5 py-px font-mono text-xs leading-tight ${STYLE[status]}`}
    >
      {status}
    </span>
  );
}
