import { CalendarCheck, ClipboardCheck, HardHat, MessageSquare, Ruler, Wrench } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

const POINTS = [
  { icon: HardHat, title: "Approximately 20 years in construction", text: "Practical experience gained on construction work across Canada, now focused on Calgary." },
  { icon: ClipboardCheck, title: "Clear scope before work starts", text: "You know what is included, what is not, and how the work will be sequenced." },
  { icon: MessageSquare, title: "Straightforward communication", text: "Realistic expectations, direct answers and updates while the work is underway." },
  { icon: Ruler, title: "Attention to finishing", text: "Framing, drywall, trim and paint completed with care, because the details are what you see every day." },
  { icon: CalendarCheck, title: "Project-based or ongoing", text: "Defined renovation projects, or recurring maintenance for properties that need regular attention." },
  { icon: Wrench, title: "One accountable contact", text: "A single point of contact for your project, from the first conversation to the final walkthrough." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="why-heading">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-16">
          <SectionHeading id="why-heading" eyebrow="Why Handyman 4 Calgary" title="Practical, planned and properly finished." />
          <p className="text-base leading-relaxed text-muted sm:text-[17px]">
            Whether it is a basement in a family home or maintenance for an industrial building, the approach is the same:
            understand the property, agree a clear scope and deliver the work properly.
          </p>
        </div>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 80} className="bg-white p-6 sm:p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[3px] bg-ink text-white">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
