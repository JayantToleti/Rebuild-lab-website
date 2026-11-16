import Link from "next/link";
import { getLab } from "@/lib/labs";
import { stackOf, type ProjectRow } from "@/lib/filter";
import { ClassificationBadge } from "./ClassificationBadge";
import { DataTable, Td, Th } from "./DataTable";
import { StatusBadge } from "./StatusBadge";

// Shared registry table. No hooks or server-only imports, so it renders on the
// server for / and /labs/[slug] and inside the client ExploreTable.
export function ProjectsTable({ rows }: { rows: readonly ProjectRow[] }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>Title</Th>
          <Th>Domain</Th>
          <Th>Classification</Th>
          <Th>Status</Th>
          <Th>Stack</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="font-mono text-xs">{r.id}</Td>
            <Td>
              <Link href={`/projects/${r.slug}`} className="text-accent hover:underline">
                {r.title}
              </Link>
            </Td>
            <Td>
              <Link href={`/labs/${r.category}`} className="hover:underline">
                {getLab(r.category)?.name ?? r.category}
              </Link>
            </Td>
            <Td>
              <span className="flex flex-wrap gap-1">
                {r.classification.map((c) => (
                  <ClassificationBadge key={c} classification={c} />
                ))}
              </span>
            </Td>
            <Td>
              <StatusBadge status={r.status} />
            </Td>
            <Td className="font-mono text-xs">{stackOf(r).join(", ")}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
