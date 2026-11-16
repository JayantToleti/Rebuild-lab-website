import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { PageHeading } from "@/components/PageHeading";
import { StatusBadge } from "@/components/StatusBadge";
import { MDX_BLOCKS } from "@/lib/content-check";
import { getLab } from "@/lib/labs";
import { getMdxSlugs, getProject, getProjects } from "@/lib/projects";

export const dynamicParams = false;

// Every registry project gets a page (required for output: "export").
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.id} ${project.title}`,
    description:
      project.summary ??
      `${project.title}: ${project.classification.join(", ")} project in the ${
        getLab(project.category)?.name ?? project.category
      } laboratory (${project.status}).`,
  };
}

const H2 = "mb-3 border-b pb-1 text-lg font-semibold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 border-b py-1.5 last:border-b-0">
      <dt className="font-mono text-xs uppercase text-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const lab = getLab(project.category);
  // Dynamic import with an explicit .mdx extension and the @/content alias, per
  // the Next MDX guide ("Using dynamic imports"). Only slugs that have a file are
  // imported; the rest render the fallback below.
  const ProjectRecord = getMdxSlugs().includes(slug)
    ? (await import(`@/content/projects/${slug}.mdx`)).default
    : null;

  return (
    <>
      <PageHeading title={project.title} eyebrow={`${project.id} · Project`}>
        {project.summary}
      </PageHeading>

      <section aria-labelledby="header-status">
        <h2 id="header-status" className={H2}>
          Header &amp; Status
        </h2>
        <dl className="border text-sm">
          <div className="px-3">
            <Field label="ID">
              <span className="font-mono">{project.id}</span>
            </Field>
            <Field label="Classification">
              <span className="flex flex-wrap gap-1">
                {project.classification.map((c) => (
                  <ClassificationBadge key={c} classification={c} />
                ))}
              </span>
            </Field>
            <Field label="Status">
              <StatusBadge status={project.status} />
            </Field>
            <Field label="Laboratory">
              <Link href={`/labs/${project.category}`} className="text-accent hover:underline">
                {lab?.name ?? project.category}
              </Link>
            </Field>
            <Field label="Source">
              <a
                href={project.repository}
                className="font-mono text-accent hover:underline"
              >
                {project.repository}
              </a>
            </Field>
            <Field label="References">
              {project.references.length > 0 ? (
                <ul className="space-y-0.5">
                  {project.references.map((r) => (
                    <li key={r}>
                      <a href={r} className="font-mono text-accent hover:underline">
                        {r}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted">None</span>
              )}
            </Field>
            <Field label="Languages">
              <span className="font-mono">{project.languages.join(", ")}</span>
            </Field>
            <Field label="Frameworks">
              {project.frameworks.length > 0 ? (
                <span className="font-mono">{project.frameworks.join(", ")}</span>
              ) : (
                <span className="text-muted">None</span>
              )}
            </Field>
          </div>
        </dl>
      </section>

      {ProjectRecord ? (
        <ProjectRecord />
      ) : (
        MDX_BLOCKS.map((block) => (
          <section key={block}>
            <h2 className={`mt-8 ${H2}`}>{block}</h2>
            <p className="text-sm text-muted">Not yet documented.</p>
          </section>
        ))
      )}
    </>
  );
}
