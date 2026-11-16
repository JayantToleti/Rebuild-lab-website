import { describe, expect, it } from "vitest";
import { MDX_BLOCKS, checkHeadings, extractH2Headings, findOrphanMdx } from "./content-check";

const valid = MDX_BLOCKS.map((b) => `## ${b}\n\ntext\n`).join("\n");

describe("extractH2Headings", () => {
  it("returns only level-2 headings in order", () => {
    expect(extractH2Headings("# T\n## A\n### B\n## C\ntext")).toEqual(["A", "C"]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const src = "## A\n```bash\n## not a heading\n```\n~~~\n## nor this\n~~~\n## B";
    expect(extractH2Headings(src)).toEqual(["A", "B"]);
  });

  it("strips trailing hashes and handles CRLF", () => {
    expect(extractH2Headings("## A ##\r\n## B\r\n")).toEqual(["A", "B"]);
  });
});

describe("checkHeadings", () => {
  it("accepts the six headings in order", () => {
    expect(checkHeadings(extractH2Headings(valid))).toEqual([]);
  });

  it("reports a missing heading", () => {
    const issues = checkHeadings(MDX_BLOCKS.slice(1));
    expect(issues).toEqual([`missing heading "## ${MDX_BLOCKS[0]}"`]);
  });

  it("reports an unexpected heading", () => {
    expect(checkHeadings([...MDX_BLOCKS, "Extra"])).toEqual(['unexpected heading "## Extra"']);
  });

  it("reports a duplicate heading", () => {
    expect(checkHeadings([...MDX_BLOCKS, MDX_BLOCKS[0]])).toEqual([
      `duplicate heading "## ${MDX_BLOCKS[0]}"`,
    ]);
  });

  it("reports wrong order", () => {
    const swapped = [MDX_BLOCKS[1], MDX_BLOCKS[0], ...MDX_BLOCKS.slice(2)];
    expect(checkHeadings(swapped)[0]).toMatch(/out of order/);
  });

  it("rejects an empty file", () => {
    expect(checkHeadings([])).toHaveLength(6);
  });
});

describe("findOrphanMdx", () => {
  it("returns MDX slugs missing from the registry", () => {
    expect(findOrphanMdx(["a", "ghost"], ["a", "b"])).toEqual(["ghost"]);
  });

  it("returns [] when all map", () => {
    expect(findOrphanMdx(["a"], ["a", "b"])).toEqual([]);
  });
});
