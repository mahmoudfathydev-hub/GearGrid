import { forwardRef } from "react";
import Image from "next/image";

interface BuyImageProps {
  imageSrc: string;
  imageAlt: string;
}

export const BuyImage = forwardRef<HTMLDivElement, BuyImageProps>(
  ({ imageSrc, imageAlt }, ref) => {
    return (
      <div className="lg:w-[60%] flex justify-center lg:justify-end mt-12 lg:mt-0">
        <div
          ref={ref}
          className="relative w-full max-w-3xl aspect-[16/9] lg:scale-110 xl:scale-125"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain drop-shadow-xl transition-opacity duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/30 dark:bg-white/10 blur-xl rounded-[100%] pointer-events-none" />
        </div>
      </div>
    );
  }
);