import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/layout";

export function CtaBand({
  title,
  copy,
  href,
  label,
  phone,
  phoneHref,
}: {
  title: string;
  copy: string;
  href: string;
  label: string;
  phone: string;
  phoneHref: string;
}) {
  return (
    <section className="on-dark bg-charcoal py-14 text-white sm:py-16">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[1.9rem] font-extrabold leading-[1.08] sm:text-[2.5rem]">{title}</h2>
          <p className="mt-4 text-base text-white/80 sm:text-lg">{copy}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href={href} variant="light">
            {label}
          </ButtonLink>
          <a
            href={phoneHref}
            className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[3px] border-[1.5px] border-white/70 px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-ink"
          >
            <Phone aria-hidden="true" className="h-4 w-4" /> {phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
