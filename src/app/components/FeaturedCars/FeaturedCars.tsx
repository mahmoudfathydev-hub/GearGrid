"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import SectionHeader from "./components/SectionHeader";
import CarCard, { Car } from "./components/CarCard";
import InventoryCallout from "./components/InventoryCallout";
import { useCars } from "@/hooks/useCars";
import { fetchCars } from "@/store/Cars/CarsSlice";
import { useAppDispatch } from "@/hooks";
import { Cars } from "@/store/Cars/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedCars = () => {
  const dispatch = useAppDispatch();
  const { cars } = useCars();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  useEffect(() => {
    if (cars.length > 0) {
      console.log("Cars data from Redux:", cars);
      console.log("First car structure:", cars[0]);

      const transformedCars: Car[] = cars.map((car: Cars) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.car_type,
        year: car.year_of_manufacture,
        price: car.price,
        image: (() => {
          console.log(`Processing image for car ${car.id}:`, car.image_urls);
          console.log(`Type of image_urls:`, typeof car.image_urls);
          console.log(`Is array:`, Array.isArray(car.image_urls));

          // Handle image_urls field from database
          let imageArray: string[] = [];

          if (typeof car.image_urls === "string") {
            // It's a JSON string, parse it
            try {
              imageArray = JSON.parse(car.image_urls);
              console.log("Parsed JSON string to array:", imageArray);
            } catch (e) {
              console.log("Failed to parse JSON string:", e);
              imageArray = [];
            }
          } else if (Array.isArray(car.image_urls)) {
            // It's already an array
            imageArray = car.image_urls;
            console.log("Using existing array:", imageArray);
          }

          // Use first image from array if available
          if (imageArray.length > 0) {
            const firstImage = imageArray[0];
            console.log("Using first image from array:", firstImage);
            return firstImage;
          }

          console.log("Using fallback image");
          // Fallback to known working image
          return "/images/1.png";
        })(),
        features: car.features_amenities
          ? car.features_amenities.split(",").map((f: string) => f.trim())
          : [],
        category: car.brand.toLowerCase(),
        stats: {
          hp: car.horse_power,
          topSpeed: "155 mph",
          acceleration: "4.4s",
        },
      }));

      const shuffled = [...transformedCars].sort(() => 0.5 - Math.random());
      setFeaturedCars(shuffled.slice(0, 8));
    }
  }, [cars]);

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
              bulletClass:
                "swiper-pagination-bullet !bg-gray-300 dark:!bg-gray-700 !opacity-100",
              bulletActiveClass:
                "!bg-blue-600 !w-6 !rounded-full transition-all duration-300",
            }}
            loop={true}
            className="featured-cars-swiper !pb-12"
          >
            {featuredCars.map((car) => (
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
};

export default FeaturedCars;
