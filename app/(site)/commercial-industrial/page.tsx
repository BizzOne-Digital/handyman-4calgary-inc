import { Briefcase, Building2, ClipboardList, Factory, HardHat, Store, Warehouse } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { getPage, getServices, getSettings, pageMedia, type PublicService } from "@/lib/content/queries";
import { DEFAULT_SERVICES } from "@/lib/content/defaults";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("commercial-industrial");

const PATH = "/commercial-industrial";

const AUDIENCES = [
  { icon: Briefcase, label: "Business owners" },
  { icon: Building2, label: "Commercial property owners" },
  { icon: ClipboardList, label: "Property & facility managers" },
  { icon: HardHat, label: "General contractors" },
  { icon: Factory, label: "Industrial clients" },
];

const TRADES = [
  { title: "Drywall", text: "Installation, repairs and finishing for new and existing walls and ceilings." },
  { title: "Framing", text: "Interior partition and wall framing for layout changes and fit-ups." },
  { title: "Painting", text: "Interior repainting and finishing for offices, retail and common areas." },
  { title: "Carpentry", text: "Doors, trim, millwork and finishing carpentry." },
];

const STEPS = [
  { title: "Initial discussion", text: "We learn about the property, the work required and any operational constraints." },
  { title: "Site review", text: "We review the space or facility to confirm scope, access and sequencing." },
  { title: "Proposal", text: "A clear scope and quote for a defined project or an ongoing maintenance arrangement." },
  { title: "Delivery and reporting", text: "Work is scheduled around your operations with clear communication throughout." },
];

/** Uses the admin-managed service entry when available, falling back to the built-in default. */
function pick(services: PublicService[], key: string): PublicService {
  const found = services.find((s) => s.key === key);
  if (found) return found;
  const d = DEFAULT_SERVICES.find((s) => s.key === key)!;
  return { ...d, id: d.key };
}

export default async function CommercialPage() {
  const [page, settings, services] = await Promise.all([getPage("commercial-industrial"), getSettings(), getServices("commercial")]);
  const renovations = pick(services, "commercial-renovations");
  const officeRetail = pick(services, "office-retail-improvements");
  const facility = pick(services, "facility-industrial-maintenance");
  const industrialImg = pageMedia(page, "commercial-industrial", "industrial");

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[{ label: "Commercial & Industrial", href: PATH }]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />

      {/* Section jump links */}
      <nav aria-label="Commercial services" className="border-b border-line bg-white">
        <Container>
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {[
              ["Commercial Renovations", "#commercial-renovations"],
              ["Office & Retail", "#office-retail"],
              ["Facility & Industrial Maintenance", "#facility-maintenance"],
              ["Maintenance Contracts", "#maintenance-contracts"],
            ].map(([label, href]) => (
              <li key={href} className="shrink-0">
                <a href={href} className="inline-flex min-h-12 items-center whitespace-nowrap px-3 text-sm text-muted transition-colors hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {/* Commercial vs Industrial */}
      <section className="bg-white py-14 sm:py-20" aria-labelledby="ci-intro">
        <Container>
          <SectionHeading id="ci-intro" eyebrow="Two areas of work" title={page.intro.heading} description={page.intro.body} />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-2">
            <Reveal className="bg-white p-6 sm:p-8">
              <Store aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-bold">Commercial improvements</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Renovations, tenant improvements and upgrades for offices, retail units and commercial interiors. Usually a defined project with a clear start and finish.
              </p>
              <a href="#commercial-renovations" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
                Commercial renovations
              </a>
            </Reveal>
            <Reveal className="bg-white p-6 sm:p-8" delay={100}>
              <Warehouse aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-bold">Industrial building maintenance</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Repairs and upkeep that keep warehouses and industrial buildings functional and in good repair, on a project basis or as recurring maintenance.
              </p>
              <a href="#facility-maintenance" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
                Facility &amp; industrial maintenance
              </a>
            </Reveal>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4" aria-label="Who we work with">
            {AUDIENCES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-graphite">
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} /> {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureSplit
        id="commercial-renovations"
        tone="mist"
        eyebrow="Commercial renovations"
        title={`${renovations.title} and tenant improvements.`}
        body={renovations.description}
        image={renovations.image}
        alt={renovations.imageAlt}
        points={renovations.highlights}
      />

      <FeatureSplit
        id="office-retail"
        reverse
        eyebrow="Office & retail"
        title={officeRetail.title}
        body={officeRetail.description}
        image={officeRetail.image}
        alt={officeRetail.imageAlt}
        points={officeRetail.highlights}
      />

      <section className="bg-mist py-14 sm:py-20" aria-labelledby="ci-trades">
        <Container>
          <SectionHeading
            id="ci-trades"
            eyebrow="Core trades"
            title="Drywall, framing, painting and carpentry."
            description="The interior trades behind most commercial improvement projects, delivered by one accountable contractor."
          />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {TRADES.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 70} className="bg-white p-6">
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureSplit
        id="facility-maintenance"
        eyebrow="Facility & industrial maintenance"
        title={facility.title}
        body={facility.description}
        image={facility.image}
        alt={facility.imageAlt}
        points={facility.highlights}
      />

      <FeatureSplit
        id="maintenance-contracts"
        reverse
        tone="mist"
        eyebrow="Project-based or ongoing"
        title="Project-based contracting and ongoing maintenance."
        body="Some work is a single defined project. Other properties need regular attention. We can quote individual projects or discuss a recurring maintenance arrangement for commercial and industrial buildings."
        image={industrialImg.url}
        alt={industrialImg.alt}
        points={["Defined project scopes", "Recurring building upkeep", "Repairs as needs arise", "One point of contact"]}
      >
        <ButtonLink href="/request-a-quote?division=commercial&service=maintenance-contract" className="mt-8">
          Enquire about ongoing maintenance
        </ButtonLink>
      </FeatureSplit>

      <Process steps={STEPS} title="How commercial and industrial projects run." />

      <Faq faqs={page.faqs} />

      <CtaBand
        title="Need ongoing maintenance for your building?"
        copy="Tell us about the property and the type of upkeep it needs. We will discuss a practical arrangement."
        href="/request-a-quote?division=commercial&service=maintenance-contract"
        label="Start a maintenance enquiry"
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />

      <div className="h-px bg-graphite" />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="commercial"
        heading={"Let’s talk about\nyour property."}
        copy="Share the project or maintenance need and we will follow up."
      />
    </>
  );
}
