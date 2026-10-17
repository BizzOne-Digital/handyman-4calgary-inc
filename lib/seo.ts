import type { Metadata } from "next";
import { resolveImageUrl } from "@/lib/content/images";
import { PAGE_PATHS, SITE_URL, type PageSlug } from "@/lib/constants";
import { getPage, getSettings } from "@/lib/content/queries";

const absolute = (source: string) => {
  const url = resolveImageUrl(source);
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
};

/** Unique title/description, canonical URL and Open Graph data for a public page. */
export async function pageMetadata(slug: PageSlug): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  const path = PAGE_PATHS[slug];
  const title = page.seoTitle || settings.defaultSeoTitle;
  const description = page.seoDescription || settings.defaultSeoDescription;
  const image = page.hero.image || page.media?.[0]?.url || settings.ogImage;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_CA",
      url: path,
      siteName: settings.businessName,
      title,
      description,
      images: image ? [{ url: absolute(image), width: 1200, height: 630, alt: page.hero.imageAlt || settings.businessName }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [absolute(image)] : undefined },
  };
}

export { absolute as absoluteUrl };
