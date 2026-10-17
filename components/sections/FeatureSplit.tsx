import { Check } from "lucide-react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

/** Image + copy + checklist, alternating sides. Used for scope sections on service pages. */
export function FeatureSplit({
  id,
  eyebrow,
  title,
  body,
  points,
  image,
  alt,
  reverse = false,
  tone = "light",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body: string;
  points?: string[];
  image: string;
  alt: string;
  reverse?: boolean;
  tone?: "light" | "mist";
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={`${tone === "mist" ? "bg-mist" : "bg-white"} py-14 sm:py-20`}>
      <Container className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
        <div className={`relative aspect-[4/3] overflow-hidden rounded-[2px] bg-mist ${reverse ? "md:order-2" : ""}`}>
          <SafeImage src={image} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <Reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 text-[1.75rem] font-extrabold leading-[1.1] sm:text-[2.2rem]">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-[17px]">{body}</p>
          {points && points.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-ink text-white">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
