import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

type Panel = { title: string; copy: string; cta: string; href: string; image: string; alt: string };

/** The two equal division choices directly under the home hero (core of the mockup). */
export function DivisionPanels({ panels }: { panels: [Panel, Panel] }) {
  return (
    <section aria-label="Choose a service area" className="grid grid-cols-1 gap-[3px] bg-white md:grid-cols-2">
      {panels.map((p, i) => (
        <Link
          key={p.href}
          href={p.href}
          className="on-dark group relative isolate block h-[260px] overflow-hidden bg-ink text-white outline-none sm:h-[340px] md:h-[400px] lg:h-[460px] xl:h-[500px] focus-visible:outline-[3px] focus-visible:outline-offset-[-6px] focus-visible:outline-white"
        >
          <SafeImage
            src={p.image}
            alt={p.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.045] group-focus-visible:scale-[1.045]"
            fallbackClassName="-z-10 bg-graphite"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/0" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-11">
            <h2 className="text-[1.65rem] font-extrabold leading-[1.05] sm:text-3xl lg:text-[2.35rem]">{p.title}</h2>
            <p className="mt-2 text-[15px] text-white/85 sm:text-base lg:text-lg">{p.copy}</p>
            <span className="mt-4 inline-flex min-h-11 items-center gap-2.5 rounded-[3px] border-[1.5px] border-white px-4 text-sm font-semibold transition-colors group-hover:bg-white group-hover:text-ink sm:mt-5 sm:px-6">
              {p.cta}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
