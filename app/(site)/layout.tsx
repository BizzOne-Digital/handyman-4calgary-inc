import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { UtilityBar } from "@/components/site/UtilityBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { getSettings } from "@/lib/content/queries";
import { absoluteUrl } from "@/lib/seo";

// Pages are statically rendered and refreshed on admin save (tag revalidation), with a time-based safety net.
export const revalidate = 600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const sameAs = Object.values(settings.social ?? {}).filter((u) => /^https:\/\//.test(u));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-[3px] bg-ink px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <UtilityBar settings={settings} />
      <Header
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
      />
      <main id="main">{children}</main>
      <div className="pb-[72px] lg:pb-0">
        <Footer settings={settings} />
      </div>
      <MobileActionBar phone={settings.phone} phoneHref={settings.phoneHref} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "@id": `${SITE_URL}/#business`,
          name: settings.businessName,
          url: SITE_URL,
          telephone: settings.phoneHref.replace(/^tel:/, ""),
          email: settings.email,
          logo: absoluteUrl(settings.logoUrl),
          image: absoluteUrl(settings.ogImage || settings.logoUrl),
          description: settings.defaultSeoDescription,
          address: { "@type": "PostalAddress", addressLocality: "Calgary", addressRegion: "AB", addressCountry: "CA" },
          areaServed: { "@type": "City", name: "Calgary", containedInPlace: { "@type": "AdministrativeArea", name: "Alberta" } },
          ...(sameAs.length ? { sameAs } : {}),
        }}
      />
    </>
  );
}
