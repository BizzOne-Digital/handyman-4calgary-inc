import { Phone } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container, Lines } from "@/components/ui/layout";
import { SafeImage } from "@/components/ui/SafeImage";
import type { PageData } from "@/models/PageContent";

/** Full-bleed photographic hero with dark overlay, used on division, service and About pages. */
export function ImageHero({
  hero,
  crumbs,
  phone,
  phoneHref,
}: {
  hero: PageData["hero"];
  crumbs: Crumb[];
  phone?: string;
  phoneHref?: string;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <SafeImage
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
        fallbackClassName="-z-10 bg-graphite"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/25" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      <Container className="flex min-h-[400px] flex-col justify-end py-10 sm:min-h-[460px] sm:py-14 lg:min-h-[520px] lg:py-16">
        <Breadcrumbs items={crumbs} tone="light" />
        <p className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/75">{hero.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[2.1rem] font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
          <Lines text={hero.heading} />
        </h1>
        {hero.description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{hero.description}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {hero.ctaLabel && hero.ctaHref && (
            <ButtonLink href={hero.ctaHref} variant="light">
              {hero.ctaLabel}
            </ButtonLink>
          )}
          {phone && phoneHref && (
            <a
              href={phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[3px] border-[1.5px] border-white/70 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              <Phone aria-hidden="true" className="h-4 w-4" /> Call {phone}
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Light text-only hero for utility pages (Projects, Request a Quote, Contact). */
export function SimpleHero({ hero, crumbs, children }: { hero: PageData["hero"]; crumbs: Crumb[]; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line bg-mist">
      <Container className="py-10 sm:py-14 lg:py-16">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-8">{hero.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[2.1rem] font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
          <Lines text={hero.heading} />
        </h1>
        {hero.description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{hero.description}</p>}
        {children}
      </Container>
    </section>
  );
}
