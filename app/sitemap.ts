import type { MetadataRoute } from "next";
import { LABS } from "@/lib/labs";
import { getProjects } from "@/lib/projects";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/explore",
    "/about",
    "/contribute",
    ...LABS.map((l) => `/labs/${l.slug}`),
    ...getProjects().map((p) => `/projects/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${SITE.url}${p}` }));
}
