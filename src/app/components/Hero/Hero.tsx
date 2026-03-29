"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hooks";
import gsap from "gsap";
import { HeroContent, HeroImage, HeroButtons } from "./components";

function Hero() {
  const [mounted, setMounted] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && textRef.current && carWrapperRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      );

      gsap.fromTo(
        carWrapperRef.current,
        { opacity: 0, x: "100vw" },
        { opacity: 1, x: 0, duration: 4, ease: "power3.out", delay: 0.2 },
      );
    }
  }, [mounted, theme]);

  const isDark = mounted ? theme === "dark" : false;
  const imageSrc = isDark ? "/images/Corveitte.png" : "/images/RAM.png";
  const imageAlt = isDark ? "Dark Corvette" : "Light RAM Truck";

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black min-h-[calc(100vh-4rem)] flex items-center">
      <div className="container max-w-7xl mx-auto px-4 w-full relative py-12 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12">
          <div className="lg:w-[38%] z-10 relative">
            <HeroContent ref={textRef}>
              <HeroButtons />
            </HeroContent>
          </div>

          <HeroImage 
            ref={carWrapperRef}
            imageSrc={imageSrc}
            imageAlt={imageAlt}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
