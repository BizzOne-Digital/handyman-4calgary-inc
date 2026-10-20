import { Building, Home, KeyRound } from "lucide-react";
import { GroupCards } from "@/components/sections/services/GroupCards";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { DEFAULT_STEPS, Process } from "@/components/sections/Process";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { getPage, getServices, getSettings } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("residential");

const AUDIENCES = [
  { icon: Home, title: "Homeowners", text: "Renovations that improve how your home works day to day." },
  { icon: KeyRound, title: "Landlords", text: "Renovations between tenancies, repairs and ongoing upkeep." },
  { icon: Building, title: "Residential property owners", text: "Planned improvements and maintenance across your properties." },
];

export default async function ResidentialPage() {
  const [page, settings, services] = await Promise.all([getPage("residential"), getSettings(), getServices("residential")]);

  return (
    <>
      <ImageHero hero={page.hero} crumbs={[{ label: "Residential", href: "/residential" }]} phone={settings.phone} phoneHref={settings.phoneHref} />

      <section className="bg-white py-14 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Who we help" title={page.intro.heading} description={page.intro.body} />
          </Reveal>
          <ul className="grid gap-px self-start overflow-hidden rounded-[4px] border border-line bg-line">
            {AUDIENCES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 bg-white p-5 sm:p-6">
                <Icon aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.6} />
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-14 sm:py-20" aria-labelledby="res-services">
        <Container>
          <SectionHeading
            id="res-services"
            eyebrow="Residential services"
            title="Every residential service, in three groups."
            description="Choose a group to see the scope of each service, how projects run and answers to common questions."
          />
          <div className="mt-10">
            <GroupCards division="residential" services={services} />
          </div>
        </Container>
      </section>

      <Process steps={DEFAULT_STEPS} title="How a residential project runs." />

      <Faq faqs={page.faqs} />

      <CtaBand
        title="Planning a renovation at home?"
        copy="Tell us about the property and what you would like to change. We will help you work out the next step."
        href="/request-a-quote?division=residential"
        label="Request a Residential Quote"
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
    </>
  );
}
