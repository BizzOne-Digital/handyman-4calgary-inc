import { Plus } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/layout";
import { JsonLd } from "@/components/ui/JsonLd";
import type { PageFaq } from "@/models/PageContent";

export function Faq({ faqs, title = "Frequently asked questions" }: { faqs: PageFaq[]; title?: string }) {
  const items = faqs.filter((f) => f.question && f.answer);
  if (!items.length) return null;
  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="faq-heading">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow="FAQs" title={title} id="faq-heading" />
        </div>
        <div className="border-t border-line">
          {items.map((f) => (
            <details key={f.question} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="pb-5 pr-10 leading-relaxed text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
    </section>
  );
}
