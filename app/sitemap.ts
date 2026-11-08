import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "about/", "terms/", "privacy/"].map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now }));
  const tools = TOOLS.filter((t) => t.ready).map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));
  return [...pages, ...tools];
}
