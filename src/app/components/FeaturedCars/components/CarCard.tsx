import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CarStats from "./CarStats";

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  features: string[];
  category: "mercedes" | "bmw";
  stats: {
    hp: number;
    topSpeed: string;
    acceleration: string;
  };
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="group bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-blue-600/30 transition-all duration-500">
      <div className="relative h-64 overflow-hidden bg-white/50 dark:bg-black/20">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="group relative h-[260px] overflow-hidden">
  <Image
    src={car.image}
    alt={`${car.brand} ${car.model}`}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="
      object-contain
      p-6
      transform
      transition-transform
      duration-700
      ease-out
      scale-100
      group-hover:scale-110
      will-change-transform
    "
  />
</div>
        
        <div className="absolute top-4 left-4 z-20">
          <div className="flex flex-col gap-2">
            <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-bold tracking-widest uppercase rounded-full border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
              {car.brand}
            </span>
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm w-fit">
              {car.year}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {car.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {car.category} Series
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider mb-1">Starting at</p>
            <span className="text-xl font-black text-gray-900 dark:text-white">
              ${(car.price / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <CarStats 
          hp={car.stats.hp} 
          topSpeed={car.stats.topSpeed} 
          acceleration={car.stats.acceleration} 
        />

        <button className="group/btn w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300">
          Explore Details
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

export default CarCard;
