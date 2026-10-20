import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ResidentialSubnav } from "@/components/sections/ResidentialSubnav";
import { ServiceSections } from "@/components/sections/services/ServiceSections";
import { Container, SectionHeading } from "@/components/ui/layout";
import { PAGE_PATHS } from "@/lib/constants";
import { getPage, getProjects, getServicesByGroup, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("residential-renovations");

const PATH = PAGE_PATHS["residential-renovations"];

const STEPS = [
  { title: "Consultation", text: "We discuss how you use the space today, what needs to change and the timing that matters to you." },
  { title: "Layout and scope", text: "We agree the layout, finishes, permits and any licensed trades before work is scheduled." },
  { title: "Demolition and build", text: "Removal, framing and construction carried out in a clear sequence to limit disruption." },
  { title: "Finishing and walkthrough", text: "Finishes completed, then a walkthrough together so you know the space is ready to use." },
];

export default async function ResidentialRenovationsPage() {
  const [page, settings, services, projects] = await Promise.all([
    getPage("residential-renovations"),
    getSettings(),
    getServicesByGroup("res-renovations"),
    getProjects(),
  ]);

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Renovations", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} services={services} />

      <section className="bg-white pb-2 pt-14 sm:pt-20">
        <Container>
          <SectionHeading eyebrow="Renovations" title={page.intro.heading} description={page.intro.body} />
        </Container>
      </section>

      <ServiceSections services={services} projects={projects} />

      <Process steps={STEPS} title="How a renovation runs." tone="mist" />

      <Faq faqs={page.faqs} />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService={services[0]?.key}
        heading={"Planning a\nrenovation?"}
        copy="Tell us which rooms and what you would like to change."
      />
    </>
  );
}
