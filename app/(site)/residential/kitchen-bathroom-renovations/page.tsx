import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ResidentialSubnav } from "@/components/sections/ResidentialSubnav";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { getPage, getSettings, pageMedia } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("kitchen-bathroom-renovations");

const PATH = "/residential/kitchen-bathroom-renovations";

const STEPS = [
  { title: "Consultation", text: "We talk through what is not working in the room today and what you want it to do." },
  { title: "Scope and selections", text: "We agree the scope, cabinets and finishes, and confirm which work requires licensed trades." },
  { title: "Renovation", text: "Removal, preparation, installation and finishing, sequenced to limit disruption." },
  { title: "Completion", text: "A final walkthrough together so you know the room is ready to use." },
];

export default async function KitchenBathroomPage() {
  const [page, settings] = await Promise.all([getPage("kitchen-bathroom-renovations"), getSettings()]);
  const kitchen = pageMedia(page, "kitchen-bathroom-renovations", "kitchen");
  const bathroom = pageMedia(page, "kitchen-bathroom-renovations", "bathroom");
  const bathroomAlt = pageMedia(page, "kitchen-bathroom-renovations", "bathroom-alt");

  return (
    <>
      <ImageHero
        hero={page.hero}
        crumbs={[
          { label: "Residential", href: "/residential" },
          { label: "Kitchen & Bathroom Renovations", href: PATH },
        ]}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />
      <ResidentialSubnav current={PATH} />

      <section className="bg-white py-12 sm:py-16">
        <Container className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow">Kitchen &amp; bathroom</p>
            <h2 className="mt-3 text-[1.85rem] font-extrabold leading-[1.08] sm:text-[2.5rem]">{page.intro.heading}</h2>
          </Reveal>
          <p className="text-base leading-relaxed text-muted sm:text-[17px]">{page.intro.body}</p>
        </Container>
        <Container className="mt-8 flex flex-wrap gap-2">
          <a href="#kitchens" className="inline-flex min-h-11 items-center rounded-[3px] border border-line px-4 text-sm font-semibold hover:border-ink">
            Kitchen renovations
          </a>
          <a href="#bathrooms" className="inline-flex min-h-11 items-center rounded-[3px] border border-line px-4 text-sm font-semibold hover:border-ink">
            Bathroom renovations
          </a>
        </Container>
      </section>

      <FeatureSplit
        id="kitchens"
        tone="mist"
        eyebrow="Kitchens"
        title="Kitchen renovations."
        body="From updating cabinets and finishes to reworking the layout, we plan kitchen renovations around how you cook, store and gather."
        image={kitchen.url}
        alt={kitchen.alt}
        points={["Cabinet installation", "Layout updates", "Finishing and trim", "Fixture-related improvements within confirmed scope"]}
      >
        <ButtonLink href="/request-a-quote?division=residential&service=kitchen-renovation" variant="outline" className="mt-8">
          Request a kitchen quote
        </ButtonLink>
      </FeatureSplit>

      <FeatureSplit
        id="bathrooms"
        reverse
        eyebrow="Bathrooms"
        title="Bathroom renovations."
        body="Bathroom remodeling that improves storage, finishes and day-to-day comfort, planned so the room is out of use for as short a time as practical."
        image={bathroom.url}
        alt={bathroom.alt}
        points={["Vanity and cabinet installation", "Remodeling and finishing", "Fixture-related improvements within confirmed scope", "Wall and ceiling repairs"]}
      >
        <ButtonLink href="/request-a-quote?division=residential&service=bathroom-renovation" variant="outline" className="mt-8">
          Request a bathroom quote
        </ButtonLink>
      </FeatureSplit>

      <section className="bg-white pb-14 sm:pb-20">
        <Container>
          <div className="relative aspect-[21/9] overflow-hidden rounded-[2px] bg-mist">
            <SafeImage src={bathroomAlt.url} alt={bathroomAlt.alt} fill sizes="(min-width: 1320px) 1240px, 100vw" className="object-cover" />
          </div>
          <p className="mt-3 text-xs text-subtle">
            Illustrative image. Where a renovation needs licensed plumbing or electrical work, we confirm how that work is handled
            before it is included in a quote.
          </p>
        </Container>
      </section>

      <Process steps={STEPS} title="How a kitchen or bathroom renovation runs." tone="mist" />

      <Faq faqs={page.faqs} />

      <QuoteSection
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        sourcePage={PATH}
        defaultDivision="residential"
        defaultService="kitchen-renovation"
        heading={"Let’s plan your\nkitchen or bathroom."}
        copy="Tell us which room and what you would like to change."
      />
    </>
  );
}
