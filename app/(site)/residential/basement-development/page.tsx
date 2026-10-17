import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ResidentialSubnav } from "@/components/sections/ResidentialSubnav";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { getPage, getSettings, pageMedia } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("basement-development");

const PATH = "/residential/basement-development";

const SCOPE = [
  { title: "Framing", text: "Wall framing for new rooms, closets and storage, built to the agreed layout." },
  { title: "Drywall", text: "Drywall installation, taping and finishing ready for paint." },
  { title: "Layout improvements", text: "Reworking existing basements so the space flows and is easier to use." },
  { title: "Interior finishing", text: "Trim, doors, painting and the finishing details that complete the space." },
];

const STEPS = [
  { title: "Consultation", text: "We discuss how you want to use the space, your priorities and your timing." },
  { title: "Layout and scope", text: "We confirm the layout, finishes and any permit requirements before work starts." },
  { title: "Build", text: "Framing and drywall, then finishing, carried out in a clear sequence." },
  { title: "Final walkthrough", text: "We walk through the finished space with you and address any items." },
];

export default async function BasementPage() {
  const [page, settings] = await Promise.all([getPage("basement-development"), getSettings()]);
  const overview = pageMedia(page, "basement-development", "overview");
  const finishing = pageMedia(page, "basement-development", "finishing");

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Basement Development", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} />

      <FeatureSplit
        eyebrow="Finishing and renovation"
        title={page.intro.heading}
        body={page.intro.body}
        image={overview.url}
        alt={overview.alt}
        points={["New basement finishing", "Renovation of finished basements", "Bedrooms, family rooms and offices", "Storage and utility areas"]}
      />

      <section className="bg-mist py-14 sm:py-20" aria-labelledby="basement-scope">
        <Container>
          <SectionHeading id="basement-scope" eyebrow="Typical scope" title="What a basement project can include." />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {SCOPE.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 70} className="bg-white p-6">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureSplit
        reverse
        eyebrow="Practical living space"
        title="Planned around how your household lives."
        body="A good basement starts with the right layout. We help you decide where rooms, storage and open areas should go, then build and finish the space so it feels like a natural part of the home."
        image={finishing.url}
        alt={finishing.alt}
      />

      <Process steps={STEPS} title="How a basement project runs." tone="mist" />

      <Faq faqs={page.faqs} />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService="basement-development"
        heading={"Ready to plan\nyour basement?"}
        copy="Tell us about the space and how you would like to use it."
      />
    </>
  );
}
