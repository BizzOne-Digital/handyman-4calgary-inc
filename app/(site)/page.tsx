import { AboutPreview } from "@/components/sections/AboutPreview";
import { CtaBand } from "@/components/sections/CtaBand";
import { DivisionPanels } from "@/components/sections/DivisionPanels";
import { ExperienceStrip } from "@/components/sections/ExperienceStrip";
import { Faq } from "@/components/sections/Faq";
import { ProjectsPreview } from "@/components/sections/home/ProjectsPreview";
import { WhoWeHelp } from "@/components/sections/home/WhoWeHelp";
import { WhyChooseUs } from "@/components/sections/home/WhyChooseUs";
import { DEFAULT_STEPS, Process } from "@/components/sections/Process";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { Container, Lines } from "@/components/ui/layout";
import { DEFAULT_PAGES } from "@/lib/content/defaults";
import { getPage, getProjects, getServices, getSettings, pageMedia } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("home");

export default async function HomePage() {
  const [page, settings, residential, commercial, projects] = await Promise.all([
    getPage("home"),
    getSettings(),
    getServices("residential"),
    getServices("commercial"),
    getProjects(),
  ]);
  const resImg = pageMedia(page, "home", "panel-residential");
  const comImg = pageMedia(page, "home", "panel-commercial");
  const aboutImg = pageMedia(page, "home", "about");
  // Content published before FAQs existed on Home falls back to the default FAQs.
  const faqs = page.faqs?.length ? page.faqs : DEFAULT_PAGES.home.faqs;

  return (
    <>
      <section className="bg-mist">
        <Container className="pb-6 pt-7 text-center sm:pb-9 sm:pt-11 lg:pb-10 lg:pt-12">
          <p className="animate-rise text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-graphite sm:text-[0.7rem] sm:tracking-[0.24em]">
            {page.hero.eyebrow}
          </p>
          <h1 className="animate-rise mx-auto mt-3 max-w-4xl text-[2.05rem] font-extrabold leading-[1.02] [animation-delay:80ms] sm:mt-4 sm:text-[3.4rem] lg:text-[4.1rem]">
            <Lines text={page.hero.heading} />
          </h1>
          <p className="animate-rise mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-muted [animation-delay:160ms] sm:mt-5 sm:text-lg">
            {page.hero.description}
          </p>
        </Container>
      </section>

      <DivisionPanels
        panels={[
          {
            title: "Residential / Home Services",
            copy: "Renovations & improvements for your home",
            cta: "Explore Residential",
            href: "/residential",
            image: resImg.url,
            alt: resImg.alt,
          },
          {
            title: "Commercial & Industrial",
            copy: "Projects & maintenance for your business",
            cta: "Explore Commercial",
            href: "/commercial-industrial",
            image: comImg.url,
            alt: comImg.alt,
          },
        ]}
      />

      <ExperienceStrip />

      <ServicesOverview residential={residential} commercial={commercial} />

      <WhoWeHelp />

      <AboutPreview heading={page.intro.heading} body={page.intro.body} image={aboutImg.url} alt={aboutImg.alt} />

      <WhyChooseUs />

      <Process steps={DEFAULT_STEPS} tone="mist" title="From first call to finished project." />

      <ProjectsPreview projects={projects} />

      <Faq faqs={faqs} />

      <CtaBand
        title="Need ongoing maintenance for a property?"
        copy="Residential, commercial or industrial: tell us about the building and the upkeep it needs, and we will discuss a practical arrangement."
        href="/request-a-quote?division=commercial&service=maintenance-contract"
        label="Ask about maintenance"
        phone={settings.phone}
        phoneHref={settings.phoneHref}
      />

      <div className="h-px bg-graphite" />

      <QuoteSection phone={settings.phone} phoneHref={settings.phoneHref} email={settings.email} sourcePage="/" />
    </>
  );
}
