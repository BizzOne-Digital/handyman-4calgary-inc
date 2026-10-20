import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";
import { groupsFor, type Division } from "@/lib/constants";
import type { PublicService } from "@/lib/content/queries";

/**
 * Service-group cards for a division: image (from the group's first service), title, summary
 * and a link list of every service in the group. Driven entirely by admin-managed services.
 */
export function GroupCards({
  division,
  services,
  variant = "full",
}: {
  division: Division;
  services: PublicService[];
  /** "compact" is used on the homepage, where two divisions sit side by side. */
  variant?: "full" | "compact";
}) {
  const groups = groupsFor(division)
    .map((g) => ({ ...g, services: services.filter((s) => s.group === g.key) }))
    .filter((g) => g.services.length > 0);
  if (variant === "compact") return <GroupRows groups={groups} />;

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {groups.map((g, i) => {
        const cover = g.services.find((s) => s.image) ?? g.services[0];
        return (
          <Reveal as="li" key={g.key} delay={i * 80} className="flex flex-col overflow-hidden rounded-[4px] border border-line bg-white">
            <Link href={g.path} className="group relative block aspect-[16/10] overflow-hidden bg-line">
              <SafeImage
                src={cover.image}
                alt={cover.imageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </Link>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-xl font-bold leading-snug">
                <Link href={g.path} className="hover:underline hover:underline-offset-4">
                  {g.title}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{g.summary}</p>
              <ul className="mt-4 space-y-1 border-t border-line pt-3">
                {g.services.map((s) => (
                  <li key={s.id}>
                    <Link href={s.href} className="group flex min-h-9 items-center justify-between gap-3 text-sm text-graphite hover:text-ink">
                      <span>{s.title}</span>
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

type GroupWithServices = ReturnType<typeof groupsFor>[number] & { services: PublicService[] };

/** Homepage variant: one row per group (photo + title + service links), readable at half-page width. */
function GroupRows({ groups }: { groups: GroupWithServices[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {groups.map((g, i) => {
        const cover = g.services.find((s) => s.image) ?? g.services[0];
        return (
          <Reveal as="li" key={g.key} delay={i * 70} className="flex gap-4 py-5 sm:gap-6">
            <Link href={g.path} className="group relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[2px] bg-line sm:w-40">
              <SafeImage
                src={cover.image}
                alt={cover.imageAlt}
                fill
                sizes="(min-width: 640px) 160px, 96px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <h4 className="text-[17px] font-bold leading-snug sm:text-lg">
                <Link href={g.path} className="group inline-flex items-start gap-2 hover:underline hover:underline-offset-4">
                  {g.title}
                  <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </h4>
              <ul className="mt-2 flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-muted">
                {g.services.map((s, si) => (
                  <li key={s.id}>
                    <Link href={s.href} className="hover:text-ink hover:underline hover:underline-offset-2">
                      {s.title}
                    </Link>
                    {si < g.services.length - 1 && <span aria-hidden="true" className="ml-1.5 text-subtle">|</span>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
