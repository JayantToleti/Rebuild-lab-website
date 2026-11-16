import type { Metadata } from "next";
import { ExploreTable } from "@/components/ExploreTable";
import { PageHeading } from "@/components/PageHeading";
import { getProjects } from "@/lib/projects";
import { toRow } from "@/lib/rows";

export const metadata: Metadata = {
  title: "Explore",
  description: "The full project registry, filterable by domain, status, classification and stack.",
};

export default function ExplorePage() {
  const rows = getProjects().map(toRow);
  return (
    <>
      <PageHeading title="Explore" eyebrow="Registry">
        Every project in the registry. Filters combine with AND.
      </PageHeading>
      <ExploreTable rows={rows} />
    </>
  );
}
