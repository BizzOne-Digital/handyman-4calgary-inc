import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ResidentialSubnav } from "@/components/sections/ResidentialSubnav";
import { ServiceSections } from "@/components/sections/services/ServiceSections";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { PAGE_PATHS } from "@/lib/constants";
import { getPage, getProjects, getServicesByGroup, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("residential-finishing");

const PATH = PAGE_PATHS["residential-finishing"];

const COMBINE = [
  { title: "Refresh a room", text: "New flooring, drywall repairs, fresh paint and new trim, completed in one visit sequence." },
  { title: "Prepare a rental", text: "Turnover work between tenants: repairs, paint, flooring and door adjustments." },
  { title: "Finish a renovation", text: "The finishing trades after a larger project, so everything is completed to the same standard." },
];

export default async function ResidentialFinishingPage() {
  const [page, settings, services, projects] = await Promise.all([
    getPage("residential-finishing"),
    getSettings(),
    getServicesByGroup("res-finishing"),
    getProjects(),
  ]);

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Flooring, Painting & Carpentry", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} services={services} />

      <section className="bg-white py-14 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Interior & exterior finishing" title={page.intro.heading} description={page.intro.body} />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
            {COMBINE.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 80} className="bg-white p-6">
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ServiceSections services={services} projects={projects} startTone="mist" />

      <Faq faqs={page.faqs} />

      <CtaBand
        title="Several small jobs around the house?"
        copy="List them in one request. Grouping related work into one planned visit is usually faster and more economical."
        href="/request-a-quote?division=residential&service=carpentry-repairs"
        label="Send your list"
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <div className="h-px bg-graphite" />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService={services[0]?.key}
        heading={"Let’s improve\nyour home."}
        copy="Tell us what needs attention and we will help you plan the work."
      />
    </>
  );
}
