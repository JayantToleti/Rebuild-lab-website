// Single source of truth for the status and classification vocabularies.
// Dependency-free on purpose: components (including client components) import
// from here without pulling zod into the browser bundle. lib/schema.ts builds
// its Zod enums from these arrays.
export const STATUSES = [
  "PLANNED",
  "RESEARCH",
  "IN-PROGRESS",
  "EXPERIMENTAL",
  "COMPLETED",
] as const;

export type Status = (typeof STATUSES)[number];

export const CLASSIFICATIONS = [
  "reproduction",
  "recreation",
  "original-work",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];
