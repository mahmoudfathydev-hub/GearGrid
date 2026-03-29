import { forwardRef } from "react";
import Image from "next/image";

interface HeroImageProps {
  imageSrc: string;
  imageAlt: string;
}

export const HeroImage = forwardRef<HTMLDivElement, HeroImageProps>(
  ({ imageSrc, imageAlt }, ref) => {
    return (
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[55%] z-0 pointer-events-none">
        <div
          ref={ref}
          className="relative w-full aspect-[16/9]"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain object-right drop-shadow-xl transition-opacity duration-300"
            priority
            sizes="55vw"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/30 dark:bg-white/10 blur-xl rounded-[100%] pointer-events-none" />
        </div>
      </div>
    );
  }
);

HeroImage.displayName = "HeroImage";
