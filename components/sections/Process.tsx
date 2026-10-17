import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

export type Step = { title: string; text: string };

export function Process({
  steps,
  eyebrow = "How it works",
  title = "A clear process from first call to completion.",
  tone = "light",
}: {
  steps: Step[];
  eyebrow?: string;
  title?: string;
  tone?: "light" | "mist";
}) {
  return (
    <section className={`${tone === "mist" ? "bg-mist" : "bg-white"} py-14 sm:py-20`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="bg-white p-6 sm:p-7">
              <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-widest text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export const DEFAULT_STEPS: Step[] = [
  { title: "Tell us about the project", text: "Share the property, the scope you have in mind and any timing that matters to you." },
  { title: "Review and site visit", text: "We ask the right questions and visit the property where it helps us understand the work." },
  { title: "Clear proposal", text: "You receive a quote that sets out the scope, so you know what is and is not included." },
  { title: "Planned delivery", text: "Work is scheduled and carried out in a clear sequence, with updates along the way." },
];
