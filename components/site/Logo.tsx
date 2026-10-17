import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

/** Renders the brand logo (emblem + wordmark) at its original ~1.6:1 proportions. */
export function Logo({
  src,
  alt,
  className = "h-14 lg:h-[76px]",
  priority = false,
}: {
  src: string;
  alt: string;
  /** Set the logo height; width follows the aspect ratio. */
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link href="/" className={`relative block aspect-[900/564] shrink-0 ${className}`} aria-label="Handyman 4 Calgary home">
      <SafeImage src={src} alt={alt} fill sizes="160px" priority={priority} className="object-contain object-left" />
    </Link>
  );
}
