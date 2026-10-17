import Link from "next/link";
import { TextLink } from "@/components/ui/ButtonLink";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { DIVISION_LABELS } from "@/lib/constants";
import type { PublicProject } from "@/lib/content/queries";

/** A mixed preview of gallery items, balanced between both divisions. */
export function ProjectsPreview({ projects }: { projects: PublicProject[] }) {
  const res = projects.filter((p) => p.category === "residential");
  const com = projects.filter((p) => p.category === "commercial");
  const picks: PublicProject[] = [];
  for (let i = 0; picks.length < 6 && (i < res.length || i < com.length); i++) {
    if (res[i]) picks.push(res[i]);
    if (com[i] && picks.length < 6) picks.push(com[i]);
  }
  if (picks.length === 0) return null;
  const illustrative = picks.some((p) => p.illustrative);

  return (
    <section className="border-t border-line bg-mist py-14 sm:py-20" aria-labelledby="work-heading">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="work-heading" eyebrow="Projects" title="The kind of spaces we work on." />
          <TextLink href="/projects" className="shrink-0 self-start sm:self-auto">
            View the gallery
          </TextLink>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {picks.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 70}>
              <Link href="/projects" className="group relative block aspect-[4/3] overflow-hidden rounded-[2px] bg-line">
                <SafeImage
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <span className="on-dark absolute inset-x-0 bottom-0 p-3 text-white sm:p-5">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 sm:text-[11px]">
                    {DIVISION_LABELS[p.category]}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-snug sm:text-lg">{p.title}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        {illustrative && (
          <p className="mt-5 text-xs text-subtle">Images shown are illustrative examples of the type of work we do, not completed client projects.</p>
        )}
      </Container>
    </section>
  );
}
