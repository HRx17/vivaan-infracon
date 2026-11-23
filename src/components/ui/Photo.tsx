"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** next/image with the brand's warm grade and a quiet fallback if a photo fails to load. */
export function Photo({ className, alt, src, ...rest }: Omit<ImageProps, "src"> & { src?: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    if (!rest.fill) {
      return (
        <div role="img" aria-label={alt} className="relative aspect-[4/3] w-full bg-gradient-to-br from-surface to-line">
          <span aria-hidden className="absolute bottom-4 left-4 h-px w-12 bg-accent" />
        </div>
      );
    }
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("absolute inset-0 bg-gradient-to-br from-surface to-line", className)}
      >
        <span aria-hidden className="absolute bottom-4 left-4 h-px w-12 bg-accent" />
      </div>
    );
  }
  return <Image src={src} alt={alt} className={cn("photo-warm object-cover", className)} onError={() => setFailed(true)} {...rest} />;
}
