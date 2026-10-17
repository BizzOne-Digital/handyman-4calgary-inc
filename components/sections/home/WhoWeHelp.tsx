import Link from "next/link";
import { ArrowRight, Briefcase, Building, ClipboardList, Factory, HardHat, Home, KeyRound } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

const GROUPS = [
  {
    title: "Residential / Home Services",
    href: "/residential",
    cta: "Explore residential services",
    copy: "Renovations and improvements that make a home work better, from finished basements to updated kitchens and bathrooms.",
    people: [
      { icon: Home, label: "Homeowners", text: "Planned renovations and home improvements." },
      { icon: KeyRound, label: "Landlords", text: "Renovations between tenancies and ongoing upkeep." },
      { icon: Building, label: "Residential property owners", text: "Improvements and maintenance across properties." },
    ],
  },
  {
    title: "Commercial & Industrial",
    href: "/commercial-industrial",
    cta: "Explore commercial services",
    copy: "Improvement projects and building maintenance that keep commercial spaces and industrial facilities working well.",
    people: [
      { icon: Briefcase, label: "Business owners", text: "Office and retail improvements and renovations." },
      { icon: ClipboardList, label: "Property & facility managers", text: "Repairs, upkeep and maintenance arrangements." },
      { icon: HardHat, label: "General contractors", text: "Interior trades on a project basis." },
      { icon: Factory, label: "Industrial clients", text: "Industrial building repairs and maintenance." },
    ],
  },
];

/** Shows each division's audience so visitors can self-identify quickly. */
export function WhoWeHelp() {
  return (
    <section className="border-t border-line bg-mist py-14 sm:py-20" aria-labelledby="who-heading">
      <Container>
        <SectionHeading
          id="who-heading"
          eyebrow="Who we work with"
          title="Built around two kinds of clients."
          description="Every enquiry is handled by the division that fits your property, so you get the right scope, process and communication from the start."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.href} delay={gi * 100} className="flex flex-col rounded-[4px] border border-line bg-white p-6 sm:p-8">
              <h3 className="text-xl font-bold sm:text-2xl">{g.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{g.copy}</p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {g.people.map(({ icon: Icon, label, text }) => (
                  <li key={label} className="flex items-start gap-4 py-4">
                    <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.7} />
                    <span>
                      <span className="block font-semibold">{label}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={g.href} className="group mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold underline underline-offset-4">
                {g.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
