import "server-only";
import { unstable_cache } from "next/cache";
import { connectDb, isDbConfigured } from "@/lib/db/connect";
import type { Division, PageSlug } from "@/lib/constants";
import { PageContent, type PageData } from "@/models/PageContent";
import { Service } from "@/models/Service";
import { Project } from "@/models/Project";
import { SiteSettings, type SiteSettingsData } from "@/models/SiteSettings";
import { DEFAULT_PAGES, DEFAULT_PROJECTS, DEFAULT_SERVICES, DEFAULT_SETTINGS } from "./defaults";

export const TAGS = {
  settings: "settings",
  services: "services",
  projects: "projects",
  page: (slug: PageSlug) => `page:${slug}`,
};

const REVALIDATE_SECONDS = 600;

export type PublicService = {
  id: string;
  key: string;
  division: Division;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  href: string;
  image: string;
  imageAlt: string;
};

export type PublicProject = {
  id: string;
  title: string;
  category: Division;
  description: string;
  image: string;
  imageAlt: string;
  illustrative: boolean;
};

/** Plain JSON clone so cached values never carry Mongoose/ObjectId instances. */
const plain = <T>(v: unknown): T => JSON.parse(JSON.stringify(v)) as T;

/**
 * Runs a DB read when configured. Errors are thrown inside the cache (so failures are
 * never cached) and converted to the fallback outside it.
 */
async function withFallback<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    return await read();
  } catch (err) {
    console.error("[content] falling back to defaults:", (err as Error).message);
    return fallback;
  }
}

const readSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    await connectDb();
    const doc = await SiteSettings.findOne({ key: "site" }).lean();
    if (!doc) return DEFAULT_SETTINGS;
    const { _id, key, updatedAt, ...rest } = plain<Record<string, unknown>>(doc);
    void _id; void key; void updatedAt;
    const merged = { ...DEFAULT_SETTINGS, ...(rest as Partial<SiteSettingsData>) };
    merged.social = { ...DEFAULT_SETTINGS.social, ...(merged.social || {}) };
    if (!merged.logoUrl) merged.logoUrl = DEFAULT_SETTINGS.logoUrl;
    if (!merged.businessName) merged.businessName = DEFAULT_SETTINGS.businessName;
    return merged;
  },
  ["site-settings"],
  { tags: [TAGS.settings], revalidate: REVALIDATE_SECONDS },
);

export function getSettings() {
  return withFallback(readSettings, DEFAULT_SETTINGS);
}

export async function getPage(slug: PageSlug): Promise<PageData> {
  const read = unstable_cache(
    async (): Promise<PageData> => {
      await connectDb();
      const doc = await PageContent.findOne({ slug }, { published: 1 }).lean();
      if (!doc?.published) return DEFAULT_PAGES[slug];
      return plain<PageData>(doc.published);
    },
    ["page", slug],
    { tags: [TAGS.page(slug)], revalidate: REVALIDATE_SECONDS },
  );
  return withFallback(read, DEFAULT_PAGES[slug]);
}

/** Looks up a page media slot, falling back to the default image for that slot. */
export function pageMedia(page: PageData, slug: PageSlug, key: string) {
  const hit = page.media?.find((m) => m.key === key);
  const fallback = DEFAULT_PAGES[slug].media.find((m) => m.key === key);
  return {
    url: hit?.url || fallback?.url || "",
    alt: hit?.alt || fallback?.alt || "",
  };
}

const defaultServices = (): PublicService[] =>
  DEFAULT_SERVICES.map((s) => ({ ...s, id: s.key }));

const readServices = unstable_cache(
  async (): Promise<PublicService[]> => {
    await connectDb();
    if ((await Service.estimatedDocumentCount()) === 0) return defaultServices();
    const docs = await Service.find({ status: "published" }).sort({ division: 1, order: 1, title: 1 }).lean();
    return docs.map((d) => ({
      id: String(d._id),
      key: d.key,
      division: d.division,
      title: d.title,
      summary: d.summary,
      description: d.description,
      highlights: d.highlights ?? [],
      href: d.href,
      image: d.image,
      imageAlt: d.imageAlt,
    }));
  },
  ["services"],
  { tags: [TAGS.services], revalidate: REVALIDATE_SECONDS },
);

export async function getServices(division?: Division) {
  const all = await withFallback(readServices, defaultServices());
  return division ? all.filter((s) => s.division === division) : all;
}

const defaultProjects = (): PublicProject[] =>
  DEFAULT_PROJECTS.map((p, i) => ({ ...p, id: `default-${i}`, illustrative: true }));

const readProjects = unstable_cache(
  async (): Promise<PublicProject[]> => {
    await connectDb();
    if ((await Project.estimatedDocumentCount()) === 0) return defaultProjects();
    const docs = await Project.find({ status: "published" }).sort({ order: 1, createdAt: -1 }).lean();
    return docs.map((d) => ({
      id: String(d._id),
      title: d.title,
      category: d.category,
      description: d.description,
      image: d.image,
      imageAlt: d.imageAlt,
      illustrative: d.illustrative,
    }));
  },
  ["projects"],
  { tags: [TAGS.projects], revalidate: REVALIDATE_SECONDS },
);

export function getProjects() {
  return withFallback(readProjects, defaultProjects());
}
