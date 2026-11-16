// Pure content-convention checks (no fs, no zod) so they are unit-testable and
// usable from both scripts/validate-content.ts and the page.

// Spec §5 blocks 2-7. Block 1 (Header & Status) is generated from the registry,
// so MDX files contain exactly these six `##` headings, in this order.
export const MDX_BLOCKS = [
  "Problem & Objectives",
  "Scope & Exclusions",
  "Architecture & Data Flow",
  "Benchmark & Evidence",
  "Deviations & Failure Log",
  "Reproducibility Commands",
] as const;

// Text of every level-2 ATX heading, ignoring lines inside fenced code blocks
// (e.g. `## comment` in a shell block).
export function extractH2Headings(mdx: string): string[] {
  const headings: string[] = [];
  let fence: string | null = null;
  for (const line of mdx.split(/\r?\n/)) {
    const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (fence === null) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const h = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (h) headings.push(h[1]);
  }
  return headings;
}

// Returns human-readable problems; empty when the headings are exactly MDX_BLOCKS in order.
export function checkHeadings(headings: readonly string[]): string[] {
  const issues: string[] = [];
  const missing = MDX_BLOCKS.filter((b) => !headings.includes(b));
  const unexpected = headings.filter((h) => !(MDX_BLOCKS as readonly string[]).includes(h));
  const duplicates = headings.filter((h, i) => headings.indexOf(h) !== i);
  for (const m of missing) issues.push(`missing heading "## ${m}"`);
  for (const u of unexpected) issues.push(`unexpected heading "## ${u}"`);
  for (const d of duplicates) issues.push(`duplicate heading "## ${d}"`);
  if (issues.length === 0 && headings.some((h, i) => h !== MDX_BLOCKS[i])) {
    issues.push(`headings out of order; expected: ${MDX_BLOCKS.join(" > ")}`);
  }
  return issues;
}

// MDX slugs (file names without .mdx) that have no registry entry.
export function findOrphanMdx(
  mdxSlugs: readonly string[],
  registrySlugs: readonly string[],
): string[] {
  const known = new Set(registrySlugs);
  return mdxSlugs.filter((s) => !known.has(s));
}
