import { Container, SectionHeading } from "@/components/ui/layout";
import { TextLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicService } from "@/lib/content/queries";
import { ServiceThumb } from "./ServiceCard";

export function ServicesOverview({ residential, commercial }: { residential: PublicService[]; commercial: PublicService[] }) {
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Expertise for every space"
            title="The right team for your next project."
            id="services-heading"
          />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-0">
          <Group
            title="Residential / Home Services"
            services={residential}
            linkLabel="View residential services"
            linkHref="/residential"
            className="lg:border-r lg:border-line lg:pr-10"
          />
          <Group
            title="Commercial & Industrial"
            services={commercial}
            linkLabel="View commercial services"
            linkHref="/commercial-industrial"
            className="lg:pl-10"
            delay={120}
          />
        </div>
      </Container>
    </section>
  );
}

function Group({
  title,
  services,
  linkLabel,
  linkHref,
  className,
  delay,
}: {
  title: string;
  services: PublicService[];
  linkLabel: string;
  linkHref: string;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal className={className} delay={delay}>
      <h3 className="text-xl font-bold sm:text-[1.4rem]">{title}</h3>
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
        {services.slice(0, 3).map((s) => (
          <li key={s.id}>
            <ServiceThumb href={s.href || linkHref} title={s.title} image={s.image} alt={s.imageAlt} />
          </li>
        ))}
      </ul>
      <TextLink href={linkHref} className="mt-7">
        {linkLabel}
      </TextLink>
    </Reveal>
  );
}
