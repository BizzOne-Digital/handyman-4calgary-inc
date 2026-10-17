"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveImageUrl } from "@/lib/content/images";

type Props = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src?: string | null;
  alt: string;
  /** Classes for the fallback block (only used when the image cannot be shown). */
  fallbackClassName?: string;
};

/** Legacy local-disk URLs from an earlier system; these files no longer exist. */
const isLegacy = (src: string) => src.startsWith("/uploads/");
/** MongoDB-stored images are served directly with immutable caching. */
const isStored = (src: string) => src.startsWith("/api/uploads/");
const isAllowed = (src: string) =>
  src.startsWith("/") || src.startsWith("https://images.unsplash.com/");

/**
 * Renders Unsplash and /api/uploads/** images with a non-recursive fallback for missing,
 * legacy or broken sources.
 */
export function SafeImage({ src: source, alt, fallbackClassName, className, fill, width, height, ...rest }: Props) {
  const src = resolveImageUrl(source);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const usable = src && !isLegacy(src) && isAllowed(src) && failedSrc !== src;

  if (!usable) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className={`flex items-center justify-center bg-mist text-subtle ${fill ? "absolute inset-0" : ""} ${fallbackClassName ?? className ?? ""}`}
        style={!fill && width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
      >
        <ImageOff aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      unoptimized={isStored(src) || rest.unoptimized}
      onError={() => setFailedSrc(src)}
    />
  );
}
