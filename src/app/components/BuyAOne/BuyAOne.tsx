"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppSelector } from "@/hooks";
import { BuyImage } from "./components/BuyImage";
import { BuyContent } from "./components/BuyContent";

gsap.registerPlugin(ScrollTrigger);

const BuyAOne = () => {
    const [mounted, setMounted] = useState(false);
    const theme = useAppSelector((state) => state.theme.theme);
    const carWrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && carWrapperRef.current) {
            gsap.fromTo(
                carWrapperRef.current,
                { opacity: 0, x: "100vw" },
                {
                    opacity: 1,
                    x: 0,
                    duration: 4,
                    ease: "power3.out",
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: carWrapperRef.current,
                        start: "top 80%",
                    }
                }
            );
        }

        if (mounted && contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: "top 80%",
                    }
                }
            );
        }
    }, [mounted]);

    const imageSrc = "/images/Gclass.png";
    const imageAlt = "Mercedes G-Class - Buy in 30 Minutes";

    return (
        <section className="relative overflow-hidden bg-white dark:bg-black py-24 flex items-center border-t border-gray-50 dark:border-gray-900">
            <div className="container max-w-7xl mx-auto px-4 w-full z-10 relative">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <BuyContent ref={contentRef} />
                    <BuyImage
                        ref={carWrapperRef}
                        imageSrc={imageSrc}
                        imageAlt={imageAlt}
                    />
                </div>
            </div>
        </section>
    );
}

export default BuyAOne;
