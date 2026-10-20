import { ClipboardCheck, FileCheck2, Wrench } from "lucide-react";
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

export const generateMetadata = () => pageMetadata("residential-systems");

const PATH = PAGE_PATHS["residential-systems"];

const APPROACH = [
  { icon: ClipboardCheck, title: "Scope first", text: "We confirm exactly what is involved before any work is booked." },
  { icon: FileCheck2, title: "Permits and licensing", text: "Permit and licensing requirements are identified and discussed with you upfront." },
  { icon: Wrench, title: "Ongoing care", text: "Recurring maintenance options for homes and rental properties." },
];

export default async function ResidentialSystemsPage() {
  const [page, settings, services, projects] = await Promise.all([
    getPage("residential-systems"),
    getSettings(),
    getServicesByGroup("res-systems"),
    getProjects(),
  ]);

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Plumbing, Electrical & Maintenance", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} services={services} />

      <section className="bg-white py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionHeading eyebrow="How we approach it" title={page.intro.heading} description={page.intro.body} />
          <ul className="grid gap-px self-start overflow-hidden rounded-[4px] border border-line bg-line">
            {APPROACH.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 80} className="flex gap-4 bg-white p-5 sm:p-6">
                <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.6} />
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ServiceSections services={services} projects={projects} startTone="mist" />

      <Faq faqs={page.faqs} />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService={services[0]?.key}
        heading={"Tell us what\nneeds attention."}
        copy="Describe the issue or the maintenance you need and we will follow up."
      />
    </>
  );
}
