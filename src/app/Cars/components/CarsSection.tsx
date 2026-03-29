"use client";

import { useState, useEffect } from "react";
import { getCars } from "@/lib/supabase";
import { Car } from "@/types/car";
import { FilterState } from "./FilteringAndSorting";
import CarsHeader from "./CarsHeader";
import CarsGrid from "./CarsGrid";
import CarDialog from "./CarDialog";
import { useCarFilters } from "../hooks/useCarFilters";
import { useCartAndFavorites } from "../../../hooks/useCartAndFavorites";

interface CarsSectionProps {
  cars?: Car[];
  filters?: FilterState;
  searchQuery?: string;
  onResultsCountChange?: (count: number) => void;
  onOptionsReady?: (options: { brands: string[]; carTypes: string[]; fuelTypes: string[] }) => void;
}

export default function CarsSection({
  filters = {},
  searchQuery = "",
  onResultsCountChange,
  onOptionsReady,
}: CarsSectionProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Fetch cars from database on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carsData = await getCars();
        setCars(carsData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Derive unique filter options from loaded cars
  useEffect(() => {
    if (cars.length > 0 && onOptionsReady) {
      const brands = [...new Set(cars.map((c) => c.brand).filter(Boolean))].sort();
      const carTypes = [...new Set(cars.map((c) => c.carType).filter(Boolean))].sort();
      const fuelTypes = [...new Set(cars.map((c) => c.fuelType).filter(Boolean))].sort();
      onOptionsReady({ brands, carTypes, fuelTypes });
    }
  }, [cars, onOptionsReady]);
  const {
    addToCart,
    addToFavorites,
    removeFromCart,
    removeFromFavorites,
    cartItems,
    favoriteItems,
    isFavorite,
    isInCart,
  } = useCartAndFavorites();

  // Use custom hook for filtering and sorting logic
  const filteredCars = useCarFilters(cars, filters, searchQuery);

  // Notify parent of results count
  useEffect(() => {
    onResultsCountChange?.(filteredCars.length);
  }, [filteredCars.length, onResultsCountChange]);

  const handleAddToFavorites = (car: Car) => {
    if (isFavorite(car.id)) {
      removeFromFavorites(car);
    } else {
      addToFavorites(car);
    }
  };

  const handleAddToCart = (car: Car) => {
    if (isInCart(car.id)) {
      removeFromCart(car);
    } else {
      addToCart(car);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <CarsHeader />
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CarsGrid
            cars={filteredCars}
            onCarClick={setSelectedCar}
            onAddToCart={handleAddToCart}
            onAddToFavorites={handleAddToFavorites}
            favoriteCars={favoriteItems}
            cartCars={cartItems}
          />
        )}
        <CarDialog
          car={selectedCar}
          isOpen={!!selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      </div>
    </div>
  );
}
