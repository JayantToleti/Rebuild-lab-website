// Single source of truth for site-wide constants.
// The GitHub org name is provisional (Proposal); change it here only.
export const GITHUB_ORG = "rebuild-lab";

// Canonical origin, used for metadataBase, sitemap and robots. Set
// NEXT_PUBLIC_SITE_URL in the deploy environment; the fallback is a placeholder.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebuild-lab.example").replace(/\/+$/, "");

export const SITE = {
  url: SITE_URL,
  name: "Rebuild Lab",
  tagline: "Understand the internals. Rebuild the system. Push the boundaries.",
  version: "1.0",
  githubOrg: GITHUB_ORG,
  githubUrl: `https://github.com/${GITHUB_ORG}`,
} as const;
