import React, { useState, useEffect } from "react";
import { Car } from "../types/cars";
import { useFetchCars } from "../hooks/useFetchCars";
import { useFilterCars } from "../hooks/useFilterCars";
import { useCarStats } from "../hooks/useCarStats";
import { CarCard } from "./CarCard";
import { SearchFilter } from "./SearchFilter";
import { Pagination } from "./Pagination";
import { Car as CarIcon, Search, Filter } from "lucide-react";

interface InventoryProps {
  onCarAdded?: (car: Car) => void;
  refreshTrigger?: number;
}

export const Inventory: React.FC<InventoryProps> = ({
  onCarAdded,
  refreshTrigger,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recentlyAddedCars, setRecentlyAddedCars] = useState<Set<string>>(
    new Set(),
  );

  const { cars, loading, error, pagination, refetch, addCar } = useFetchCars({
    page: currentPage,
    itemsPerPage: 12,
  });

  const { stats } = useCarStats();

  const {
    filters,
    filteredCars,
    availableBrands,
    hasActiveFilters,
    updateFilters,
    resetFilters,
  } = useFilterCars(cars);

  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleCarAdded = (newCar: Car) => {
    addCar(newCar);
    setRecentlyAddedCars((prev) => new Set(prev).add(newCar.id));

    setTimeout(() => {
      setRecentlyAddedCars((prev) => {
        const newSet = new Set(prev);
        newSet.delete(newCar.id);
        return newSet;
      });
    }, 5000);

    onCarAdded?.(newCar);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isRecentlyAdded = (carId: string) => {
    return recentlyAddedCars.has(carId);
  };

  const getRecentlyAddedFromData = (cars: Car[]) => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return cars.filter(
      (car) => new Date(car.created_at).getTime() > threeDaysAgo,
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CarIcon className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading inventory
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CarIcon className="w-6 h-6 text-blue-600" />
              Car Inventory
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and browse your available vehicles
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {hasActiveFilters ? filteredCars.length : stats.total}
              </div>
              <div className="text-sm text-gray-600">
                {hasActiveFilters ? "Filtered" : "Total"} Cars
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-green-800 text-sm font-medium">Available</div>
            <div className="text-green-900 text-xl font-bold">
              {stats.available}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-yellow-800 text-sm font-medium">Reserved</div>
            <div className="text-yellow-900 text-xl font-bold">
              {stats.reserved}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-red-800 text-sm font-medium">Sold</div>
            <div className="text-red-900 text-xl font-bold">{stats.sold}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-800 text-sm font-medium">
              New This Week
            </div>
            <div className="text-blue-900 text-xl font-bold">
              {getRecentlyAddedFromData(cars).length}
            </div>
          </div>
        </div>
      </div>

      <SearchFilter
        filters={filters}
        availableBrands={availableBrands}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl h-64"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCars.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? "No cars found" : "No cars in inventory"}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first car to the inventory"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {!loading && filteredCars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isRecentlyAdded={isRecentlyAdded(car.id)}
            />
          ))}
        </div>
      )}

      {!loading && filteredCars.length > 0 && (
        <Pagination
          pagination={{
            ...pagination,
            totalItems: filteredCars.length,
            totalPages: Math.ceil(
              filteredCars.length / pagination.itemsPerPage,
            ),
          }}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
};
