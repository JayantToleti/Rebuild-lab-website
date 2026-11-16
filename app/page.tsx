import Link from "next/link";
import { ClassificationBadge } from "@/components/ClassificationBadge";
import { PageHeading } from "@/components/PageHeading";
import { ProjectsTable } from "@/components/ProjectsTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getLab, LABS } from "@/lib/labs";
import { getFeatured, getProjects } from "@/lib/projects";
import { toRow } from "@/lib/rows";
import { SITE } from "@/lib/site";

export default function Home() {
  const projects = getProjects();
  const featured = getFeatured()[0];
  const countByLab = new Map<string, number>();
  for (const p of projects) {
    countByLab.set(p.category, (countByLab.get(p.category) ?? 0) + 1);
  }

  return (
    <>
      <PageHeading title={SITE.name} eyebrow={`v${SITE.version}`}>
        {SITE.tagline}
      </PageHeading>
      <p className="-mt-3 mb-8 text-sm">
        <Link href="/explore" className="font-mono text-accent hover:underline">
          Explore the registry &rarr;
        </Link>
      </p>

      {featured ? (
        <section aria-labelledby="featured" className="mb-8">
          <h2 id="featured" className="mb-2 font-mono text-sm uppercase text-muted">
            Featured project
          </h2>
          <div className="border p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs">{featured.id}</span>
              <StatusBadge status={featured.status} />
              {featured.classification.map((c) => (
                <ClassificationBadge key={c} classification={c} />
              ))}
            </div>
            <h3 className="mt-2 text-lg font-semibold">
              <Link href={`/projects/${featured.slug}`} className="hover:underline">
                {featured.title}
              </Link>
            </h3>
            {featured.summary ? <p className="mt-1 text-muted">{featured.summary}</p> : null}
            <dl className="mt-2 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="font-mono text-xs text-muted">Domain</dt>
              <dd>
                <Link href={`/labs/${featured.category}`} className="hover:underline">
                  {getLab(featured.category)?.name ?? featured.category}
                </Link>
              </dd>
              <dt className="font-mono text-xs text-muted">Stack</dt>
              <dd className="font-mono text-xs">
                {[...featured.languages, ...featured.frameworks].join(", ")}
              </dd>
              <dt className="font-mono text-xs text-muted">Repository</dt>
              <dd>
                <a href={featured.repository} className="font-mono text-xs text-accent hover:underline">
                  {featured.repository}
                </a>
              </dd>
            </dl>
          </div>
        </section>
      ) : null}

      <section id="laboratories" aria-labelledby="labs-heading" className="mb-8 scroll-mt-4">
        <h2 id="labs-heading" className="mb-2 font-mono text-sm uppercase text-muted">
          Laboratories
        </h2>
        <ul className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {LABS.map((lab) => {
            const n = countByLab.get(lab.slug) ?? 0;
            return (
              <li key={lab.slug} className="bg-background p-3">
                <Link href={`/labs/${lab.slug}`} className="font-medium hover:underline">
                  {lab.name}
                </Link>
                <p className="mt-1 text-sm text-muted">{lab.scope}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {n} {n === 1 ? "project" : "projects"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-2 font-mono text-sm uppercase text-muted">
          Projects
        </h2>
        <ProjectsTable rows={projects.map(toRow)} />
      </section>
    </>
  );
}
