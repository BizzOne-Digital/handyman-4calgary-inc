import Link from "next/link";
import { ArrowRight, Building, Home, KeyRound } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { ImageHero } from "@/components/sections/PageHero";
import { DEFAULT_STEPS, Process } from "@/components/sections/Process";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
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
            title="Three ways we improve your home."
            description="Choose a service to see the typical scope, how projects run and answers to common questions."
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 90}>
                <Link href={s.href || "/residential"} className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
                  <span className="relative block aspect-[16/10] overflow-hidden bg-mist">
                    <SafeImage src={s.image} alt={s.imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  </span>
                  <span className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <span className="mt-2 text-[15px] leading-relaxed text-muted">{s.description || s.summary}</span>
                    {s.highlights.length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-sm text-graphite">
                        {s.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-ink" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
                      View service <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
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
