"use client";

import { useState, useEffect } from "react";
import { Car } from "@/types/car";
import { getCarsByIds } from "@/lib/supabase";
import { useCartAndFavorites } from "@/hooks/useCartAndFavorites";
import CarCard from "../Cars/components/CarCard";
import CarDialog from "../Cars/components/CarDialog";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, favoriteItems, addToCart, addToFavorites, isInCart, isFavorite } = useCartAndFavorites();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    async function fetchCartCars() {
      if (cartItems.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCarsByIds(cartItems);
        setCars(data);
      } catch (error) {
        console.error("Error fetching cart cars:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartCars();
  }, [cartItems]);

  const getTotalPrice = () => {
    return cars.reduce((total, car) => total + car.price, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/Cars"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shopping Cart
          </h1>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              You haven't added any cars to your cart yet. Explore our collection of premium vehicles!
            </p>
            <Link
              href="/Cars"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Browse Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onClick={() => setSelectedCar(car)}
                    onAddToCart={() => addToCart(car)}
                    onAddToFavorites={() => addToFavorites(car)}
                    isFavorite={isFavorite(car.id)}
                    isInCart={true}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sticky top-8 border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Subtotal ({cars.length} cars)</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${new Intl.NumberFormat("en-US").format(getTotalPrice())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Delivery & Handling</span>
                    <span className="text-green-600 font-bold uppercase text-sm">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <span className="font-medium">Tax</span>
                    <span className="text-gray-500 italic text-sm">Calculated at checkout</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-xl font-black text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        ${new Intl.NumberFormat("en-US").format(getTotalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 mb-4">
                  Checkout Now
                </button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                  By proceeding to checkout you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
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
