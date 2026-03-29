import React from "react";
import { useSoldCarsWithDetails } from "../../../../hooks/useSoldCarsWithDetails";
import { CarCard } from "../../cars/components/CarCard";
import { Car as CarIcon, Calendar } from "lucide-react";

export const SoldCarsInventory: React.FC = () => {
  const { soldCars, loading, error } = useSoldCarsWithDetails();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CarIcon className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading sold cars
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (soldCars.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CarIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sold cars</h3>
        <p className="text-gray-600">
          Cars that have been sold will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soldCars.map((soldCar) => (
          <div key={soldCar.id} className="relative">
            <CarCard car={soldCar.car} forceSoldStatus={true} />

            <div className="mt-2 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Sold{" "}
                {new Date(soldCar.sold_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
