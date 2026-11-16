import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/PageHeading";
import { ProjectsTable } from "@/components/ProjectsTable";
import { getLab, LABS } from "@/lib/labs";
import { getProjectsByLab } from "@/lib/projects";
import { toRow } from "@/lib/rows";

export const dynamicParams = false;

export function generateStaticParams() {
  return LABS.map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  return { title: lab.name, description: lab.scope };
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const rows = getProjectsByLab(lab.slug).map(toRow);

  return (
    <>
      <PageHeading title={lab.name} eyebrow="Laboratory">
        {lab.scope}
      </PageHeading>

      <section aria-labelledby="examples" className="mb-8">
        <h2 id="examples" className="mb-2 font-mono text-sm uppercase text-muted">
          Example work
        </h2>
        <ul className="flex flex-wrap gap-2">
          {lab.examples.map((e) => (
            <li key={e} className="border px-1.5 py-px font-mono text-xs">
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="projects">
        <h2 id="projects" className="mb-2 font-mono text-sm uppercase text-muted">
          Projects ({rows.length})
        </h2>
        {rows.length > 0 ? (
          <ProjectsTable rows={rows} />
        ) : (
          <p className="border border-dashed p-4 text-sm text-muted">
            No projects yet in this laboratory. Entries are added to the registry as work starts.
          </p>
        )}
      </section>
    </>
  );
}
