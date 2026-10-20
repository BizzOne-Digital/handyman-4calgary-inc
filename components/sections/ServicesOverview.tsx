import { Container, SectionHeading } from "@/components/ui/layout";
import { TextLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicService } from "@/lib/content/queries";
import { GroupCards } from "./services/GroupCards";

/** Homepage overview: both divisions side by side, each with its service groups and every service. */
export function ServicesOverview({ residential, commercial }: { residential: PublicService[]; commercial: PublicService[] }) {
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Expertise for every space"
            title="The right team for your next project."
            description="Choose your division to see every service we offer, grouped the way projects usually come together."
            id="services-heading"
          />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-0">
          <Division
            title="Residential / Home Services"
            audience="For homeowners, landlords and residential property owners."
            division="residential"
            services={residential}
            linkLabel="View all residential services"
            linkHref="/residential"
            className="lg:border-r lg:border-line lg:pr-10"
          />
          <Division
            title="Commercial & Industrial"
            audience="For businesses, property managers, contractors and industrial clients."
            division="commercial"
            services={commercial}
            linkLabel="View all commercial services"
            linkHref="/commercial-industrial"
            className="lg:pl-10"
          />
        </div>
      </Container>
    </section>
  );
}

function Division({
  title,
  audience,
  division,
  services,
  linkLabel,
  linkHref,
  className,
}: {
  title: string;
  audience: string;
  division: "residential" | "commercial";
  services: PublicService[];
  linkLabel: string;
  linkHref: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold sm:text-[1.4rem]">{title}</h3>
      <p className="mt-1 text-sm text-muted">{audience}</p>
      <div className="mt-5">
        <GroupCards division={division} services={services} variant="compact" />
      </div>
      <TextLink href={linkHref} className="mt-7">
        {linkLabel}
      </TextLink>
    </div>
  );
}
