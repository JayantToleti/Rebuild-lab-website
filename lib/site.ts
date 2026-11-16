// Single source of truth for site-wide constants.
// The GitHub org name is provisional (Proposal); change it here only.
export const GITHUB_ORG = "rebuild-lab";

export const SITE = {
  name: "Rebuild Lab",
  tagline: "Understand the internals. Rebuild the system. Push the boundaries.",
  version: "1.0",
  githubOrg: GITHUB_ORG,
  githubUrl: `https://github.com/${GITHUB_ORG}`,
} as const;
