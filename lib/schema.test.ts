import { describe, expect, it } from "vitest";
import { LABS } from "./labs";
import { projectSchema, projectsFileSchema } from "./schema";

const valid = {
  id: "R001",
  title: "ResNet from Scratch",
  slug: "resnet-from-scratch",
  category: "ai-ml",
  classification: ["reproduction"],
  status: "PLANNED",
  languages: ["Python"],
  frameworks: ["PyTorch"],
  references: ["https://arxiv.org/abs/1512.03385"],
  repository: "https://github.com/rebuild-lab/resnet-reproduction",
  featured: true,
};

const second = {
  ...valid,
  id: "S001",
  slug: "url-shortener",
  category: "system-design",
  classification: ["recreation"],
  references: [],
  repository: "https://github.com/rebuild-lab/url-shortener",
};

describe("projectSchema", () => {
  it("accepts a valid entry", () => {
    expect(projectSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty references array", () => {
    expect(projectSchema.safeParse(second).success).toBe(true);
  });

  it("rejects an invalid status", () => {
    expect(projectSchema.safeParse({ ...valid, status: "DONE" }).success).toBe(false);
  });

  it("rejects an unknown category", () => {
    expect(projectSchema.safeParse({ ...valid, category: "quantum" }).success).toBe(false);
  });

  it("rejects an empty classification", () => {
    expect(projectSchema.safeParse({ ...valid, classification: [] }).success).toBe(false);
  });

  it("rejects an unknown classification", () => {
    expect(projectSchema.safeParse({ ...valid, classification: ["clone"] }).success).toBe(false);
  });

  it.each(["Bad Slug", "UPPER", "trailing-", "-leading", "double--hyphen", ""])(
    "rejects bad slug %j",
    (slug) => {
      expect(projectSchema.safeParse({ ...valid, slug }).success).toBe(false);
    },
  );

  it("rejects a malformed id", () => {
    expect(projectSchema.safeParse({ ...valid, id: "r1" }).success).toBe(false);
  });

  it("rejects a non-URL repository", () => {
    expect(projectSchema.safeParse({ ...valid, repository: "not a url" }).success).toBe(false);
  });

  it("rejects unknown keys", () => {
    expect(projectSchema.safeParse({ ...valid, extra: 1 }).success).toBe(false);
  });
});

describe("projectsFileSchema", () => {
  it("accepts unique entries", () => {
    expect(projectsFileSchema.safeParse([valid, second]).success).toBe(true);
  });

  it("rejects duplicate ids", () => {
    const r = projectsFileSchema.safeParse([valid, { ...second, id: valid.id }]);
    expect(r.success).toBe(false);
    expect(r.error?.issues.some((i) => i.message.includes("duplicate id"))).toBe(true);
  });

  it("rejects duplicate slugs", () => {
    const r = projectsFileSchema.safeParse([valid, { ...second, slug: valid.slug }]);
    expect(r.success).toBe(false);
    expect(r.error?.issues.some((i) => i.message.includes("duplicate slug"))).toBe(true);
  });

  it("rejects a repository outside the GitHub org", () => {
    const r = projectsFileSchema.safeParse([
      { ...valid, repository: "https://github.com/someone-else/resnet-reproduction" },
    ]);
    expect(r.success).toBe(false);
    expect(r.error?.issues.some((i) => i.message.includes("repository must start with"))).toBe(true);
  });
});

describe("LABS", () => {
  it("defines 9 labs with unique slugs", () => {
    expect(LABS).toHaveLength(9);
    expect(new Set(LABS.map((l) => l.slug)).size).toBe(9);
  });
});
