import { CalendarClock, DoorOpen, Hammer, PaintRoller, Wrench } from "lucide-react";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ResidentialSubnav } from "@/components/sections/ResidentialSubnav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { getPage, getSettings, pageMedia } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("home-improvements-maintenance");

const PATH = "/residential/home-improvements-maintenance";

const SERVICES = [
  { icon: PaintRoller, title: "Interior & exterior painting", text: "Surface preparation and painting for rooms, trim and exterior surfaces." },
  { icon: Hammer, title: "Drywall & framing", text: "Drywall repairs and installation, plus framing for changes to walls and rooms." },
  { icon: DoorOpen, title: "Carpentry, doors & trim", text: "Door installation and adjustment, baseboards, casing and finishing carpentry." },
  { icon: Wrench, title: "General repairs", text: "Repairs that keep a home in good, safe working condition." },
  { icon: CalendarClock, title: "Ongoing maintenance", text: "Recurring upkeep for homeowners, landlords and residential property owners." },
];

export default async function HomeImprovementsPage() {
  const [page, settings] = await Promise.all([getPage("home-improvements-maintenance"), getSettings()]);
  const painting = pageMedia(page, "home-improvements-maintenance", "painting");
  const carpentry = pageMedia(page, "home-improvements-maintenance", "carpentry");
  const maintenance = pageMedia(page, "home-improvements-maintenance", "maintenance");

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Home Improvements & Maintenance", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} />

      <section className="bg-white py-14 sm:py-20" aria-labelledby="improve-services">
        <Container>
          <SectionHeading id="improve-services" eyebrow="Home improvements" title={page.intro.heading} description={page.intro.body} />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 60} className="bg-white p-6">
                <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
                <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureSplit
        tone="mist"
        eyebrow="Painting"
        title="Interior and exterior painting."
        body="Careful preparation is what makes paint last. We repair surfaces, protect the space and finish walls, ceilings, trim and exterior surfaces cleanly."
        image={painting.url}
        alt={painting.alt}
        points={["Walls and ceilings", "Trim and doors", "Exterior surfaces", "Surface repair and preparation"]}
      />

      <FeatureSplit
        reverse
        eyebrow="Drywall, framing & carpentry"
        title="Walls, doors and finishing details."
        body="Drywall repairs, new framing and finishing carpentry are often what turn a tired room into a finished one. We handle them as standalone projects or as part of a larger renovation."
        image={carpentry.url}
        alt={carpentry.alt}
        points={["Drywall repair and installation", "Wall framing", "Door installation", "Baseboards, casing and trim"]}
      />

      <FeatureSplit
        tone="mist"
        eyebrow="Property maintenance"
        title="Ongoing maintenance for residential properties."
        body="For homeowners, landlords and residential property owners who want one reliable contact for repairs and upkeep. Tell us about the property and the kind of maintenance you need, and we will discuss a practical arrangement."
        image={maintenance.url}
        alt={maintenance.alt}
      >
        <ButtonLink href="/request-a-quote?division=residential&service=property-maintenance" variant="outline" className="mt-8">
          Ask about ongoing maintenance
        </ButtonLink>
      </FeatureSplit>

      <Faq faqs={page.faqs} />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService="home-improvements"
        heading={"Let’s improve\nyour property."}
        copy="Tell us what needs attention and we will help you plan the work."
      />
    </>
  );
}
