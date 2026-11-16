import { describe, expect, it } from "vitest";
import {
  EMPTY_FILTERS,
  filterProjects,
  stackOptions,
  type Filters,
  type ProjectRow,
} from "./filter";

const rows: ProjectRow[] = [
  {
    id: "R001",
    title: "ResNet from Scratch",
    slug: "resnet-from-scratch",
    category: "ai-ml",
    classification: ["reproduction"],
    status: "PLANNED",
    languages: ["Python"],
    frameworks: ["PyTorch"],
  },
  {
    id: "S001",
    title: "URL Shortener",
    slug: "url-shortener",
    category: "system-design",
    classification: ["recreation", "original-work"],
    status: "IN-PROGRESS",
    languages: ["Go"],
    frameworks: ["PostgreSQL"],
  },
  {
    id: "R003",
    title: "Transformer from Scratch",
    slug: "transformer-from-scratch",
    category: "ai-ml",
    classification: ["reproduction"],
    status: "COMPLETED",
    languages: ["Python"],
    frameworks: [],
  },
];

const ids = (f: Partial<Filters>) =>
  filterProjects(rows, { ...EMPTY_FILTERS, ...f }).map((r) => r.id);

describe("filterProjects", () => {
  it("returns everything with empty filters", () => {
    expect(ids({})).toEqual(["R001", "S001", "R003"]);
  });

  it("filters by domain", () => {
    expect(ids({ domain: "ai-ml" })).toEqual(["R001", "R003"]);
  });

  it("filters by status", () => {
    expect(ids({ status: "IN-PROGRESS" })).toEqual(["S001"]);
  });

  it("matches any classification of a multi-classification project", () => {
    expect(ids({ classification: "original-work" })).toEqual(["S001"]);
    expect(ids({ classification: "recreation" })).toEqual(["S001"]);
  });

  it("matches stack against languages and frameworks, case-insensitively", () => {
    expect(ids({ stack: "python" })).toEqual(["R001", "R003"]);
    expect(ids({ stack: "PostgreSQL" })).toEqual(["S001"]);
  });

  it("does not partially match stack names", () => {
    expect(ids({ stack: "Py" })).toEqual([]);
  });

  it("combines filters with AND", () => {
    expect(ids({ domain: "ai-ml", status: "COMPLETED" })).toEqual(["R003"]);
    expect(ids({ domain: "system-design", stack: "Python" })).toEqual([]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(ids({ status: "RESEARCH" })).toEqual([]);
  });
});

describe("stackOptions", () => {
  it("returns distinct sorted languages and frameworks", () => {
    expect(stackOptions(rows)).toEqual(["Go", "PostgreSQL", "Python", "PyTorch"]);
  });
});
