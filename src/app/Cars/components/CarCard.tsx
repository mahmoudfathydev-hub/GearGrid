import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Car } from "@/types/car";
import { useState, useEffect } from "react";

interface CarCardProps {
  car: Car;
  onClick: () => void;
  onAddToCart?: (car: Car) => void;
  onAddToFavorites?: (car: Car) => void;
  isFavorite?: boolean;
  isInCart?: boolean;
}

export default function CarCard({
  car,
  onClick,
  onAddToCart,
  onAddToFavorites,
  isFavorite = false,
  isInCart = false,
}: CarCardProps) {
  const [isSold, setIsSold] = useState(false);
  const [loadingSoldStatus, setLoadingSoldStatus] = useState(true);

  useEffect(() => {
    const checkSoldStatus = async () => {
      try {
        setLoadingSoldStatus(true);
        const { checkIfCarSold } = await import("@/lib/supabase");
        const sold = await checkIfCarSold(parseInt(car.id));
        setIsSold(sold);
      } catch (error) {
        console.error("Error checking sold status:", error);
        setIsSold(false);
      } finally {
        setLoadingSoldStatus(false);
      }
    };

    checkSoldStatus();
  }, [car.id]);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative h-64 overflow-hidden" onClick={onClick}>
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.log("Image failed to load:", car.image);
              const target = e.target as HTMLImageElement;
              target.src = "/images/placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          ${new Intl.NumberFormat("en-US").format(car.price)}
        </div>

        {/* SOLD Badge */}
        {isSold && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-lg">
              SOLD
            </span>
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites?.(car);
            }}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(car);
            }}
            disabled={isSold}
            className={`p-2 rounded-full transition-colors ${
              isSold
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isInCart
                  ? "bg-blue-500 text-white"
                  : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            }`}
            aria-label={isSold ? "Car is sold" : "Add to cart"}
          >
            <ShoppingCart
              className={`w-4 h-4 ${isInCart ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="p-6" onClick={onClick}>
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{car.year}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
            {car.fuelType}
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
            {car.transmission}
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
            {car.carType}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Mileage</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat("en-US").format(car.mileage)} miles
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Engine</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {car.engine}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Horsepower</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {car.horsepower} hp
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Color</span>
            <p className="font-semibold text-gray-900 dark:text-white">
              {car.color}
            </p>
          </div>
        </div>

        {car.description && (
          <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {car.description}
            </p>
          </div>
        )}

        {/* Action buttons at bottom */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites?.(car);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "In Favorites" : "Add to Favorites"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(car);
            }}
            disabled={isSold}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              isSold
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isInCart
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <ShoppingCart
              className={`w-4 h-4 ${isInCart ? "fill-current" : ""}`}
            />
            {isSold ? "Sold" : isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
