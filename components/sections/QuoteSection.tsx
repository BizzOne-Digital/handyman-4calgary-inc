import { Mail, Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container } from "@/components/ui/layout";
import type { Division } from "@/lib/constants";

/** Charcoal "Let's talk" section with the compact quote form, as in the mockup. */
export function QuoteSection({
  phone,
  phoneHref,
  email,
  sourcePage,
  defaultDivision,
  defaultService,
  heading = "Let’s talk about\nyour next project.",
  copy = "Tell us what you have in mind. We’ll help you take the next step.",
}: {
  phone: string;
  phoneHref: string;
  email: string;
  sourcePage: string;
  defaultDivision?: Division;
  defaultService?: string;
  heading?: string;
  copy?: string;
}) {
  const [l1, l2] = heading.split("\n");
  return (
    <section id="quote" className="bg-charcoal py-14 sm:py-20" aria-labelledby="quote-heading">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="on-dark text-white">
          <h2 id="quote-heading" className="text-[2.1rem] font-extrabold leading-[1.04] sm:text-5xl lg:text-[3.3rem]">
            {l1}
            {l2 && (
              <>
                <br />
                {l2}
              </>
            )}
          </h2>
          <p className="mt-5 max-w-md text-base text-white/80 sm:text-lg">{copy}</p>
          <ul className="mt-8 space-y-4">
            <li>
              <a href={phoneHref} className="inline-flex min-h-11 items-center gap-4 text-xl font-semibold hover:underline sm:text-2xl">
                <Phone aria-hidden="true" className="h-6 w-6" /> {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-4 break-all text-lg font-medium hover:underline sm:text-xl">
                <Mail aria-hidden="true" className="h-6 w-6 shrink-0" /> {email}
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-[4px] bg-white p-5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:p-8">
          <QuoteForm
            variant="compact"
            title="Request a Quote"
            sourcePage={sourcePage}
            defaultDivision={defaultDivision}
            defaultService={defaultService}
          />
        </div>
      </Container>
    </section>
  );
}
