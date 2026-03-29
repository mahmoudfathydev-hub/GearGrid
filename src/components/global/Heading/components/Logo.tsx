"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "" }: LogoProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1.2, delay: 0.8, ease: "power4.out" }
      );
    }
  }, []);

  return (
    <div className={`flex-shrink-0 flex items-center ${className}`}>
      <Image
        className="block"
        src="/images/logo.png"
        alt="GearGrid"
        width={100}
        height={100}
        priority
      />
      <span 
        ref={textRef}
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        GearGrid
      </span>
    </div>
  );
};
