import type { MetadataRoute } from "next";
import { PAGE_PATHS, PAGE_SLUGS, SITE_URL } from "@/lib/constants";

const PRIORITY: Record<string, number> = { "/": 1, "/residential": 0.9, "/commercial-industrial": 0.9, "/request-a-quote": 0.8 };

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_SLUGS.map((slug) => {
    const path = PAGE_PATHS[slug];
    return {
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: PRIORITY[path] ?? 0.7,
    };
  });
}
