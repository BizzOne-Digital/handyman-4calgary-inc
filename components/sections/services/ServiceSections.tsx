import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import type { PublicProject, PublicService } from "@/lib/content/queries";

/**
 * One anchored section per service, alternating image side. Shows up to three gallery photos
 * linked to the service, so real project photos appear here as soon as they are added in the admin.
 */
export function ServiceSections({
  services,
  projects,
  startTone = "light",
}: {
  services: PublicService[];
  projects: PublicProject[];
  startTone?: "light" | "mist";
}) {
  if (!services.length) return null;
  return (
    <>
      {services.map((s, i) => {
        const mist = (i % 2 === 0) === (startTone === "mist");
        // Skip the photo already used as the service image, so it is not shown twice.
        const photos = projects.filter((p) => p.serviceKey === s.key && p.image !== s.image).slice(0, 3);
        const quoteHref = `/request-a-quote?division=${s.division}&service=${s.key}`;
        return (
          <section key={s.id} id={s.key} className={`${mist ? "bg-mist" : "bg-white"} py-14 sm:py-20`} aria-labelledby={`${s.key}-title`}>
            <Container className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[2px] bg-line ${i % 2 ? "md:order-2" : ""}`}>
                <SafeImage src={s.image} alt={s.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <Reveal>
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${s.key}-title`} className="mt-3 text-[1.75rem] font-extrabold leading-[1.1] sm:text-[2.2rem]">
                  {s.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-[17px]">{s.description || s.summary}</p>
                {s.highlights.length > 0 && (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-[15px]">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-ink text-white">
                          <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={quoteHref}
                  className="group mt-8 inline-flex min-h-11 items-center gap-2.5 rounded-[3px] border-[1.5px] border-ink px-5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  Request a quote for this service
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </Container>
            {photos.length > 0 && (
              <Container className="mt-8">
                <ul className="grid grid-cols-3 gap-2 sm:gap-4" aria-label={`${s.title} project photos`}>
                  {photos.map((p) => (
                    <li key={p.id}>
                      <Link href="/projects" className="group relative block aspect-[4/3] overflow-hidden rounded-[2px] bg-line">
                        <SafeImage
                          src={p.image}
                          alt={p.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 400px, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
                {photos.some((p) => p.illustrative) && (
                  <p className="mt-2 text-xs text-subtle">Illustrative examples, not completed client projects.</p>
                )}
              </Container>
            )}
          </section>
        );
      })}
    </>
  );
}
