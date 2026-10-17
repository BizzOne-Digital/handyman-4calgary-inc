import Link from "next/link";
import { ArrowRight, ClipboardCheck, MapPin, MessageSquare, Ruler } from "lucide-react";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { ImageHero } from "@/components/sections/PageHero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { getPage, getSettings, pageMedia } from "@/lib/content/queries";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = () => pageMetadata("about");

const VALUES = [
  { icon: Ruler, title: "Workmanship", text: "Work that is done properly, with attention to the details that make a finished space last." },
  { icon: MessageSquare, title: "Communication", text: "Clear answers, realistic expectations and updates while the work is underway." },
  { icon: ClipboardCheck, title: "Practical planning", text: "Scope, sequence and priorities agreed before work begins, so projects run in a clear order." },
];

export default async function AboutPage() {
  const [page, settings, home] = await Promise.all([getPage("about"), getSettings(), getPage("home")]);
  const workmanship = pageMedia(page, "about", "workmanship");
  const resImg = pageMedia(home, "home", "panel-residential");
  const comImg = pageMedia(home, "home", "panel-commercial");

  return (
    <>
      <ImageHero hero={page.hero} crumbs={[{ label: "About", href: "/about" }]} phone={settings.phone} phoneHref={settings.phoneHref} />

      <FeatureSplit
        eyebrow="Who we are"
        title={page.intro.heading}
        body={page.intro.body}
        image={workmanship.url}
        alt={workmanship.alt}
        points={[
          "Approximately 20 years of construction experience in Canada",
          "Residential renovations and improvements",
          "Commercial improvements and industrial maintenance",
          "Project-based and ongoing maintenance work",
        ]}
      />

      <section className="bg-mist py-14 sm:py-20" aria-labelledby="about-values">
        <Container>
          <SectionHeading id="about-values" eyebrow="How we work" title="What you can expect on every project." />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="rounded-[4px] border border-line bg-white p-6 sm:p-8">
                <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-20" aria-labelledby="about-divisions">
        <Container>
          <SectionHeading
            id="about-divisions"
            eyebrow="Two service areas"
            title="One business. Two clearly defined divisions."
            description="Choose the area that matches your property to see the services, process and answers to common questions."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              { title: "Residential / Home Services", text: "For homeowners, landlords and residential property owners.", href: "/residential", img: resImg },
              { title: "Commercial & Industrial", text: "For businesses, property managers, contractors and industrial clients.", href: "/commercial-industrial", img: comImg },
            ].map((d) => (
              <Link key={d.href} href={d.href} className="on-dark group relative isolate block h-[260px] overflow-hidden rounded-[2px] bg-ink text-white sm:h-[320px]">
                <SafeImage src={d.img.url} alt={d.img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
                <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 to-black/10" />
                <span className="absolute inset-x-0 bottom-0 block p-6 sm:p-8">
                  <span className="block text-2xl font-extrabold sm:text-[1.9rem]">{d.title}</span>
                  <span className="mt-1.5 block text-white/85">{d.text}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                    Explore <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-mist py-12">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <MapPin aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" strokeWidth={1.6} />
            <div>
              <h2 className="text-xl font-bold">Serving {settings.serviceArea}</h2>
              <p className="mt-1 text-muted">Residential and commercial properties across Calgary.</p>
            </div>
          </div>
          <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
            View project gallery <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </Container>
      </section>

      <QuoteSection phone={settings.phone} phoneHref={settings.phoneHref} email={settings.email} sourcePage="/about" />
    </>
  );
}
