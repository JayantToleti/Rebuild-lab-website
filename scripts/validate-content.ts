// Run via `npm run validate:content`. Exits non-zero if the registry or the
// project MDX files are invalid.
// The repository-org check lives in lib/schema.ts (projectsFileSchema), so it
// applies to both this script and the build. MDX checks (orphans, the six fixed
// `##` headings) live in lib/content-check.ts and lib/projects.ts getMdxIssues().
import { getMdxIssues, getMdxSlugs, loadProjects } from "../lib/projects";

try {
  const projects = loadProjects();
  const issues = getMdxIssues();
  if (issues.length > 0) {
    console.error(`MDX content failed validation:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    process.exit(1);
  }
  console.log(
    `content OK: ${projects.length} projects validated, ${getMdxSlugs().length} MDX records checked`,
  );
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
