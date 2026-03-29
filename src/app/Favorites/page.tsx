"use client";

import { useState, useEffect } from "react";
import { Car } from "@/types/car";
import { getCarsByIds } from "@/lib/supabase";
import { useCartAndFavorites } from "@/hooks/useCartAndFavorites";
import CarCard from "../Cars/components/CarCard";
import CarDialog from "../Cars/components/CarDialog";
import { Heart, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favoriteItems, cartItems, addToFavorites, addToCart, isFavorite, isInCart } = useCartAndFavorites();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    async function fetchFavoriteCars() {
      if (favoriteItems.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCarsByIds(favoriteItems);
        setCars(data);
      } catch (error) {
        console.error("Error fetching favorite cars:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteCars();
  }, [favoriteItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/Cars"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
          </div>
          
          {cars.length > 0 && (
            <button
              onClick={() => {
                // Since our hook doesn't have clearAll, we can just remove them one by one or add clearAll to hook
                // For now, let's keep it simple
                cars.forEach(car => addToFavorites(car));
              }}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="bg-red-50 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              You haven't saved any of your dream cars yet. Start exploring and click the heart icon to save them for later!
            </p>
            <Link
              href="/Cars"
              className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Explore Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onClick={() => setSelectedCar(car)}
                onAddToCart={() => addToCart(car)}
                onAddToFavorites={() => addToFavorites(car)}
                isFavorite={true}
                isInCart={isInCart(car.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CarDialog
        car={selectedCar}
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
      />
    </div>
  );
}
