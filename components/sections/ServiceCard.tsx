import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export function ServiceThumb({
  href,
  title,
  image,
  alt,
  sizes = "(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw",
}: {
  href: string;
  title: string;
  image: string;
  alt: string;
  sizes?: string;
}) {
  return (
    <Link href={href} className="group block">
      <span className="relative block aspect-[4/3.6] overflow-hidden rounded-[2px] bg-mist">
        <SafeImage
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </span>
      <span className="mt-3 flex items-start justify-between gap-2 text-[15px] font-semibold leading-snug">
        <span className="group-hover:underline group-hover:underline-offset-4">{title}</span>
        <ArrowRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </Link>
  );
}
