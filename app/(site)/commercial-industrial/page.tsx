import Link from "next/link";
import { ArrowRight, Briefcase, Building2, Check, ClipboardList, Factory, HardHat } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { groupsFor } from "@/lib/constants";
import { getPage, getProjects, getServices, getSettings, type PublicProject, type PublicService } from "@/lib/content/queries";
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

const STEPS = [
  { title: "Initial discussion", text: "We learn about the property, the work required and any operational constraints." },
  { title: "Site review", text: "We review the space or facility to confirm scope, access, permits and sequencing." },
  { title: "Proposal", text: "A clear scope and quote for a defined project or an ongoing maintenance arrangement." },
  { title: "Delivery", text: "Work is scheduled around your operations, with clear communication throughout." },
];

/** Section id for each commercial group, matching the anchors in SERVICE_GROUPS. */
const anchorOf = (path: string) => path.split("#")[1] ?? "";

function ServiceCard({ s, photos, wide }: { s: PublicService; photos: PublicProject[]; wide?: boolean }) {
  const cover = photos[0]?.image ? photos[0] : null;
  return (
    <Reveal
      as="li"
      className={`flex scroll-mt-28 flex-col overflow-hidden rounded-[4px] border border-line bg-white ${wide ? "md:col-span-2 md:flex-row" : ""}`}
    >
      <div id={s.key} aria-hidden="true" className="h-0" />
      <div className={`relative aspect-[16/10] shrink-0 bg-line ${wide ? "md:aspect-auto md:w-1/2" : ""}`}>
        <SafeImage
          src={cover?.image || s.image}
          alt={cover?.imageAlt || s.imageAlt}
          fill
          sizes={wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold">{s.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.description || s.summary}</p>
        {s.highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {s.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.2} />
                {h}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/request-a-quote?division=commercial&service=${s.key}`}
          className="group mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-sm font-semibold underline underline-offset-4"
        >
          Request a quote
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Reveal>
  );
}

export default async function CommercialPage() {
  const [page, settings, services, projects] = await Promise.all([
    getPage("commercial-industrial"),
    getSettings(),
    getServices("commercial"),
    getProjects(),
  ]);
  const groups = groupsFor("commercial").map((g) => ({ ...g, anchor: anchorOf(g.path), services: services.filter((s) => s.group === g.key) }));
  const photosFor = (key: string) => projects.filter((p) => p.serviceKey === key);

  return (
    <>
      <ImageHero hero={page.hero} crumbs={[{ label: "Commercial & Industrial", href: PATH }]} phone={settings.phone} phoneHref={settings.phoneHref} />

      <nav aria-label="Commercial services" className="sticky top-[72px] z-20 border-b border-line bg-white/95 backdrop-blur lg:top-[96px]">
        <Container>
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
            {groups.map((g) => (
              <li key={g.key} className="shrink-0">
                <a href={`#${g.anchor}`} className="inline-flex min-h-12 items-center whitespace-nowrap px-3 text-sm text-muted transition-colors hover:text-ink">
                  {g.shortTitle}
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <a href="#quote" className="inline-flex min-h-12 items-center whitespace-nowrap px-3 text-sm font-semibold">
                Request a quote
              </a>
            </li>
          </ul>
        </Container>
      </nav>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="ci-intro">
        <Container>
          <SectionHeading id="ci-intro" eyebrow="How our commercial services are organized" title={page.intro.heading} description={page.intro.body} />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-3">
            {groups.map((g, i) => (
              <Reveal as="li" key={g.key} delay={i * 80} className="bg-white p-6">
                <a href={`#${g.anchor}`} className="group block">
                  <span className="text-xs font-bold tracking-widest text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block text-lg font-bold group-hover:underline group-hover:underline-offset-4">{g.title}</span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-muted">{g.summary}</span>
                </a>
              </Reveal>
            ))}
          </ul>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4" aria-label="Who we work with">
            {AUDIENCES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-graphite">
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} /> {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {groups.map((g, gi) =>
        g.services.length === 0 ? null : (
          <section key={g.key} id={g.anchor} className={`${gi % 2 === 0 ? "bg-mist" : "bg-white"} scroll-mt-32 py-14 sm:py-20`} aria-labelledby={`${g.anchor}-h`}>
            <Container>
              <SectionHeading id={`${g.anchor}-h`} eyebrow={`Commercial & Industrial / ${String(gi + 1).padStart(2, "0")}`} title={g.title} description={g.summary} />
              <ul className={`mt-10 grid gap-5 ${g.services.length === 1 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                {g.services.map((s) => (
                  <ServiceCard key={s.id} s={s} photos={photosFor(s.key)} wide={g.services.length === 1} />
                ))}
              </ul>
            </Container>
          </section>
        ),
      )}

      <CtaBand
        title="Need ongoing maintenance for your building?"
        copy="Tell us about the property and the type of upkeep it needs. We will discuss a practical arrangement."
        href="/request-a-quote?division=commercial&service=facility-maintenance"
        label="Start a maintenance enquiry"
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />

      <Process steps={STEPS} title="How commercial and industrial projects run." />

      <Faq faqs={page.faqs} />

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
