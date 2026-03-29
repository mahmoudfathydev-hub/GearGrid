import { useMemo } from "react"
import { Car } from "@/types/car"
import { FilterState } from "../components/FilteringAndSorting"

export function useCarFilters(
  cars: Car[],
  filters: FilterState = {},
  searchQuery: string = ""
) {
  const filteredAndSearchedCars = useMemo(() => {
    return cars.filter((car) => {
      if (searchQuery && searchQuery.trim().length >= 3) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.carType.toLowerCase().includes(query) ||
          car.fuelType.toLowerCase().includes(query) ||
          car.transmission.toLowerCase().includes(query) ||
          car.color.toLowerCase().includes(query) ||
          car.description?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      if (filters.type && car.carType.toLowerCase() !== filters.type.toLowerCase()) return false;

      if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;

      if (filters.fuel && car.fuelType.toLowerCase() !== filters.fuel.toLowerCase()) return false;

      if (filters.minPrice && car.price < filters.minPrice) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;

      return true;
    });
  }, [cars, filters, searchQuery]);

  const sortedCars = useMemo(() => {
    return [...filteredAndSearchedCars].sort((a, b) => {
      switch (filters.sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "year-new":
          return b.year - a.year;
        case "year-old":
          return a.year - b.year;
        case "mileage-low":
          return a.mileage - b.mileage;
        case "mileage-high":
          return b.mileage - a.mileage;
        case "name-az":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case "name-za":
          return `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`);
        default:
          return 0;
      }
    });
  }, [filteredAndSearchedCars, filters.sort]);

  return sortedCars;
}
