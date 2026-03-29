"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function CustomSwiper() {
  const ImagesInSwiper = [
    {
      id: 1,
      src: "/images/1.png",
      title: "Elevate Your Drive",
      subTitle: "Experience the ultimate in automotive luxury and performance.",
    },
    {
      id: 2,
      src: "/images/2.png",
      title: "Precision Engineering",
      subTitle: "Discover cars built with passion and unmatched craftsmanship.",
    },
    {
      id: 3,
      src: "/images/3.png",
      title: "Join GearGrid Today",
      subTitle: "The world's most exclusive automotive community awaits you.",
    },
  ];

  return (
    <div className="h-screen w-full relative group">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
            clickable: true,
            dynamicBullets: true,
        }}
        loop={true}
        className="h-full w-full"
      >
        {ImagesInSwiper.map((image) => (
          <SwiperSlide key={image.id} className="relative h-full w-full overflow-hidden">
            
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
            
            
            {/* Gradient Overlay for better text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent shadow-inset" />

            <div className="absolute bottom-16 left-12 right-12 z-10 space-y-4 max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight animate-fade-up">
                {image.title}
              </h2>
              <p className="text-xl text-gray-200 font-medium max-w-lg animate-fade-up [animation-delay:200ms]">
                {image.subTitle}
              </p>
              
              <div className="pt-4 flex items-center gap-4 animate-fade-up [animation-delay:400ms]">
                  <div className="h-1 w-20 bg-blue-600 rounded-full" />
                  <span className="text-white/60 font-semibold tracking-widest uppercase text-xs">GearGrid Exclusive</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Styles for Swiper Pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #2563eb !important;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default CustomSwiper;
