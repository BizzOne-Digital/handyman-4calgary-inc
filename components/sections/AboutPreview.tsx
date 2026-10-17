import { ButtonLink } from "@/components/ui/ButtonLink";
import { Lines } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SafeImage } from "@/components/ui/SafeImage";

export function AboutPreview({ heading, body, image, alt }: { heading: string; body: string; image: string; alt: string }) {
  return (
    <section className="grid bg-mist md:grid-cols-2" aria-labelledby="about-preview-heading">
      <div className="relative min-h-[280px] sm:min-h-[380px] md:min-h-[460px]">
        <SafeImage src={image} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <Reveal className="flex items-center px-4 py-12 sm:px-10 md:px-12 lg:px-16 lg:py-16">
        <div className="max-w-xl">
          <p className="eyebrow">About Handyman 4 Calgary</p>
          <h2 id="about-preview-heading" className="mt-4 text-[2rem] font-extrabold leading-[1.04] sm:text-[2.6rem] lg:text-[3rem]">
            <Lines text={heading} />
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-[17px]">{body}</p>
          <ButtonLink href="/about" variant="outline" className="mt-8">
            Meet your local team
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
