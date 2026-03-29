"use client";

import { useState, useMemo } from "react";
import { Car, CarFilters } from "../types/cars";

export const useFilterCars = (cars: Car[]) => {
  const [filters, setFilters] = useState<CarFilters>({
    search: "",
    brand: "",
    sortBy: "created_at",
    sortOrder: "desc",
    availability: "all",
  });

  const filteredAndSortedCars = useMemo(() => {
    let filteredCars = [...cars];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCars = filteredCars.filter(
        (car) =>
          car.name.toLowerCase().includes(searchTerm) ||
          car.brand.toLowerCase().includes(searchTerm) ||
          car.description?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply brand filter
    if (filters.brand) {
      filteredCars = filteredCars.filter(
        (car) => car.brand.toLowerCase() === filters.brand.toLowerCase(),
      );
    }

    // Apply availability filter
    if (filters.availability && filters.availability !== "all") {
      filteredCars = filteredCars.filter(
        (car) => car.availability_status === filters.availability,
      );
    }

    // Apply sorting
    filteredCars.sort((a, b) => {
      const { sortBy, sortOrder } = filters;

      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      // Handle date sorting
      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filteredCars;
  }, [cars, filters]);

  const updateFilters = (newFilters: Partial<CarFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      brand: "",
      sortBy: "created_at",
      sortOrder: "desc",
      availability: "all",
    });
  };

  // Get unique brands for filter dropdown
  const availableBrands = useMemo(() => {
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.sort();
  }, [cars]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.search || filters.brand || filters.availability !== "all",
    );
  }, [filters]);

  return {
    filters,
    filteredCars: filteredAndSortedCars,
    availableBrands,
    hasActiveFilters,
    updateFilters,
    resetFilters,
  };
};
