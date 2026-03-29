"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SectionHeader from "./components/SectionHeader";
import CarCard, { Car } from "./components/CarCard";
import InventoryCallout from "./components/InventoryCallout";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const mockCars: Car[] = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    model: "S 580",
    year: 2024,
    price: 125000,
    image: "/images/mercedes.png",
    features: ["V8 Engine", "Luxury Interior", "Advanced Safety"],
    category: "mercedes",
    stats: { hp: 496, topSpeed: "155 mph", acceleration: "4.4s" },
  },
  {
    id: 2,
    name: "BMW M5 Competition",
    brand: "BMW",
    model: "M5",
    year: 2024,
    price: 115000,
    image: "/images/BMW.png",
    features: ["Twin Turbo", "Sport Mode", "Carbon Fiber"],
    category: "bmw",
    stats: { hp: 617, topSpeed: "190 mph", acceleration: "3.2s" },
  },
  {
    id: 3,
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    model: "S 580",
    year: 2024,
    price: 125000,
    image: "/images/mercedes.png",
    features: ["V8 Engine", "Luxury Interior", "Advanced Safety"],
    category: "mercedes",
    stats: { hp: 496, topSpeed: "155 mph", acceleration: "4.4s" },
  },
  {
    id: 4,
    name: "BMW M5 Competition",
    brand: "BMW",
    model: "M5",
    year: 2024,
    price: 115000,
    image: "/images/BMW.png",
    features: ["Twin Turbo", "Sport Mode", "Carbon Fiber"],
    category: "bmw",
    stats: { hp: 617, topSpeed: "190 mph", acceleration: "3.2s" },
  },
  {
    id: 5,
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    model: "S 580",
    year: 2024,
    price: 125000,
    image: "/images/mercedes.png",
    features: ["V8 Engine", "Luxury Interior", "Advanced Safety"],
    category: "mercedes",
    stats: { hp: 496, topSpeed: "155 mph", acceleration: "4.4s" },
  },
  {
    id: 6,
    name: "BMW M5 Competition",
    brand: "BMW",
    model: "M5",
    year: 2024,
    price: 115000,
    image: "/images/BMW.png",
    features: ["Twin Turbo", "Sport Mode", "Carbon Fiber"],
    category: "bmw",
    stats: { hp: 617, topSpeed: "190 mph", acceleration: "3.2s" },
  },
  {
    id: 7,
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    model: "S 580",
    year: 2024,
    price: 125000,
    image: "/images/mercedes.png",
    features: ["V8 Engine", "Luxury Interior", "Advanced Safety"],
    category: "mercedes",
    stats: { hp: 496, topSpeed: "155 mph", acceleration: "4.4s" },
  },
  {
    id: 8,
    name: "BMW M5 Competition",
    brand: "BMW",
    model: "M5",
    year: 2024,
    price: 115000,
    image: "/images/BMW.png",
    features: ["Twin Turbo", "Sport Mode", "Carbon Fiber"],
    category: "bmw",
    stats: { hp: 617, topSpeed: "190 mph", acceleration: "3.2s" },
  },
];

const FeaturedCars = () => {
  const nextElClass = "swiper-button-next-custom";
  const prevElClass = "swiper-button-prev-custom";

  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        <SectionHeader 
          title="Featured"
          highlight="Collections"
          description="Hand-picked performance vehicles that redefine luxury and engineering excellence."
          prevEl={`.${prevElClass}`}
          nextEl={`.${nextElClass}`}
        />

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: `.${nextElClass}`,
              prevEl: `.${prevElClass}`,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-gray-300 dark:!bg-gray-700 !opacity-100",
              bulletActiveClass: "!bg-blue-600 !w-6 !rounded-full transition-all duration-300",
            }}
            loop={true}
            className="featured-cars-swiper !pb-12"
          >
            {mockCars.map((car) => (
              <SwiperSlide key={car.id}>
                <CarCard car={car} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <InventoryCallout />
      </div>
    </section>
  );
}

export default FeaturedCars;
